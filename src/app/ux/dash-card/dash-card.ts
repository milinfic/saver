import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

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
          <h2 class="value">{{ value }}</h2>
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

  @Input()title: String = "";
  @Input()value: String = "";
  @Input()smallInfo: String = "";
  @Input()smallInfoClass: String = "";
  @Input()matIcon: String = "";

  // Classes

  constructor() {}
}