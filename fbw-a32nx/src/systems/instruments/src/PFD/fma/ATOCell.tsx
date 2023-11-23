import { FSComponent, VNode } from '@microsoft/msfs-sdk';
import { PFDSimvars } from '../shared/PFDSimvarPublisher';
import { ArincEventBus } from '../../MsfsAvionicsCommon/ArincEventBus';
import { Cell } from './Cell';
import { unreachable } from '../utils';

type ATOCellProps = {
    readonly bus: ArincEventBus;
}

enum AutoThrottleMode {
    UNSET = 0,
    MAN_TOGA = 1,
    MAN_GA_SOFT = 2,
    MAN_FLEX_XX = 3,
    MAN_DTO = 4,
    MAN_MCT = 5,
    MAN_THR = 6,
    SPEED_HOLD = 7,
    MACH_HOLD = 8,
    THR_MCT = 9,
    THR_CLB = 10,
    THR_LVR = 11,
    THR_IDLE = 12,
    A_FLOOR = 13,
    TOGA_LK = 14,
}

enum AutoBrakeMode {
    UNSET = 0,
    BRK_LO = 1,
    BRK_MED = 2,
    BRK_MAX = 3,
}

/**
 * Handles Autothrust Mode Annunciations
 */
export class ATOCell extends Cell<ATOCellProps> {
    private athrMode = AutoThrottleMode.UNSET;

    private autoBrakeMode = AutoBrakeMode.UNSET;

    private cellRef = FSComponent.createRef<SVGGElement>();

    private flexTemp = 0;

    private autoBrakeActive = false;

    private getFlexTempText(): string {
        const flexTemp = Math.round(this.flexTemp);
        return flexTemp >= 0 ? (`+${flexTemp}`) : flexTemp.toString();
    }

    private updateBrakeMode(): string {
        switch (this.autoBrakeMode) {
        case AutoBrakeMode.UNSET:
            this.isShown = false;
            this.hideModeChangedPath();
            return '';
        case AutoBrakeMode.BRK_LO:
            this.displayModeChangedPath();
            return '<text class="FontMedium MiddleAlign Green" x="16.782249" y="7.1280665">BRK LO</text>';
        case AutoBrakeMode.BRK_MED:
            this.displayModeChangedPath();
            return '<text class="FontMedium MiddleAlign Green" x="16.782249" y="7.1280665">BRK MED</text>';
        case AutoBrakeMode.BRK_MAX:
            this.displayModeChangedPath();
            return '<text class="FontMedium MiddleAlign Green" x="16.782249" y="7.1280665">BRK MAX</text>';
        default:
            return unreachable(this.autoBrakeMode);
        }
    }

