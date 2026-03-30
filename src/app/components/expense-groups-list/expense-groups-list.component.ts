import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../ux/confirm-dialog/confirm-dialog';
import { TableComponent } from '../../ux/table/table.ux';
import { ExpenseGroupService } from '../../services/expense-group/expense-group.services';
import { ExpenseGroupsNew } from '../expense-groups-new/expense-groups-new';

@Component({
  standalone: true,
  selector: 'app-expense-groups-list',
  imports: [
    CommonModule,
    TableComponent
  ],
  template: `
  <app-table
  [datas]="expensivesGroups"
  [headers]="headers"
  (actionEventTableComponent)="actionEventTableComponent($event)">
  </app-table>`
})
export class ExpenseGroupsListComponent implements OnInit {
  
  headers: any[] = [
    { id: 'name', text: 'Nome' },
    { id: 'color', text: 'Cor' },
    { id: 'date', text: 'Data de Criação' },
    { id: 'actions', text: '' },
  ]

  displayedColumns: string[] = this.headers.map(h => h.id);

  expensivesGroups: any[] = [];

  constructor(
    private expensiveGroupService: ExpenseGroupService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.expensiveGroupService.read().subscribe((res) => {
      if (res && Array.isArray(res)) {
        this.expensivesGroups = res.map(r => ({
          id: r['id'],
          name: r['name'],
          color: r['color'],
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
        this.expensiveGroupService.delete(id).subscribe(() => {
          this.carregarDados();
        });
      }
    });
  }

  update(id: any): void {
    const dialogRef = this.dialog.open(ExpenseGroupsNew, {
      width: '80%',
      data: { expenseNewGroupId: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      // somente sucesso
      if (result) {
        this.carregarDados();
      }
    });
  }
}