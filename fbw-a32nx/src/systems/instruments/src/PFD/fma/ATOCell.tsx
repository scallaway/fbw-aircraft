import { FSComponent } from '@microsoft/msfs-sdk';
import { ArincEventBus } from '../../MsfsAvionicsCommon/ArincEventBus';
import { Cell } from './Cell';

type ATOCellProps = {
    readonly bus: ArincEventBus;
}

enum AutoThrottleMode {
    MAN_TOGA = 1,
    MAN_GA_SOFT = 2,
    MAN_FLEX_XX = 3,
    MAN_DTO = 4,
    MAN_MCT = 5,
    MAN_THR = 6,
    SPEED_HOLD = 7,
}

/**
 * Handles Autothrust Mode Annunciations
 */
export class ATOCell extends Cell<ATOCellProps> {
    private athrMode = AutoThrottleMode.MAN_TOGA;

    private cellRef = FSComponent.createRef<SVGGElement>();

    private flexTemp = 0;

    private autoBrakeActive = false;

    private autoBrakeMode = 0;

    private getFlexTempText(): string {
        const flexTemp = Math.round(this.flexTemp);
        return flexTemp >= 0 ? (`+${flexTemp}`) : flexTemp.toString();
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
        case 8:
            text = '<text  class="FontMedium MiddleAlign Green" x="16.782249" y="7.1280665">MACH</text>';
            this.displayModeChangedPath();
            break;
        case 9:
            text = '<text  class="FontMedium MiddleAlign Green" x="16.782249" y="7.1280665">THR MCT</text>';
            this.displayModeChangedPath();
            break;
        case 10:
            text = '<text  class="FontMedium MiddleAlign Green" x="16.782249" y="7.1280665">THR CLB</text>';
            this.displayModeChangedPath();
            break;
        case 11:
            text = '<text  class="FontMedium MiddleAlign Green" x="16.782249" y="7.1280665">THR LVR</text>';
            this.displayModeChangedPath();
            break;
        case 12:
            text = '<text  class="FontMedium MiddleAlign Green" x="16.782249" y="7.1280665">THR IDLE</text>';
            this.displayModeChangedPath();
            break;
        case 13:
            this.displayModeChangedPath(true);
            text = `<g>
                                <path class="NormalStroke Amber BlinkInfinite" d="m0.70556 1.8143h30.927v6.0476h-30.927z" />
                                <text class="FontMedium MiddleAlign Green" x="16.782249" y="7.1280665">A.FLOOR</text>
                            </g>`;
            break;
        case 14:
            this.displayModeChangedPath(true);
            text = `<g>
                                <path class="NormalStroke Amber BlinkInfinite" d="m0.70556 1.8143h30.927v6.0476h-30.927z" />
                                <text class="FontMedium MiddleAlign Green" x="16.782249" y="7.1280665">TOGA LK</text>
                            </g>`;
            break;
        default:
            if (this.autoBrakeActive) {
                switch (this.autoBrakeMode) {
                case 1:
                    text = '<text class="FontMedium MiddleAlign Green" x="16.782249" y="7.1280665">BRK LO</text>';
                    this.displayModeChangedPath();
                    break;
                case 2:
                    text = '<text class="FontMedium MiddleAlign Green" x="16.782249" y="7.1280665">BRK MED</text>';
                    this.displayModeChangedPath();
                    break;
                case 3:
                    text = '<text class="FontMedium MiddleAlign Green" x="16.782249" y="7.1280665">BRK MAX</text>';
                    this.displayModeChangedPath();
                    break;
                default:
                    text = '';
                    this.isShown = false;
                    this.displayModeChangedPath(true);
                }
            } else {
                text = '';
                this.isShown = false;
                this.displayModeChangedPath(true);
            }
        }

        this.cellRef.instance.innerHTML = text;
    }

    onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on('flexTemp').whenChanged().handle((f) => {
            this.flexTemp = f;
            this.setText();
        });

        sub.on('AThrMode').whenChanged().handle((athrMode) => {
            this.athrMode = athrMode;
            this.setText();
        });

        sub.on('autoBrakeActive').whenChanged().handle((am) => {
            this.autoBrakeActive = am;
            this.setText();
        });

        sub.on('autoBrakeMode').whenChanged().handle((a) => {
            this.autoBrakeMode = a;
        });
    }

    render() {
        return super.render();
    }
}
