import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { ExpenseService } from '../../services/expense/expense.services';
import { TableComponent } from '../../ux/table/table.ux';
import { ConfirmDialogComponent } from '../../ux/confirm-dialog/confirm-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MESSAGE_SUCCESS_CREATE, MESSAGE_SUCCESS_DELETE, MESSAGE_ERROR_GENERIC } from '../../constants/messages';
import { UtilsService } from '../../services/utils/utils.service';
import { ExpenseNew } from '../expense-new/expense-new';
import { FiltersComponent } from '../filters/filters.component';

@Component({
  standalone: true,
  selector: 'app-expense-list',
  imports: [
    CommonModule,
    MatTableModule,
    TableComponent,
    FiltersComponent],
  template: `
  <app-filters
    entityType="expense"
    [showSpinner]="showSpinner"
    [textNewButton]="textNewButton"
    (filtersApplied)="onFiltersApplied($event)"
    (filtersCreatedApplied)="onFiltersCreatedApplied()">
  </app-filters>

  <app-table
  [datas]="displayedExpensives"
  [headers]="headers"
  (actionEventTableComponent)="actionEventTableComponent($event)">
  </app-table>`
})
export class ExpenseList implements OnInit {

  constructor(
    private expenseService: ExpenseService,
    private dialog: MatDialog,
    private utils: UtilsService
  ) { }

  expensives: any[] = [];
  displayedExpensives: any[] = [];
  headers: any[] = [
    { id: 'date', text: 'Data Criação' },
    { id: 'type', text: 'Tipo de Despesa' },
    { id: 'description', text: 'Descrição' },
    { id: 'value', text: 'Valor' },
    { id: 'actions', text: '' },
  ]

  displayedColumns: string[] = this.headers.map(h => h.id);

  showSpinner: boolean = false;
  textNewButton: string = 'Nova Despesa';


  ngOnInit(): void {
    this.getExpensives();
  }

  getExpensives(): void {
    this.expenseService.read().subscribe((res) => {
      if (res && Array.isArray(res)) {
        this.expensives = res.map(r => ({
          id: r['id'] || '',
          expense_type_id: r['expense_type_id'] || '',
          type: r['type'] || '',
          description: r['description'] || '',
          date: r['date'] || '',
          value: r['value'] || ''
        }));
        this.displayedExpensives = [...this.expensives];
      }
    });
  }

  onFiltersApplied(filteredExpensives: any[]): void {
    this.showSpinner = true;
    setTimeout(() => {
      this.showSpinner = false;
    },5000)
    this.displayedExpensives = filteredExpensives;
  }

  actionEventTableComponent(evt: any) {
    if (!evt) return;
    if (evt.type === 'delete') this.delete(evt.data.id);
    if (evt.type === 'update') this.update(evt.data.id);
  }

  delete(id: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      height: '200px',
      data: { message: 'Tem certeza que deseja excluir?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.expenseService.delete(id).subscribe({
          next: () => {
            this.utils.showAutoCloseMessage(MESSAGE_SUCCESS_DELETE, 'green', 2000);
            this.getExpensives();
          },
          error: (err) => {
            this.utils.handleApiError(err, MESSAGE_ERROR_GENERIC);
          }
        });
      }
    });
  }

  update(id: any): void {
    this.setDialogRef({
      width: '80%',
      data: { expenseId: id }
    });
  }

  onFiltersCreatedApplied() {
    this.setDialogRef({
      width: '80%'
    })
  }

  setDialogRef(obj: Object) {
    const dialogRef = this.dialog.open(ExpenseNew, obj);

    dialogRef.afterClosed().subscribe(result => {
      // somente sucesso
      if (result) {
        this.getExpensives();
      }
    });

  }

}
