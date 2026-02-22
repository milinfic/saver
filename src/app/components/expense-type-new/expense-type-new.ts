import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseTypeService } from '../../services/expense-type/expense-type.services';
import { CommonModule } from '@angular/common';
import { MESSAGE_SUCCESS_CREATE, MESSAGE_ERROR_GENERIC } from '../../constants/messages';
import { UtilsService } from '../../services/utils/utils.service';
@Component({
  selector: 'app-expense-type-new',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expense-type-new.html',
  styleUrl: './expense-type-new.css'
})
export class ExpenseNewType {

  expenseNewType: FormGroup;

  constructor(
    private fb: FormBuilder,
    private expenseTypeService: ExpenseTypeService,
    private utils: UtilsService
  ) {
    this.expenseNewType = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      column: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit() {
    if (this.expenseNewType.valid) {
      this.expenseTypeService.create(this.expenseNewType.value)
      .subscribe({
        next: (res) => {
          this.utils.showAutoCloseMessage(MESSAGE_SUCCESS_CREATE, 'green',  5000);
        }, 
        error: (err) => {
          alert('Por favor, preencha todos os campos obrigatórios corretamente.');
          console.error('Erro ocorrido:', err);
        },
        complete: () => {
          this.expenseNewType.reset();
        }
      });
    } else {
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
    }
  }

}
