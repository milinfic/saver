import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ExpenseService } from '../../services/expense/expense.services';
import { ExpenseTypeService } from '../../services/expense-type/expense-type.services';
import { ExpenseGroupService } from '../../services/expense-group/expense-group.services';
import { RevenueService } from '../../services/revenue/revenue.services';
import { RevenueTypeService } from '../../services/revenue-type/revenue-type.services';
import { RevenueGroupService } from '../../services/revenue-group/revenue-group.services';
import { UtilsService } from '../../services/utils/utils.service';

interface FilterType {
  id: number;
  name: string;
}

interface FilterGroup {
  id: number;
  name: string;
  color: string;
}

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatCardModule
  ],
  template: `
    <div class="filters-container">
      <mat-card class="filters-card">
        <mat-card-header>
          <mat-card-title>Filtros de {{ entityType === 'expense' ? 'Despesas' : 'Receitas' }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="filterForm" class="filters-form">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Data Inicial</mat-label>
                <input matInput [matDatepicker]="startPicker" formControlName="startDate" placeholder="dd/MM/aaaa" (input)="onDateInput($event, 'startDate')">
                <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
                <mat-datepicker #startPicker></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Data Final</mat-label>
                <input matInput [matDatepicker]="endPicker" formControlName="endDate" placeholder="dd/MM/aaaa" (input)="onDateInput($event, 'endDate')">
                <mat-datepicker-toggle matIconSuffix [for]="endPicker"></mat-datepicker-toggle>
                <mat-datepicker #endPicker></mat-datepicker>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>{{ entityType === 'expense' ? 'Tipo de Despesa' : 'Tipo de Receita' }}</mat-label>
                <mat-select formControlName="typeId">
                  <mat-option value="">Todos os tipos</mat-option>
                  <mat-option *ngFor="let type of types" [value]="type.id">
                    {{ type.name }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ entityType === 'expense' ? 'Grupo de Despesa' : 'Grupo de Receita' }}</mat-label>
                <mat-select formControlName="groupId">
                  <mat-option value="">Todos os grupos</mat-option>
                  <mat-option *ngFor="let group of groups" [value]="group.id">
                    <span [style.color]="group.color">●</span> {{ group.name }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-raised-button color="primary" (click)="applyFilters()" [disabled]="!filterForm.valid">
                <mat-icon>search</mat-icon>
                Filtrar
              </button>
              <button mat-button (click)="clearFilters()">
                <mat-icon>clear</mat-icon>
                Limpar
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .filters-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
      z-index: 0;
    }

    .filters-card {
      margin-bottom: 20px;
    }

    .filters-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-row {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }

    .form-row mat-form-field {
      flex: 1;
      min-width: 200px;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }

    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
      }

      .form-row mat-form-field {
        min-width: auto;
      }
    }
  `]
})
export class FiltersComponent implements OnInit {
  @Input() entityType: 'expense' | 'revenue' = 'expense';
  @Output() filtersApplied = new EventEmitter<any[]>();

