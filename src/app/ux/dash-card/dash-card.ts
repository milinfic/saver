import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
declare var echarts: any;

@Component({
  standalone: true,
  selector: 'app-dash-card',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <div class="revenue-card">
      <div class="card-content">
        <div class="card-info">
          <span class="title">{{ title }}</span>
          <h2 class="value">{{ formattedValue }}</h2>
          <span [ngClass]="smallInfoClass">
            {{ smallInfo }}
          </span>
        </div>
        <div class="card-icon-box" [ngClass]="matIcon">
          <mat-icon>{{ matIcon }}</mat-icon>
        </div>
      </div>
    </div>
  `
})
export class DashCardComponent {

  @Input() title: string = "";
  @Input() value: number = 0;
  @Input() smallInfo: string = "";
  @Input() smallInfoClass: string = "";
  @Input() matIcon: string = "";

  formattedValue: string = "";

  constructor(
  ) { }

    ngOnChanges() {
      this.formattedValue = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(this.value);
    }
  }