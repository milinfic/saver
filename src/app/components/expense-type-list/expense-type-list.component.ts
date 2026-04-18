import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ExpenseTypeService } from '../../services/expense-type/expense-type.services';
import { ConfirmDialogComponent } from '../../ux/confirm-dialog/confirm-dialog';
import { ExpenseNewType } from '../../components/expense-type-new/expense-type-new';
import { TableComponent } from '../../ux/table/table.ux';
import { UtilsService } from '../../services/utils/utils.service';
import { MESSAGE_SUCCESS_DELETE, MESSAGE_ERROR_GENERIC } from '../../constants/messages';
import { FiltersComponent } from '../filters/filters.component';

@Component({
  standalone: true,
  selector: 'app-expense-type-list',
  imports: [
    CommonModule,
    TableComponent,
    FiltersComponent
  ],
  template: `
  <app-filters
    [showSpinner]="showSpinner"
    [textFilter]="textFilter"
    (filtersApplied)="carregarDados($event)"
    (filtersCreatedApplied)="onFiltersCreatedApplied()">
  </app-filters>
  
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
    // { id: 'date', text: 'Data de Criação' },
    { id: 'actions', text: '' },
  ]

  displayedColumns: string[] = this.headers.map(h => h.id);

  expensivesTypes: any[] = [];

  showSpinner: boolean = false;
  textFilter: string = 'Tipo de Despesa';
  filters: object = {};

  constructor(
    private expensiveTypeService: ExpenseTypeService,
    private dialog: MatDialog,
    private utils: UtilsService
  ) { }

  ngOnInit(): void {
    this.carregarDados({});
  }

  carregarDados(data: any): void {
    this.expensiveTypeService.read(data).subscribe((res) => {
      if (res && Array.isArray(res)) {
        this.expensivesTypes = res.map(r => ({
          id: r?.id || null,
          name: r?.name || null,
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
        this.expensiveTypeService.delete(id).subscribe({
          next: () => {
            this.utils.showAutoCloseMessage(MESSAGE_SUCCESS_DELETE, 'green', 2000);
            this.carregarDados({});
          },
          error: (err) => {
            this.utils.handleApiError(err, MESSAGE_ERROR_GENERIC);
          }
        });
      }
    });
  }

  onFiltersCreatedApplied() {
    this.setDialogRef({
      width: '80%',
      maxHeight: '100vh'
    });
  }

  update(id: any): void {    
    this.setDialogRef({
      width: '80%',
      maxHeight: '100vh',
      data: { expenseTypeId: id }
    });
  }

  setDialogRef(obj: Object) {
    const dialogRef = this.dialog.open(ExpenseNewType, obj);

    dialogRef.afterClosed().subscribe(result => {
      // somente sucesso
      if (result) {
        this.carregarDados({});
      }
    });
  }
}