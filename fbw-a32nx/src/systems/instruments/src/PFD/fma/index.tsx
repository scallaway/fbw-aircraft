import { DisplayComponent, FSComponent, Subscribable } from '@microsoft/msfs-sdk';

import { ArincEventBus } from '../../../MsfsAvionicsCommon/ArincEventBus';
import { ATOCell } from './ATOCell';

export class FMA extends DisplayComponent<{ bus: ArincEventBus, isAttExcessive: Subscribable<boolean> }> {
    render() {
        <g id="FMA">

            <g class="NormalStroke Grey">
                <path d={this.firstBorderSub} />
                <path d={this.secondBorderSub} />
                <path d="m102.52 0.33732v20.864" />
                <path d="m133.72 0.33732v20.864" />
            </g>
            <g class="cells">
                <ATOCell bus={this.props.bus} isAttExcessive={this.props.isAttExcessive} />
            </g>
        </g>;
    }
}
