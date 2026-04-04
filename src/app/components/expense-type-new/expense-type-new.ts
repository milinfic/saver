import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UtilsService } from '../../services/utils/utils.service';
import { MESSAGE_SUCCESS_CREATE, MESSAGE_ERROR_GENERIC } from '../../constants/messages';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ExpenseTypeService } from '../../services/expense-type/expense-type.services';
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
    MatSelectModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule
  ],
  templateUrl: './expense-type-new.html'
})
export class ExpenseNewType implements OnInit {
  header: string = 'Novo Tipo de Despesa';
  expenseNewType: FormGroup;
  expenseTypeId: string = '';
  expenseGroups: any[] = [];

  constructor(
    private fb: FormBuilder,
    private expenseTypeService: ExpenseTypeService,
    private utils: UtilsService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,  // <-- Torna opcional
    @Optional() private dialogRef? : MatDialogRef<ExpenseNewType>
  ) {
    // se vier via dialog, pega o id
    this.expenseTypeId = data?.expenseTypeId || '';

    this.expenseNewType = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.readById();
  }

  ngOnInit(): void {
  }

  readById() {
    // se for edição, busca dados e popula o form
    if (this.expenseTypeId) {
      this.header = 'Atualizar Tipo de Despesa';
  
      this.expenseTypeService.readById(this.expenseTypeId).subscribe(res => {
        this.expenseNewType.patchValue({
          name: res.name,
          expense_group_id: res.expense_group_id
        });
      });
    }
  }

  onSubmit() {
    console.log(this.expenseNewType.value);
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