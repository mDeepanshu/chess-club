import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Coordinate } from './board.models';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {

  blackToMove: boolean = false;
  blackCastle: boolean = true;
  whiteCastle: boolean = true;

  selectedPieceLoc: Coordinate = { x: -1, y: -1 };
  loc: Coordinate = { x: -1, y: -1 };

  whitePieces = ['rw', 'nw', 'bw', 'qw', 'kw', 'pw'];
  blackPieces = ['r', 'n', 'b', 'q', 'k', 'p'];

  pieces = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r', ''],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw', ''],
    ['rw', 'nw', 'bw', 'qw', 'kw', 'bw', 'nw', 'rw', '']
  ];

  piecesSelected(piece: string, x: number, y: number) {
    if (this.selectedPieceLoc.x == -1 && this.pieces[x][y] != '') this.selectedPieceLoc = { x: x, y: y };
  }

  squareHover(x: number, y: number) {
    if (this.selectedPieceLoc.x != -1) {
      this.loc = { x: x, y: y };
    }
  }

  pieceDrop(x: number, y: number, piece: string, $event: MouseEvent, enter: boolean) {

    if (this.selectedPieceLoc.x == this.loc.x && this.selectedPieceLoc.y == this.loc.y) {
      this.resetSquare();
      return;
    }
    if (!this.isValidMove(piece, this.selectedPieceLoc, this.loc)) {
      this.resetSquare();
      return;
    }

    this.pieces[this.loc.x][this.loc.y] = piece;
    this.pieces[this.selectedPieceLoc.x][this.selectedPieceLoc.y] = '';
    this.blackToMove = !this.blackToMove;
    this.resetSquare();

  }

  resetSquare() {
    this.selectedPieceLoc = { x: -1, y: -1 };
    this.loc = { x: -1, y: -1 };
  }

  isValidMove(piece: string, fromLoc: Coordinate, toLoc: Coordinate): boolean {
    if ((this.whitePieces.includes(piece) && (this.whitePieces.includes(this.pieces[toLoc.x][toLoc.y]) || this.blackToMove)) ||
      (this.blackPieces.includes(piece) && (this.blackPieces.includes(this.pieces[toLoc.x][toLoc.y]) || !this.blackToMove))) return false;

    if (piece == 'p') return this.pawnMove(fromLoc, toLoc, 1);
    if (piece == 'pw') return this.pawnMove(fromLoc, toLoc, -1);
    if (piece == 'b' || piece == 'bw') return this.bishopMove(fromLoc, toLoc);
    if (piece == 'n' || piece == 'nw') return this.knightMove(fromLoc, toLoc);
    if (piece == 'r' || piece == 'rw') return this.rookMove(fromLoc, toLoc);
    if (piece == 'q' || piece == 'qw') return this.queenMove(fromLoc, toLoc);
    if (piece == 'k' || piece == 'kw') return this.kingMove(fromLoc, toLoc, piece);
    return true;
  }

  pawnMove(fromLoc: Coordinate, toLoc: Coordinate, dir: 1 | -1): boolean {
    if (((dir == 1 && fromLoc.x == 1) || (dir == -1 && fromLoc.x == 6)) && toLoc.x - fromLoc.x == 2 * dir && fromLoc.y == toLoc.y) return true;
    if (Math.abs(fromLoc.y - toLoc.y) === 1 && this.pieces[toLoc.x][toLoc.y] != '') return true;
    if (Math.abs(fromLoc.x - toLoc.x) === 1 && this.pieces[toLoc.x][toLoc.y] == '' && Math.abs(fromLoc.y - toLoc.y) === 0) return true;
    // if (Math.abs(fromLoc.y - toLoc.y) > 1 || toLoc.x - fromLoc.x != dir) return false;
    return false;
  }

  bishopMove(fromLoc: Coordinate, toLoc: Coordinate): boolean {

    let xStep = (toLoc.x - fromLoc.x) > 0 ? 1 : -1;
    let yStep = (toLoc.y - fromLoc.y) > 0 ? 1 : -1;
    let xCurr = fromLoc.x + xStep;
    let yCurr = fromLoc.y + yStep;
    while (xCurr != toLoc.x && yCurr != toLoc.y) {
      if (this.pieces[xCurr][yCurr] != '') return false;
      xCurr += xStep;
      yCurr += yStep;
    }

    if (Math.abs((fromLoc.x - toLoc.x)) == Math.abs((fromLoc.y - toLoc.y))) return true;
    return false;
  }

  knightMove(fromLoc: Coordinate, toLoc: Coordinate): boolean {
    if ((Math.abs(fromLoc.x - toLoc.x) == 2 && Math.abs(fromLoc.y - toLoc.y) == 1) ||
      (Math.abs(fromLoc.x - toLoc.x) == 1 && Math.abs(fromLoc.y - toLoc.y) == 2)) return true;
    return false;
  }

  rookMove(fromLoc: Coordinate, toLoc: Coordinate): boolean {
    if (fromLoc.x == toLoc.x) {
      let minY = Math.min(fromLoc.y, toLoc.y);
      let maxY = Math.max(fromLoc.y, toLoc.y);
      for (let y = minY + 1; y < maxY; y++) {
        if (this.pieces[fromLoc.x][y] != '') return false;
      }
    }
    else if (fromLoc.y == toLoc.y) {
      let minX = Math.min(fromLoc.x, toLoc.x);
      let maxX = Math.max(fromLoc.x, toLoc.x);
      for (let x = minX + 1; x < maxX; x++) {
        if (this.pieces[x][fromLoc.y] != '') return false;
      }
    }

    if (fromLoc.x == toLoc.x || fromLoc.y == toLoc.y) return true;
    return false;
  }

  queenMove(fromLoc: Coordinate, toLoc: Coordinate): boolean {
    if (this.bishopMove(fromLoc, toLoc) || this.rookMove(fromLoc, toLoc)) return true;
    return false;
  }

  kingMove(fromLoc: Coordinate, toLoc: Coordinate, piece: string): boolean {
    if (Math.abs(fromLoc.x - toLoc.x) <= 1 && Math.abs(fromLoc.y - toLoc.y) <= 1) return true;
    if (Math.abs(fromLoc.y - toLoc.y) == 2 && this.whitePieces.includes(piece) && this.whiteCastle) {
      if (toLoc.y < fromLoc.y) {
        if (this.pieces[7][3] != '' || this.pieces[7][2] != '' || this.pieces[7][1] != '') return false;
        this.pieces[7][3] = 'rw';
        this.pieces[7][0] = '';
      } else {
        if (this.pieces[7][5] != '' || this.pieces[7][6] != '') return false;
        this.pieces[7][5] = 'rw';
        this.pieces[7][7] = '';
      }
      this.whiteCastle = false;
      return true;
    }else if (Math.abs(fromLoc.y - toLoc.y) == 2 && this.blackPieces.includes(piece) && this.blackCastle) {
      if (toLoc.y < fromLoc.y) {
        if (this.pieces[0][3] != '' || this.pieces[0][2] != '' || this.pieces[0][1] != '') return false;
        this.pieces[0][3] = 'r';
        this.pieces[0][0] = '';
      } else {
        if (this.pieces[0][5] != '' || this.pieces[0][6] != '') return false;
        this.pieces[0][5] = 'r';
        this.pieces[0][7] = '';
      }
      this.blackCastle = false;
      return true;
    }
    return false;
  }


}
