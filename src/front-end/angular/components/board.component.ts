import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { board, emptyTile, flexGrowRow, tileByNumber } from '../../styles';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'board',
  host: {
    class:
      'ba bw2 b--angular-red mr2 mr4-ns flex flex-column shadow-angular-red w-two-thirds relative',
  },
  template: `
    <h3 class="blue-black bg-angular-red f4 f2-m f1-l ma0 pt1 pt2-m pt3-l tc">LEVEL {{level}}</h3>
    <div class="${board}">
      <score-hint-cloud
        [lastOverflowBonus]="lastOverflowBonus"
        [lastFwBonus]="lastFwBonus"
        [lastFwBonusFw]="lastFwBonusFw"
        [lastClearScore]="lastClearScore"
        [lastLevelScore]="lastLevelScore"
        [lastScoreUpdate]="lastScoreUpdate"
        [firstAnimationBlock]="firstAnimationBlock"
        [scoreDuration]="scoreDuration"
        [width]="width"
        [height]="height"
      >
      </score-hint-cloud>
      <div class="${flexGrowRow}" *ngFor="let row of board; trackBy: trackCol;">
        <tile [ngClass]="tile === 0 ? emptyTile : tileByNumber(tile)"
          *ngFor="let tile of row; trackBy: trackRow;" [value]="tile">
        </tile>
      </div>
    </div>
`,
})
export class Board {
  @Input() board: number[][];
  @Input() level: number;
  @Input() width: number;
  @Input() height: number;
  @Input() isPaused: boolean;
  @Input() lastOverflowBonus: number = 0;
  @Input() lastFwBonus: number = 0;
  @Input() lastFwBonusFw: number = 0;
  @Input() lastClearScore: number = 0;
  @Input() lastLevelScore: number = 0;
  @Input() lastScoreUpdate: number = 0;
  @Input() firstAnimationBlock: number = -1;
  @Input() scoreDuration: number = 2000;

  cols: number[][];
  emptyTile: string = emptyTile;
  rows: number[];
  tileByNumber = tileByNumber;

  trackCol(index: number) {
    return index;
  }

  trackRow(_, value: number) {
    return value;
  }
}
