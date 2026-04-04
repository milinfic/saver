import { Component, Inject, Optional } from '@angular/core';
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
import { ExpenseGroupService } from '../../services/expense-group/expense-group.services';

@Component({
  selector: 'app-expense-groups-new',
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
  templateUrl: './expense-groups-new.html'
})
export class ExpenseGroupsNew {
  header: string = 'Novo Grupo de Despesa';
  expenseNewGroup: FormGroup;
  expenseNewGroupId: string = '';

  constructor(
    private fb: FormBuilder,
    private expenseGroupService: ExpenseGroupService,
    private utils: UtilsService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,  // <-- Torna opcional
    @Optional() private dialogRef? : MatDialogRef<ExpenseGroupsNew>
  ) {
    // se vier via dialog, pega o id
    this.expenseNewGroupId = data?.expenseNewGroupId || '';

    // cria formulário
    this.expenseNewGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      color: ['', [Validators.required, Validators.minLength(3)]]
    });

    // se for edição, busca dados e popula o form
    if (this.expenseNewGroupId) {
      this.header = 'Atualizar Grupo de Despesa';

      this.expenseGroupService.readById(this.expenseNewGroupId).subscribe(res => {
        this.expenseNewGroup.patchValue({
          name: res.name,
          color: res.color
        });
      });
    }
  }

  onSubmit() {
    if (this.expenseNewGroup.valid) {
      const request$ = this.expenseNewGroupId
        ? this.expenseGroupService.update(this.expenseNewGroupId, this.expenseNewGroup.value)
        : this.expenseGroupService.create(this.expenseNewGroup.value);

      request$.subscribe({
        next: () => {
          // fecha o modal se existir
          this.dialogRef?.close(true);
          this.utils.showAutoCloseMessage(MESSAGE_SUCCESS_CREATE, 'green', 5000);
          this.expenseNewGroup.reset();
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