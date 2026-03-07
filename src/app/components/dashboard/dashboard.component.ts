import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard/dashboard.services';
import { DashCardComponent } from '../../ux/dash-card/dash-card';
import { MatTabsModule } from '@angular/material/tabs';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, CdkDrag, CdkDropList, MatTabsModule, DashCardComponent],
  encapsulation: ViewEncapsulation.None,
  // imports: [
  //   CommonModule,
  //   MatTabsModule,
  //   DashCardComponent
  // ],
  templateUrl: './dashboard.component.html'
})
export class Dashboard implements OnInit {

  constructor(
    private dashboardService: DashboardService
  ) {
  }

  protected tabs = ['Gráfico 1', 'Gráfico 2', 'Gráfico 3', 'Gráfico 4', 'Gráfico 5'];

  protected selectedTabIndex = 0;

  drop(event: CdkDragDrop<string[]>) {
    const prevActive = this.tabs[this.selectedTabIndex];
    moveItemInArray(this.tabs, event.previousIndex, event.currentIndex);
    this.selectedTabIndex = this.tabs.indexOf(prevActive);
  }

  ngOnInit(): void {
    this.filter()
  }

  filter() {
    this.dashboardService.read('?').subscribe((res) => {
      console.log(res);
    });
  }
}
