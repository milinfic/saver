import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { ExpenseService } from '../../services/expense/expense.services';
import { TableComponent } from '../../ux/table/table.ux';
import { ConfirmDialogComponent } from '../../ux/confirm-dialog/confirm-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MESSAGE_SUCCESS_CREATE, MESSAGE_SUCCESS_DELETE } from '../../constants/messages';
import { UtilsService } from '../../services/utils/utils.service';

@Component({
  standalone: true,
  selector: 'app-expense-list',
  imports: [
    CommonModule,
    MatTableModule,
    TableComponent,
    ConfirmDialogComponent],
  templateUrl: './expense-list.component.html'
})
export class ExpenseList implements OnInit {

  constructor(
    private expenseService: ExpenseService,
    private dialog: MatDialog,
    private utils: UtilsService
  ) { }

  expensives: any[] = [];
  headers: any[] = [
    { id: 'date', text: 'Data Criação' },
    { id: 'expenseTypeId', text: 'Tipo de Gasto' },
    { id: 'description', text: 'Descrição' },
    { id: 'value', text: 'Valor' },
    { id: 'actions', text: '' },
  ]

  displayedColumns: string[] = this.headers.map(h => h.id);


  ngOnInit(): void {
    this.getExpensives();
  }

  getExpensives(): void {
    this.expenseService.read().subscribe((res) => {
      if (res && Array.isArray(res)) {
        this.expensives = res.map(r => ({
          id: r['id'] || '',
          expenseTypeId: r['expenseTypeId'] || '',
          description: r['description'] || '',
          date: r['date'] || '',
          value: r['value'] || ''
        }));
      }
    });

  }

  actionEventTableComponent(evt: any) {
    console.log(evt);
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
        this.expenseService.delete(id).subscribe(() => {
          this.utils.showAutoCloseMessage(MESSAGE_SUCCESS_DELETE, 'green', 5000);
          this.getExpensives();
        });
      }
    });
  }

  update(id: any) {
    console.log(id);
  }

}
