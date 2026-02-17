import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.services';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class Dashboard{
  constructor(
    private authService: AuthService,
    private router: Router) {
      console.log('começamos a implementar o dash');
    }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
