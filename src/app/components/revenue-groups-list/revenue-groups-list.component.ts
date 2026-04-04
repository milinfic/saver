import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../ux/confirm-dialog/confirm-dialog';
import { TableComponent } from '../../ux/table/table.ux';
import { RevenueGroupService } from '../../services/revenue-group/revenue-group.services';
import { RevenueGroupsNew } from '../revenue-groups-new/revenue-groups-new';
import { UtilsService } from '../../services/utils/utils.service';
import { MESSAGE_SUCCESS_DELETE, MESSAGE_ERROR_GENERIC } from '../../constants/messages';

@Component({
  standalone: true,
  selector: 'app-revenue-groups-list',
  imports: [
    CommonModule,
    TableComponent
  ],
  template: `
  <app-table
  [datas]="revenueGroups"
  [headers]="headers"
  (actionEventTableComponent)="actionEventTableComponent($event)">
  </app-table>`
})
export class RevenueGroupsListComponent implements OnInit {
  
  headers: any[] = [
    { id: 'name', text: 'Nome' },
    { id: 'color', text: 'Cor' },
    { id: 'date', text: 'Data de Criação' },
    { id: 'actions', text: '' },
  ]

  displayedColumns: string[] = this.headers.map(h => h.id);

  revenueGroups: any[] = [];

  constructor(
    private revenueGroupService: RevenueGroupService,
    private dialog: MatDialog,
    private utils: UtilsService
  ) { }

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.revenueGroupService.read().subscribe((res) => {
      if (res && Array.isArray(res)) {
        this.revenueGroups = res.map(r => ({
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
        this.revenueGroupService.delete(id).subscribe({
          next: () => {
            this.utils.showAutoCloseMessage(MESSAGE_SUCCESS_DELETE, 'green', 2000);
            this.carregarDados();
          },
          error: (err) => {
            this.utils.handleApiError(err, MESSAGE_ERROR_GENERIC);
          }
        });
      }
    });
  }

  update(id: any): void {
    const dialogRef = this.dialog.open(RevenueGroupsNew, {
      width: '80%',
      data: { revenueGroupId: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      // somente sucesso
      if (result) {
        this.carregarDados();
      }
    });
  }
}