  filterForm: FormGroup;
  types: FilterType[] = [];
  groups: FilterGroup[] = [];
  allItems: any[] = [];

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private expenseTypeService: ExpenseTypeService,
    private expenseGroupService: ExpenseGroupService,
    private revenueService: RevenueService,
    private revenueTypeService: RevenueTypeService,
    private revenueGroupService: RevenueGroupService,
    private utils: UtilsService
  ) {
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      typeId: [''],
      groupId: ['']
    });
  }

  ngOnInit(): void {
    this.loadTypes();
    this.loadGroups();
    this.loadAllItems();
  }

  ngOnChanges(): void {
    // Recarregar dados quando o entityType mudar
    if (this.entityType) {
      this.loadTypes();
      this.loadGroups();
      this.loadAllItems();
    }
  }

  loadTypes(): void {
    const service = this.entityType === 'expense' ? this.expenseTypeService : this.revenueTypeService;
    service.read().subscribe({
      next: (types) => {
        this.types = types || [];
      },
      error: (err) => {
        const entityName = this.entityType === 'expense' ? 'despesa' : 'receita';
        this.utils.handleApiError(err, `Erro ao carregar tipos de ${entityName}`);
      }
    });
  }

  loadGroups(): void {
    const service = this.entityType === 'expense' ? this.expenseGroupService : this.revenueGroupService;
    service.read().subscribe({
      next: (groups) => {
        this.groups = groups || [];
      },
      error: (err) => {
        const entityName = this.entityType === 'expense' ? 'despesa' : 'receita';
        this.utils.handleApiError(err, `Erro ao carregar grupos de ${entityName}`);
      }
    });
  }

  loadAllItems(): void {
    const service = this.entityType === 'expense' ? this.expenseService : this.revenueService;
    const typeField = this.entityType === 'expense' ? 'expense_type_id' : 'revenue_type_id';
    const groupField = this.entityType === 'expense' ? 'expense_group_id' : 'revenue_group_id';

    service.read().subscribe({
      next: (items) => {
        this.allItems = items || [];
        // Mapeia os dados para incluir informações de tipo e grupo
        this.allItems = this.allItems.map(item => ({
          ...item,
          type: this.getTypeName(item[typeField]),
          group: this.getGroupName(item[groupField]),
          groupColor: this.getGroupColor(item[groupField])
        }));
      },
      error: (err) => {
        const entityName = this.entityType === 'expense' ? 'despesas' : 'receitas';
        this.utils.handleApiError(err, `Erro ao carregar ${entityName}`);
      }
    });
  }

  getTypeName(typeId: number): string {
    const type = this.types.find(t => t.id === typeId);
    return type ? type.name : 'Tipo não encontrado';
  }

  getGroupName(groupId: number): string {
    const group = this.groups.find(g => g.id === groupId);
    return group ? group.name : 'Grupo não encontrado';
  }

  getGroupColor(groupId: number): string {
    const group = this.groups.find(g => g.id === groupId);
    return group ? group.color : '#000000';
  }

  onDateInput(event: any, controlName: string): void {
    const rawValue = event.target.value || '';
    const formatted = this.formatDateString(rawValue);
    this.filterForm.get(controlName)?.setValue(formatted, { emitEvent: false });
  }

  formatDateString(value: string): string {
    const digits = value.replace(/\D/g, '');
    if (!digits) {
      return '';
    }

    if (digits.length <= 2) {
      return digits;
    }

    if (digits.length <= 4) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }

    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  }

  parseFilterDate(value: any): Date | null {
    if (!value) {
      return null;
    }

    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : value;
    }

    if (typeof value !== 'string') {
      return null;
    }

    const cleaned = value.trim();
    if (!cleaned) {
      return null;
    }

    const parts = cleaned.split('/');
    if (parts.length === 2) {
      const [day, month] = parts;
      const year = new Date().getFullYear();
      const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
      return this.isValidDate(parsedDate, Number(day), Number(month), Number(year)) ? parsedDate : null;
    }

    if (parts.length === 3) {
      const [day, month, year] = parts;
      const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
      return this.isValidDate(parsedDate, Number(day), Number(month), Number(year)) ? parsedDate : null;
    }

    return null;
  }

  isValidDate(date: Date, day: number, month: number, year: number): boolean {
    return date instanceof Date && !isNaN(date.getTime()) &&
      date.getDate() === day &&
      date.getMonth() === month - 1 &&
      date.getFullYear() === year;
  }

  applyFilters(): void {
    if (!this.filterForm.valid) {
      this.utils.showAutoCloseMessage('Por favor, preencha os campos corretamente.', 'red', 3000);
      return;
    }

    const filters = this.filterForm.value;
    const filteredItems = this.allItems.filter(item => {
      // Filtro por data inicial
      if (filters.startDate) {
        const itemDate = new Date(item.date);
        const startDate = this.parseFilterDate(filters.startDate);
        if (!startDate || itemDate < startDate) {
          return false;
        }
      }

      // Filtro por data final
      if (filters.endDate) {
        const itemDate = new Date(item.date);
        const endDate = this.parseFilterDate(filters.endDate);
        if (!endDate || itemDate > endDate) {
          return false;
        }
      }

      // Filtro por tipo
      const typeField = this.entityType === 'expense' ? 'expense_type_id' : 'revenue_type_id';
      if (filters.typeId && item[typeField] !== parseInt(filters.typeId)) {
        return false;
      }

      // Filtro por grupo
      const groupField = this.entityType === 'expense' ? 'expense_group_id' : 'revenue_group_id';
      if (filters.groupId && item[groupField] !== parseInt(filters.groupId)) {
        return false;
      }

      return true;
    });

    this.filtersApplied.emit(filteredItems);

    if (filteredItems.length === 0) {
      const entityName = this.entityType === 'expense' ? 'despesas' : 'receitas';
      this.utils.showAutoCloseMessage(`Nenhuma ${entityName} encontrada com os filtros aplicados.`, 'orange', 3000);
    }
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.filtersApplied.emit(this.allItems);
  }
}