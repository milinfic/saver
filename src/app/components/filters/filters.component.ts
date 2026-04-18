import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ExpenseService } from '../../services/expense/expense.services';
import { ExpenseTypeService } from '../../services/expense-type/expense-type.services';
import { ExpenseGroupService } from '../../services/expense-group/expense-group.services';
import { RevenueService } from '../../services/revenue/revenue.services';
import { RevenueTypeService } from '../../services/revenue-type/revenue-type.services';
import { RevenueGroupService } from '../../services/revenue-group/revenue-group.services';
import { UtilsService } from '../../services/utils/utils.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DateAdapter } from '@angular/material/core';

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
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './filters.component.html',
})
export class FiltersComponent implements OnInit {
  @Input() entityType: string = '';
  @Input() showSpinner: boolean = false;
  @Input() textFilter: string = '';
  @Output() filtersApplied = new EventEmitter<any[]>();
  @Output() filtersCreatedApplied = new EventEmitter<any[]>();

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
    private utils: UtilsService,
    private adapter: DateAdapter<any>
  ) {
    this.adapter.setLocale('pt-BR');

    this.filterForm = this.fb.group({
      startDate: [null],
      endDate: [null],
      typeId: [''],
      groupId: ['']
    });
  }

  ngOnInit(): void {
    if (this.entityType) {
      this.loadTypes();
      this.loadGroups();
      this.loadAllItems();
    }
  }

  ngOnChanges(): void {
    this.ngOnInit();
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

    service.read({}).subscribe({
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
    const input = event.target;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 2) value = value.replace(/^(\d{2})(\d)/, '$1/$2');
    if (value.length > 5) value = value.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');

    value = value.substring(0, 10); // limita a 10 caracteres

    input.value = value;
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

    function formatMoment(date: any) {
      return date ? date.format('YYYY-MM-DD') : null;
    }
    
    const filters = this.filterForm.value;

    filters.startDate = formatMoment(filters.startDate);
    filters.endDate = formatMoment(filters.endDate);

    this.filtersApplied.emit(filters);
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.filtersApplied.emit(this.allItems);
  }

  applyCreatedFilters(): void {
    this.filtersCreatedApplied.emit();
  }
}