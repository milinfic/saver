import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.services';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  activeParent: string = '/dashboard';
  isMobile: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.checkActiveMenu());
  }

  ngOnInit() {
    this.checkActiveMenu();
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
  }

  checkMobile() {
    this.isMobile = window.innerWidth < 768;
  }

  checkActiveMenu() {
    const url = this.router.url || '/dashboard';

    if (url.startsWith('/expense')) {
      this.activeParent = 'expense';
    } else if (url.startsWith('/revenue')) {
      this.activeParent = 'revenue';
    } else if (url.startsWith('/dashboard')) {
      this.activeParent = 'dashboard';
    } else {
      this.activeParent = '';
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}