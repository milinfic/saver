import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { ExpenseTypeService } from '../../services/expense-type/expense-type.services';

@Component({
  standalone: true,
  selector: 'app-expense-type-list',
  imports: [
    CommonModule,
    MatTableModule],
  templateUrl: './expense-type-list.component.html'
})
export class ExpenseTypeList implements OnInit {

  constructor(
    private expensiveTypeService: ExpenseTypeService
  ) { }

  dados: any[] = [];


  ngOnInit(): void {
    this.expensiveTypeService.read().subscribe((res) => {
      if (res && Array.isArray(res)) {
        this.dados = res.map(r => ({
          nome: r['name'],
          coluna: r['column'],
          dataCriacao: r['date']
        }));
      }
    });
  }

}
