import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard/dashboard.services';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class Dashboard implements OnInit{
  
  constructor(
    private dashboardService: DashboardService
  ) {
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
