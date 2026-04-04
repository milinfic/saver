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
import { RevenueGroupService } from '../../services/revenue-group/revenue-group.services';

@Component({
  selector: 'app-revenue-groups-new',
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
  templateUrl: './revenue-groups-new.html'
})
export class RevenueGroupsNew {
  header: string = 'Novo Grupo de Receita';
  revenueGroupForm: FormGroup;
  revenueGroupId: string = '';

  constructor(
    private fb: FormBuilder,
    private revenueGroupService: RevenueGroupService,
    private utils: UtilsService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,  // <-- Torna opcional
    @Optional() private dialogRef? : MatDialogRef<RevenueGroupsNew>
  ) {
    // se vier via dialog, pega o id
    this.revenueGroupId = data?.revenueGroupId || '';

    // cria formulário
    this.revenueGroupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      color: ['', [Validators.required, Validators.minLength(3)]]
    });

    // se for edição, busca dados e popula o form
    if (this.revenueGroupId) {
      this.header = 'Atualizar Grupo de Receita';

      this.revenueGroupService.readById(this.revenueGroupId).subscribe(res => {
        this.revenueGroupForm.patchValue({
          name: res.name,
          color: res.color
        });
      });
    }
  }

  onSubmit() {
    if (this.revenueGroupForm.valid) {
      const request$ = this.revenueGroupId
        ? this.revenueGroupService.update(this.revenueGroupId, this.revenueGroupForm.value)
        : this.revenueGroupService.create(this.revenueGroupForm.value);

      request$.subscribe({
        next: () => {
          // fecha o modal se existir
          this.dialogRef?.close(true);
          this.utils.showAutoCloseMessage(MESSAGE_SUCCESS_CREATE, 'green', 5000);
          this.revenueGroupForm.reset();
        },
        error: (err) => {
          this.utils.handleApiError(err, MESSAGE_ERROR_GENERIC);
        }
      });
    } else {
      this.utils.showAutoCloseMessage('Por favor, preencha todos os campos obrigatórios corretamente.', 'red', 5000);
    }
  }
}
