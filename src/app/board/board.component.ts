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

  selectedPieceSquare:number  = -1;
  idx = -1;

  pieces = [
    'r', 'n', 'b', 'q', 'k', 'b', 'n', 'r','',
    'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p','',
    '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '','',
    '', '', '', '', '', '', '', '','',
    '', '', '', '', '', '', '', '','',
    'pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw','',
    'rw', 'nw', 'bw', 'qw', 'kw', 'bw', 'nw', 'rw',''
  ];

  piecesSelected(piece: string,idx: number) {
    console.log(piece);
    if (this.selectedPieceSquare == -1 && this.pieces[this.selectedPieceSquare]!='') this.selectedPieceSquare = idx;
  }
  
  squareHover(squareIdx: number) {
    console.log("squareHover",squareIdx,this.selectedPieceSquare);
    if (this.selectedPieceSquare!=-1) this.idx = squareIdx;
  }

  pd2(squareIdx: number,piece: string,$event: MouseEvent,enter: boolean){
      console.log(squareIdx,piece,enter,this.idx);
      if(this.selectedPieceSquare==this.idx) return;

      this.pieces[this.idx] = piece;
      this.pieces[this.selectedPieceSquare] = '';
      this.selectedPieceSquare = -1;
      this.idx = -1;
  }

}
