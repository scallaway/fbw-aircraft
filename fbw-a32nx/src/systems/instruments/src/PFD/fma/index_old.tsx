import { DisplayComponent, FSComponent, Subject, Subscribable, VNode } from '@microsoft/msfs-sdk';

import { Arinc429Word } from '@flybywiresim/fbw-sdk';
import { Arinc429Values } from '../shared/ArincValueProvider';
import { PFDSimvars } from '../shared/PFDSimvarPublisher';
import { ArincEventBus } from '../../MsfsAvionicsCommon/ArincEventBus';

export class FMA extends DisplayComponent<{ bus: ArincEventBus, isAttExcessive: Subscribable<boolean> }> {
    private activeLateralMode: number = 0;

    private activeVerticalMode: number = 0;

    private armedVerticalModeSub = Subject.create(0);

    private athrModeMessage = 0;

    private machPreselVal = 0;

    private speedPreselVal = 0;

    private setHoldSpeed = false;

    private tdReached = false;

    private checkSpeedMode = false;

    private tcasRaInhibited = Subject.create(false);

    private trkFpaDeselected = Subject.create(false);

    private fcdcDiscreteWord1 = new Arinc429Word(0);

    private fwcFlightPhase = 0;

    private firstBorderSub = Subject.create('');

    private secondBorderSub = Subject.create('');

    private AB3Message = Subject.create(false);

    private handleFMABorders() {
        const sharedModeActive = this.activeLateralMode === 32 || this.activeLateralMode === 33
            || this.activeLateralMode === 34 || (this.activeLateralMode === 20 && this.activeVerticalMode === 24);
        const BC3Message = getBC3Message(this.props.isAttExcessive.get(), this.armedVerticalModeSub.get(),
            this.setHoldSpeed, this.trkFpaDeselected.get(), this.tcasRaInhibited.get(), this.fcdcDiscreteWord1, this.fwcFlightPhase, this.tdReached, this.checkSpeedMode)[0] !== null;

        const engineMessage = this.athrModeMessage;
        const AB3Message = (this.machPreselVal !== -1
            || this.speedPreselVal !== -1) && !BC3Message && engineMessage === 0;

        let secondBorder: string;
        if (sharedModeActive && !this.props.isAttExcessive.get()) {
            secondBorder = '';
        } else if (BC3Message) {
            secondBorder = 'm66.241 0.33732v15.766';
        } else {
            secondBorder = 'm66.241 0.33732v20.864';
        }

        let firstBorder: string;
        if (AB3Message && !this.props.isAttExcessive.get()) {
            firstBorder = 'm33.117 0.33732v15.766';
        } else {
            firstBorder = 'm33.117 0.33732v20.864';
        }

        this.AB3Message.set(AB3Message);
        this.firstBorderSub.set(firstBorder);
        this.secondBorderSub.set(secondBorder);
    }

    onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars & Arinc429Values>();

        this.props.isAttExcessive.sub((_a) => {
            this.handleFMABorders();
        });

        sub.on('fmaVerticalArmed').whenChanged().handle((a) => {
            this.armedVerticalModeSub.set(a);
            this.handleFMABorders();
        });

        sub.on('activeLateralMode').whenChanged().handle((activeLateralMode) => {
            this.activeLateralMode = activeLateralMode;
            this.handleFMABorders();
        });
        sub.on('activeVerticalMode').whenChanged().handle((activeVerticalMode) => {
            this.activeVerticalMode = activeVerticalMode;
            this.handleFMABorders();
        });

        sub.on('speedPreselVal').whenChanged().handle((s) => {
            this.speedPreselVal = s;
            this.handleFMABorders();
        });

        sub.on('machPreselVal').whenChanged().handle((m) => {
            this.machPreselVal = m;
            this.handleFMABorders();
        });

        sub.on('setHoldSpeed').whenChanged().handle((shs) => {
            this.setHoldSpeed = shs;
            this.handleFMABorders();
        });

        sub.on('tcasRaInhibited').whenChanged().handle((tra) => {
            this.tcasRaInhibited.set(tra);
            this.handleFMABorders();
        });

        sub.on('trkFpaDeselectedTCAS').whenChanged().handle((trk) => {
            this.trkFpaDeselected.set(trk);
            this.handleFMABorders();
        });

        sub.on('fcdcDiscreteWord1').atFrequency(1).handle((fcdcDiscreteWord1) => {
            this.fcdcDiscreteWord1 = fcdcDiscreteWord1;
            this.handleFMABorders();
        });

        sub.on('fwcFlightPhase').whenChanged().handle((fwcFlightPhase) => {
            this.fwcFlightPhase = fwcFlightPhase;
        });

        sub.on('tdReached').whenChanged().handle((tdr) => {
            this.tdReached = tdr;
            this.handleFMABorders();
        });

        sub.on('checkSpeedMode').whenChanged().handle((csm) => {
            this.checkSpeedMode = csm;
            this.handleFMABorders();
        });
    }

    render(): VNode {
        return (
            <g id="FMA">
                <g class="NormalStroke Grey">
                    <path d={this.firstBorderSub} />
                    <path d={this.secondBorderSub} />
                    <path d="m102.52 0.33732v20.864" />
                    <path d="m133.72 0.33732v20.864" />
                </g>

                <Row1 bus={this.props.bus} isAttExcessive={this.props.isAttExcessive} />
                <Row2 bus={this.props.bus} isAttExcessive={this.props.isAttExcessive} />
                <Row3
                    bus={this.props.bus}
                    isAttExcessive={this.props.isAttExcessive}
                    AB3Message={this.AB3Message}
                />
            </g>
        );
    }
}