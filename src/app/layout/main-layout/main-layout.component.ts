import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from '../../Core/components/header/header.component';
import { SidebarComponent } from '../../Core/components/sidebar/sidebar.component';
import { FooterComponent } from "../../Core/components/footer/footer.component";


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterModule, CommonModule, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
