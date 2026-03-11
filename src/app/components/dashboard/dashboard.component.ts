import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard/dashboard.services';
import { DashCardComponent } from '../../ux/dash-card/dash-card';
import { MatTabsModule } from '@angular/material/tabs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { UtilsService } from '../../services/utils/utils.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, MatTabsModule, DashCardComponent],
  encapsulation: ViewEncapsulation.None,
  // imports: [
  //   CommonModule,
  //   MatTabsModule,
  //   DashCardComponent
  // ],
  templateUrl: './dashboard.component.html'
})
export class Dashboard implements OnInit, AfterViewInit {

  expenses: Object = {};
  expensesHeightChart: number = 400;
  totalExpenses: number = 0;
  totalRevenues: number = 0;
  percentage: number = 0;


  constructor(
    private dashboardService: DashboardService,
    private utils: UtilsService
  ) {
  }

  ngOnInit(): void {
    this.filter()
  }

  ngAfterViewInit() {
    // // Gráfico de barras horizontal
    // Barras horizontal
    this.utils.createChart('chart1', {
      type: 'bar',
      labels: ['Receita', 'Despesa'],
      values: [1000.85, 850.72],
      colors: ['#2ecc71', '#e74c3c'],
      orientation: 'horizontal'
    });

    // // Barras vertical
    this.utils.createChart('chart2', {
      type: 'bar',
      labels: ['Receita', 'Despesa'],
      values: [1000.85, 850.72],
      colors: ['#2ecc71', '#e74c3c'],
      orientation: 'vertical'
    });

    // Pizza
    this.utils.createChart('chart3', {
      type: 'pie',
      labels: ['Receita', 'Despesa'],
      values: [1000.85, 850.72],
      colors: ['#2ecc71', '#e74c3c']
    });

    // Rosca
    this.utils.createChart('chart4', {
      type: 'doughnut',
      labels: ['Receita', 'Despesa'],
      values: [1000.85, 850.72],
      colors: ['#2ecc71', '#e74c3c']
    });
  }

  filter() {
    this.dashboardService.read('?').subscribe((res) => {
      console.log(res);

      this.expenses = res.expenses || {};

      // transforma em array de pares [key, value]
      const entries = Object.entries(this.expenses);

      // ordena pelo value crescente
      entries.sort((a, b) => a[1] - b[1]);

      // separa novamente em keys e values
      const keys = entries.map(e => e[0]);
      const values = entries.map(e => e[1]);

      // define altura do gráfico
      this.expensesHeightChart = Math.max(400, keys.length * 45);

      this.totalExpenses = res?.totalExpenses || 0;
      this.totalRevenues = res?.totalRevenues || 0;

      this.percentage = this.totalRevenues
        ? (this.totalExpenses / this.totalRevenues) * 100
        : 0;

      this.utils.createChart('chart5', {
        type: 'bar',
        labels: keys,
        values: values,
        orientation: 'horizontal'
      });
    });
  }



  // ---------------------------------------------------------------------------------
  // Propriedades para as abas do dash mat-tab-group
  // ---------------------------------------------------------------------------------
  protected tabs = ['Gráfico 1', 'Gráfico 2', 'Gráfico 3', 'Gráfico 4', 'Gráfico 5'];
  protected selectedTabIndex = 0;

  drop(event: CdkDragDrop<string[]>) {
    const prevActive = this.tabs[this.selectedTabIndex];
    moveItemInArray(this.tabs, event.previousIndex, event.currentIndex);
    this.selectedTabIndex = this.tabs.indexOf(prevActive);
  }




  setSecondChart() {
    console.log('chart')
    // // Barras vertical
    this.utils.createChart('chart5', {
      type: 'bar',
      labels: Object.keys(this.expenses),
      values: Object.values(this.expenses),
      // colors: ['#2ecc71', '#e74c3c'],
      orientation: 'vertical'
    });
  }

}
