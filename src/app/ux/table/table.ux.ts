import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

interface Header {
  id: string;
  text: string;
}

@Component({
  standalone: true,
  selector: 'app-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule
  ],
  templateUrl: './table.ux.html'
})
export class TableComponent implements OnInit {

  @Input() datas: any[] = [];

  @Input() headers: Header[] = [];

  @Output() actionEventTableComponent = new EventEmitter<any>();

  displayedColumns: string[] = [];

  ngOnInit(): void {
    this.displayedColumns = this.headers.map(h => h.id);
  }

  actionTableComponent(type: string, data: Object) {
    console.log();
    this.actionEventTableComponent.emit({ type, data });
  }
}