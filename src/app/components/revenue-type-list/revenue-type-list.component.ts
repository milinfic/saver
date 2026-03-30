import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../ux/confirm-dialog/confirm-dialog';
import { RevenueNewType } from '../revenue-type-new/revenue-type-new';
import { TableComponent } from '../../ux/table/table.ux';
import { RevenueTypeService } from '../../services/revenue-type/revenue-type.services';

@Component({
  standalone: true,
  selector: 'app-revenue-type-list',
  imports: [
    CommonModule,
    TableComponent
  ],
  template: `
  <app-table
  [datas]="revenueTypes"
  [headers]="headers"
  (actionEventTableComponent)="actionEventTableComponent($event)">
  </app-table>`
})
export class RevenueTypeList implements OnInit {

  expensives: any[] = [];
  headers: any[] = [
    { id: 'name', text: 'Nome' },
    { id: 'group', text: 'Grupo' },
    { id: 'date', text: 'Data de Criação' },
    { id: 'actions', text: '' },
  ]

  displayedColumns: string[] = this.headers.map(h => h.id);

  revenueTypes: any[] = [];

  constructor(
    private revenueTypeService: RevenueTypeService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.revenueTypeService.read().subscribe((res) => {
      if (res && Array.isArray(res)) {
        this.revenueTypes = res.map(r => ({
          id: r['id'],
          name: r['name'],
          group: r['column'],
          date: r['date']
        }));
      }
    });
  }

  actionEventTableComponent(evt: any) {
    if (!evt) return;
    if (evt.type === 'delete') this.delete(evt.data.id);
    if (evt.type === 'update') this.update(evt.data.id);
  }

  delete(id: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '600px',
      height: '200px',
      data: { message: 'Tem certeza que deseja excluir?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.revenueTypeService.delete(id).subscribe(() => {
          this.carregarDados();
        });
      }
    });
  }

  update(id: any): void {
    const dialogRef = this.dialog.open(RevenueNewType, {
      width: '80%',
      data: { revenueTypeId: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      // somente sucesso
      if (result) {
        this.carregarDados();
      }
    });
  }
}