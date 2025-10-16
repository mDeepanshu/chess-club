import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {

  selectedPieceSquare: number = -1;
  idx = -1;

  pieces = [
    'r', 'n', 'b', 'q', 'k', 'b', 'n', 'r', '',
    'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', '',
    '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '',
    'pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw', '',
    'rw', 'nw', 'bw', 'qw', 'kw', 'bw', 'nw', 'rw', ''
  ];

  piecesSelected(piece: string, idx: number) {
    if (this.selectedPieceSquare == -1 && this.pieces[this.selectedPieceSquare] != '') this.selectedPieceSquare = idx;
  }

  squareHover(squareIdx: number) {
    if (this.selectedPieceSquare != -1) this.idx = squareIdx;
  }

  pd2(squareIdx: number, piece: string, $event: MouseEvent, enter: boolean) {

    if (this.selectedPieceSquare == this.idx) return;
    if (this.isValidMove(piece, this.selectedPieceSquare, this.idx) == false) return;

    this.pieces[this.idx] = piece;
    this.pieces[this.selectedPieceSquare] = '';
    this.selectedPieceSquare = -1;
    this.idx = -1;
  }

  isValidMove(piece: string, fromIdx: number, toIdx: number): boolean {
    if (piece == 'p') return this.pawnMove(fromIdx, toIdx, 1);
    if (piece == 'pw') return this.pawnMove(fromIdx, toIdx, -1);
    if (piece == 'b' || piece == 'bw') return this.bishopMove(fromIdx, toIdx);
    if (piece == 'n' || piece == 'nw') return this.knightMove(fromIdx, toIdx);
    if (piece == 'r' || piece == 'rw') return this.rookMove(fromIdx, toIdx);
    if (piece == 'q' || piece == 'qw') return this.queenMove(fromIdx, toIdx);
    if (piece == 'k' || piece == 'kw') return this.kingMove(fromIdx, toIdx);
    return true;
  }

  pawnMove(fromIdx: number, toIdx: number, dir: 1 | -1): boolean {
    if (fromIdx + 9 * (dir) == toIdx || fromIdx + 18 * (dir) == toIdx) {
      if (this.pieces[toIdx] == '') return true;
      return false;
    }
    if ((fromIdx + 8 * (dir) == toIdx || fromIdx + 10 * (dir) == toIdx) && this.pieces[toIdx] != '') return true;
    return false;
  }

  bishopMove(fromIdx: number, toIdx: number): boolean {
    const x = fromIdx % 9;
    const y = Math.floor(fromIdx / 9);
    const x2 = toIdx % 9;
    const y2 = Math.floor(toIdx / 9);
    if (Math.abs(x - x2) == Math.abs(y - y2)) return true;
    return false;
  }

  knightMove(fromIdx: number, toIdx: number): boolean {
    const x = fromIdx % 9;
    const y = Math.floor(fromIdx / 9);
    const x2 = toIdx % 9;
    const y2 = Math.floor(toIdx / 9);
    if ((Math.abs(x - x2) == 2 && Math.abs(y - y2) == 1) || (Math.abs(x - x2) == 1 && Math.abs(y - y2) == 2)) return true;
    return false;
  }

  rookMove(fromIdx: number, toIdx: number): boolean {
    if (Math.floor((fromIdx + 1) / 9) == Math.floor((toIdx + 1) / 9) || (fromIdx - toIdx) % 9 == 0) return true;
    return false;
  }

  queenMove(fromIdx: number, toIdx: number): boolean {
    if (this.rookMove(fromIdx, toIdx) || this.bishopMove(fromIdx, toIdx)) return true;
    return false;
  }

  kingMove(fromIdx: number, toIdx: number): boolean {
    const offsets = [1, -1, 8, -8, 9, -9, 10, -10];
    if (offsets.some(offset => fromIdx + offset === toIdx)) return true;
    return false;
  }


}
