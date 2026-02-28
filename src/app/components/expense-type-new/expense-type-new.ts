import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExpenseTypeService } from '../../services/expense-type/expense-type.services';
import { UtilsService } from '../../services/utils/utils.service';
import { MESSAGE_SUCCESS_CREATE, MESSAGE_ERROR_GENERIC } from '../../constants/messages';

@Component({
  selector: 'app-expense-type-new',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './expense-type-new.html',
  styleUrls: ['./expense-type-new.css']
})
export class ExpenseNewType {
  header: string = 'Cadastro de Novo Tipo de Gasto';
  expenseNewType: FormGroup;
  expenseTypeId: string = '';

  constructor(
    private fb: FormBuilder,
    private expenseTypeService: ExpenseTypeService,
    private utils: UtilsService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,  // <-- Torna opcional
    @Optional() private dialogRef? : MatDialogRef<ExpenseNewType>
  ) {
    // se vier via dialog, pega o id
    this.expenseTypeId = data?.expenseTypeId || '';

    this.header = this.expenseTypeId ? 'Atualizar Tipo de Gasto' : 'Cadastro de Novo Tipo de Gasto';

    // cria formulário
    this.expenseNewType = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      column: ['', [Validators.required, Validators.minLength(3)]]
    });

    // se for edição, busca dados e popula o form
    if (this.expenseTypeId) {
      this.expenseTypeService.readById(this.expenseTypeId).subscribe(res => {
        this.expenseNewType.patchValue({
          name: res.name,
          column: res.column
        });
      });
    }
  }

  onSubmit() {
    if (this.expenseNewType.valid) {
      const request$ = this.expenseTypeId
        ? this.expenseTypeService.update(this.expenseTypeId, this.expenseNewType.value)
        : this.expenseTypeService.create(this.expenseNewType.value);

      request$.subscribe({
        next: () => {
          // fecha o modal se existir
          this.dialogRef?.close(true);
          this.utils.showAutoCloseMessage(MESSAGE_SUCCESS_CREATE, 'green', 5000);
          this.expenseNewType.reset();
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