    private setText() {
        let text: string = '';
        this.isShown = true;

        switch (this.athrMode) {
        case AutoThrottleMode.MAN_TOGA:
            this.hideModeChangedPath();
            text = `
                                <path class="NormalStroke White" d="m25.114 1.8143v13.506h-16.952v-13.506z" />
                                <text class="FontMedium MiddleAlign White" x="16.782249" y="7.1280665">MAN</text>
                                <text class="FontMedium MiddleAlign White" x="16.869141" y="14.351689">TOGA</text>
                            `;
            break;
        case AutoThrottleMode.MAN_GA_SOFT:
            this.hideModeChangedPath();
            text = `<g>
                                <path class="NormalStroke White" d="m31.521 1.8143v13.506h-30.217v-13.506z" />
                                <text class="FontMedium MiddleAlign White" x="16.782249" y="7.1280665">MAN</text>
                                <text class="FontMedium MiddleAlign White" x="16.869141" y="14.351689">GA SOFT</text>
                            </g>`;
            break;
        case AutoThrottleMode.MAN_FLEX_XX:
            this.hideModeChangedPath();
            text = `<g>
                                <path class="NormalStroke White" d="m31.521 1.8143v13.506h-30.217v-13.506z" />
                                <text class="FontMedium MiddleAlign White" x="16.782249" y="7.1280665">MAN</text>
                                <text class="FontMedium MiddleAlign White" x="16.869141" y="14.351689">
                                    <tspan xml:space="preserve">FLX  </tspan>
                                    <tspan class="Cyan">${this.getFlexTempText()}</tspan>
                                </text>
                            </g>`;

            break;
        case AutoThrottleMode.MAN_DTO:
            this.hideModeChangedPath();
            text = `<g>
                                <path class="NormalStroke White" d="m25.114 1.8143v13.506h-16.952v-13.506z" />
                                <text class="FontMedium MiddleAlign White" x="16.782249" y="7.1280665">MAN</text>
                                <text class="FontMedium MiddleAlign White" x="16.869141" y="14.351689">DTO</text>
                            </g>`;
            break;
        case AutoThrottleMode.MAN_MCT:
            this.hideModeChangedPath();
            text = `<g>
                                <path class="NormalStroke White" d="m25.114 1.8143v13.506h-16.952v-13.506z" />
                                <text class="FontMedium MiddleAlign White" x="16.782249" y="7.1280665">MAN</text>
                                <text class="FontMedium MiddleAlign White" x="16.869141" y="14.351689">MCT</text>
                            </g>`;
            break;
        case AutoThrottleMode.MAN_THR:
            this.hideModeChangedPath();
            text = `<g>
                                <path class="NormalStroke Amber" d="m25.114 1.8143v13.506h-16.952v-13.506z" />
                                <text class="FontMedium MiddleAlign White" x="16.782249" y="7.1280665">MAN</text>
                                <text class="FontMedium MiddleAlign White" x="16.869141" y="14.351689">THR</text>
                            </g>`;
            break;
        case AutoThrottleMode.SPEED_HOLD:
            text = '<text  class="FontMedium MiddleAlign Green" x="16.782249" y="7.1280665">SPEED</text>';
            this.displayModeChangedPath();
            break;
        case AutoThrottleMode.MACH_HOLD:
            text = '<text  class="FontMedium MiddleAlign Green" x="16.782249" y="7.1280665">MACH</text>';
            this.displayModeChangedPath();
            break;
        case AutoThrottleMode.THR_MCT:
            text = '<text  class="FontMedium MiddleAlign Green" x="16.782249" y="7.1280665">THR MCT</text>';
            this.displayModeChangedPath();
            break;
        case AutoThrottleMode.THR_CLB:
            text = '<text  class="FontMedium MiddleAlign Green" x="16.782249" y="7.1280665">THR CLB</text>';
            this.displayModeChangedPath();
            break;
        case AutoThrottleMode.THR_LVR:
            text = '<text  class="FontMedium MiddleAlign Green" x="16.782249" y="7.1280665">THR LVR</text>';
            this.displayModeChangedPath();
            break;
        case AutoThrottleMode.THR_IDLE:
            text = '<text  class="FontMedium MiddleAlign Green" x="16.782249" y="7.1280665">THR IDLE</text>';
            this.displayModeChangedPath();
            break;
        case AutoThrottleMode.A_FLOOR:
            this.hideModeChangedPath();
            text = `<g>
                                <path class="NormalStroke Amber BlinkInfinite" d="m0.70556 1.8143h30.927v6.0476h-30.927z" />
                                <text class="FontMedium MiddleAlign Green" x="16.782249" y="7.1280665">A.FLOOR</text>
                            </g>`;
            break;
        case AutoThrottleMode.TOGA_LK:
            this.hideModeChangedPath();
            text = `<g>
                                <path class="NormalStroke Amber BlinkInfinite" d="m0.70556 1.8143h30.927v6.0476h-30.927z" />
                                <text class="FontMedium MiddleAlign Green" x="16.782249" y="7.1280665">TOGA LK</text>
                            </g>`;
            break;
        default:
            text = this.updateBrakeMode();
        }

        this.cellRef.instance.innerHTML = text;
    }

    onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on('flexTemp').whenChanged().handle((flexTemp) => {
            this.flexTemp = flexTemp;
            this.setText();
        });

        sub.on('AThrMode').whenChanged().handle((athrMode) => {
            this.athrMode = athrMode;
            this.setText();
        });

        sub.on('autoBrakeActive').whenChanged().handle((autoBrakeActive) => {
            this.autoBrakeActive = autoBrakeActive;
            this.setText();
        });

        sub.on('autoBrakeMode').whenChanged().handle((autoBrakeMode) => {
            this.autoBrakeMode = autoBrakeMode;
        });
    }

    render() {
        return super.render();
    }
}
