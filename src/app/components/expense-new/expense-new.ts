import { CommonModule } from '@angular/common';
import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UtilsService } from '../../services/utils/utils.service';
import { ExpenseService } from '../../services/expense/expense.services';
import { MESSAGE_ERROR_GENERIC, MESSAGE_SUCCESS_CREATE } from '../../constants/messages';
import { ExpenseTypeService } from '../../services/expense-type/expense-type.services';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface Type {
  id: number,
  value: String
};

@Component({
  selector: 'app-expense-new',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './expense-new.html',
  styleUrl: './expense-new.css'
})
export class ExpenseNew {

  header: string = 'Cadastro de Nova Despesa';
  expenseForm: FormGroup;
  expenseId: string = '';
  expenseTypes: Type[] = [];

  constructor(
    private fb: FormBuilder,
    private utils: UtilsService,
    private expenseService: ExpenseService,
    private expenseTypeService: ExpenseTypeService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,  // <-- Torna opcional
    @Optional() private dialogRef? : MatDialogRef<ExpenseNew>
  
  ) {

    this.expenseForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(3)]],
      expenseTypeId: ['', [Validators.required]],
      value: ['', [Validators.required, Validators.min(0)]]
    });

    this.expenseTypeService.read().subscribe((res) => {
      if (res && Array.isArray(res)) {
        this.expenseTypes = res
        .filter(r => r.id && r.name)
        .map(r => ({
            id: r.id,
            value: r.name
        }));
      }
    });

    // se vier via dialog, pega o id
    this.expenseId = data?.expenseId || '';

    // se for edição, busca dados e popula o form
    if (this.expenseId) {
      this.header = 'Atualizar Despesa';

      this.expenseService.readById(this.expenseId).subscribe(res => {
        this.expenseForm.patchValue({
          description: res.description,
          expenseTypeId: res.expenseTypeId,
          value: res.value
        });
      });
    }

  }  

  onSubmit() {
    if (this.expenseForm.valid) {
      const request$ = this.expenseId
        ? this.expenseService.update(this.expenseId, this.expenseForm.value)
        : this.expenseService.create(this.expenseForm.value);

      request$.subscribe({
        next: () => {
          // fecha o modal se existir
          this.dialogRef?.close(true);
          this.utils.showAutoCloseMessage(MESSAGE_SUCCESS_CREATE, 'green', 5000);
          this.expenseForm.reset();
        },
        error: (err) => {
          console.error('Erro ocorrido:', err);
          this.utils.showAutoCloseMessage(MESSAGE_ERROR_GENERIC, 'red', 5000);
        }
      });
    } else {
      this.utils.showAutoCloseMessage('Por favor, preencha todos os campos obrigatórios corretamente.', 'red', 5000);
    }
  }
}
