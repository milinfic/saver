import { Component, ElementRef, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

// type MenuType = 'cliente' | 'lista';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {

  constructor(
    private elementRef: ElementRef
  ) {}

  openMenu: string = '';
  openMenu2: string = '';
  openMenu3: string = '';
  
  toggleMenu(openMenu: string, menu: string) {
    return openMenu  !== menu ? menu : '';
  }


  toggle(menu: string) {
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

    if (!clickedInside) {
      this.openMenu = '';
      this.openMenu2 = '';
      this.openMenu3 = '';
    }
  }
}