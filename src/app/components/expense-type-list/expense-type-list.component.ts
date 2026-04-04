import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ExpenseTypeService } from '../../services/expense-type/expense-type.services';
import { ConfirmDialogComponent } from '../../ux/confirm-dialog/confirm-dialog';
import { ExpenseNewType } from '../../components/expense-type-new/expense-type-new';
import { TableComponent } from '../../ux/table/table.ux';

@Component({
  standalone: true,
  selector: 'app-expense-type-list',
  imports: [
    CommonModule,
    TableComponent
  ],
  template: `
  <app-table
  [datas]="expensivesTypes"
  [headers]="headers"
  (actionEventTableComponent)="actionEventTableComponent($event)">
  </app-table>`
})
export class ExpenseTypeList implements OnInit {

  expensives: any[] = [];
  headers: any[] = [
    { id: 'name', text: 'Nome' },
    { id: 'group', text: 'Grupo' },
    { id: 'date', text: 'Data de Criação' },
    { id: 'actions', text: '' },
  ]

  displayedColumns: string[] = this.headers.map(h => h.id);

  expensivesTypes: any[] = [];

  constructor(
    private expensiveTypeService: ExpenseTypeService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.expensiveTypeService.read().subscribe((res) => {
      if (res && Array.isArray(res)) {
        this.expensivesTypes = res.map(r => ({
          id: r?.id || null,
          name: r?.name || null,
          expense_group_id: r?.expense_group_id || null,
          group: r?.group || null,
          date: r?.date || null
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
      width: '80%',
      height: '200px',
      data: { message: 'Tem certeza que deseja excluir?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.expensiveTypeService.delete(id).subscribe(() => {
          this.carregarDados();
        });
      }
    });
  }

  update(id: any): void {
    const dialogRef = this.dialog.open(ExpenseNewType, {
      width: '80%',
      data: { expenseTypeId: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      // somente sucesso
      if (result) {
        this.carregarDados();
      }
    });
  }
}