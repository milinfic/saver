import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  getFormValidationErrors(form: FormGroup): string {
    let messages: string[] = [];

    Object.keys(form.controls).forEach(key => {
      const controlErrors = form.get(key)?.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(errorKey => {
          switch (errorKey) {
            case 'required':
              messages.push(`${this.getFieldLabel(key)} é obrigatório.`);
              break;
            case 'minlength':
              const requiredLength = controlErrors['minlength'].requiredLength;
              messages.push(`${this.getFieldLabel(key)} deve ter pelo menos ${requiredLength} caracteres.`);
              break;
            default:
              messages.push(`${this.getFieldLabel(key)} inválido.`);
          }
        });
      }
    });

    return messages.join('\n');
  }

  getFieldLabel(fieldName: string): string {
    const labels: any = {
      name: 'Nome',
      column: 'Coluna'
    };
    return labels[fieldName] || fieldName;
  }

  showAutoCloseMessage(msg: string, color: string, duration = 5000) {
  const div = document.createElement('div');
  div.textContent = msg;
  div.style.position = 'fixed';
  div.style.top = '20px';
  div.style.right = '20px';
  div.style.backgroundColor = color;
  div.style.color = 'white';
  div.style.padding = '10px';
  div.style.borderRadius = '4px';
  document.body.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, duration);
}
}
