import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ExpenseTypeService } from '../../services/expense-type/expense-type.services';
import { ConfirmDialogComponent } from '../../ux/confirm-dialog/confirm-dialog';
import { ExpenseNewType } from '../../components/expense-type-new/expense-type-new';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  selector: 'app-expense-type-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './expense-type-list.component.html'
})
export class ExpenseTypeList implements OnInit {

  displayedColumns: string[] = ['nome', 'coluna', 'dataCriacao', 'acoes'];
  dados: any[] = [];

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
        this.dados = res.map(r => ({
          id: r['id'],
          nome: r['name'],
          coluna: r['column'],
          dataCriacao: r['date']
        }));
      }
    });
  }

  excluir(id: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      height: '200px',
      data: { message: 'Tem certeza que deseja excluir?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.expensiveTypeService.delete(id).subscribe(() => {
          this.carregarDados();
        });
      }
    });
  }

  edit(id: any): void {
    const dialogRef = this.dialog.open(ExpenseNewType, {
      width: '400px',
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