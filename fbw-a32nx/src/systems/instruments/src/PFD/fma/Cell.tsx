import { DisplayComponent, FSComponent, NodeReference } from '@microsoft/msfs-sdk';

import { EngagedModes } from './rows/EngagedModes';
import { ArmedModes } from './rows/ArmedModes';
import { Reminders } from './rows/Reminders';

/**
 * A container class for displaying information in each of the 5 FMA Cells
 */
export class Cell<T> extends DisplayComponent<T> {
    private timeout: number = 0;

    private displayTimeInSeconds: number;

    protected armedRow: NodeReference<ArmedModes>;

    protected engagedRow: NodeReference<EngagedModes>;

    protected remindersRow: NodeReference<Reminders>;

    protected isShown = false;

    protected modeChangedPathRef = FSComponent.createRef<SVGPathElement>();

    protected constructor(props: T, displayTimeInSeconds: number) {
        super(props);
        this.displayTimeInSeconds = displayTimeInSeconds;
    }

    public hideModeChangedPath = () => {
        clearTimeout(this.timeout);
        this.modeChangedPathRef.instance.classList.remove('ModeChangedPath');
    }

    public displayModeChangedPath = () => {
        this.modeChangedPathRef.instance.classList.add('ModeChangedPath');
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.modeChangedPathRef.instance.classList.remove('ModeChangedPath');
        }, this.displayTimeInSeconds * 1000);
    }

    render() {
        return (
            <g>
                { this.engagedRow.getOrDefault() }
                { this.armedRow.getOrDefault() }
                { this.remindersRow.getOrDefault() }
            </g>
        );
    }
}
