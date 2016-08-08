import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import {
  emptyTile,
  flexGrowRow,
  tileByNumber,
} from '../../styles';
import { Tile } from './tile.component';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [ Tile ],
  selector: 'board',
  template: `
    <div class="${flexGrowRow}" *ngFor="let row of board; trackBy: trackCol">
      <tile [ngClass]="tile === 0 ? emptyTile : tileByNumber(tile)"
       *ngFor="let tile of row; trackBy: trackRow" [value]="tile"></tile>
    </div>
`,
})
export class Board {
  @Input() board: number[];
  @Input() width: number;

  cols: number[][];
  emptyTile: string;
  rows: number[];
  tileByNumber: Function;
  constructor() {
    this.emptyTile = emptyTile;
    this.tileByNumber = tileByNumber;
  }

  trackCol(index: number) {
    return index;
  }

  trackRow(index: number, value: number) {
    return value;
  }
}
