import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-expense-new',
  imports: [ReactiveFormsModule],
  templateUrl: './expense-new.html',
  styleUrl: './expense-new.css'
})
export class ExpenseNew {

  clienteForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.clienteForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      endereco: ['']
    });
  }

  onSubmit() {
    if (this.clienteForm.valid) {
      console.log('Cliente cadastrado:', this.clienteForm.value);
      alert('Cliente cadastrado com sucesso!');
      this.clienteForm.reset();
    } else {
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
    }
  }

}
