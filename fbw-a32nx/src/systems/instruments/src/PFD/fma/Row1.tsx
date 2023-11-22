import { DisplayComponent, FSComponent, Subscribable, VNode } from '@microsoft/msfs-sdk';

import { ArincEventBus } from '../../MsfsAvionicsCommon/ArincEventBus';

export class Row1 extends DisplayComponent<{ bus: ArincEventBus, isAttExcessive: Subscribable<boolean> }> {
    private b1Cell = FSComponent.createRef<B1Cell>();

    private c1Cell = FSComponent.createRef<C1Cell>();

    private D1D2Cell = FSComponent.createRef<D1D2Cell>();

    private BC1Cell = FSComponent.createRef<BC1Cell>();

    private cellsToHide = FSComponent.createRef<SVGGElement>();

    onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        this.props.isAttExcessive.sub((a) => {
            if (a) {
                this.cellsToHide.instance.style.display = 'none';
                this.b1Cell.instance.displayModeChangedPath(true);
                this.c1Cell.instance.displayModeChangedPath(true);
                this.BC1Cell.instance.displayModeChangedPath(true);
            } else {
                this.cellsToHide.instance.style.display = 'inline';
                this.b1Cell.instance.displayModeChangedPath();
                this.c1Cell.instance.displayModeChangedPath();
                this.BC1Cell.instance.displayModeChangedPath();
            }
        });
    }

    render(): VNode {
        return (
            <g>
                <A1A2Cell bus={this.props.bus} />

                <g ref={this.cellsToHide}>
                    <B1Cell ref={this.b1Cell} bus={this.props.bus} />
                    <C1Cell ref={this.c1Cell} bus={this.props.bus} />
                    <D1D2Cell ref={this.D1D2Cell} bus={this.props.bus} />
                    <BC1Cell ref={this.BC1Cell} bus={this.props.bus} />
                </g>
                <E1Cell bus={this.props.bus} />
            </g>
        );
    }
}