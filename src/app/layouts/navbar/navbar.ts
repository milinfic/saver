import { Component, ElementRef, HostListener} from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd} from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.services';

// type MenuType = 'cliente' | 'lista';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {

  activeParent: string = 'dashboard';
  openMenu: string = '';
  openMenu2: string = '';
  openMenu3: string = '';
  mobileMenuOpen: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private authService: AuthService,
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeAllLists();
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkActiveMenu();
      });
  }

  closeAllLists() {
    this.openMenu = '';
    this.openMenu2 = '';
    this.openMenu3 = '';
    this.mobileMenuOpen = false;
  }

  // verifica rota atual
  checkActiveMenu() {
    const url = this.router.url;

    if (url.startsWith('/customers')) {
      this.activeParent = 'customers';
    } else if (url.startsWith('/cliente')) {
      this.activeParent = 'itens';
    } else {
      this.activeParent = '';
    }
  }
  
  toggleMenu(openMenu: string, menu: string) {
    return openMenu  !== menu ? menu : '';
  }


  toggle(menu: string) {
    this.activeParent = menu;

    this.openMenu = this.toggleMenu(this.openMenu, menu);
    this.openMenu2 = '';
  }
  
  toggle2(menu: string) {
    this.openMenu2 = this.toggleMenu(this.openMenu2, menu);
    this.openMenu3 = '';
  }
  
  toggle3(menu: string) {
    this.openMenu3 = this.toggleMenu(this.openMenu3, menu);
  }

  // 👇 Escuta clique global
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside) this.closeAllLists();
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;

    // Opcional: fechar submenus quando fechar menu mobile
    if (!this.mobileMenuOpen) this.closeAllLists();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}