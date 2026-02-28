import { Component, ElementRef, HostListener, OnInit} from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd} from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.services';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

// type MenuType = 'cliente' | 'lista';

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
    MatMenuModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit{

  activeParent: string = 'dashboard';
  openMenu: string = '';
  openMenu2: string = '';
  openMenu3: string = '';
  mobileMenuOpen: boolean = false;
  isMobile: boolean = false;

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
  
  ngOnInit() {
    this.checkScreenWidth();
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

    this.activeParent = url;
    console.log(this.activeParent)
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

  // Atualiza a variável quando a tela muda de tamanho
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenWidth();
  }

  checkScreenWidth() {
    this.isMobile = window.innerWidth <= 768; // define breakpoint
  }
}