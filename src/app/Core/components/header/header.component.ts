import { Component, inject } from '@angular/core';
import { SeguridadService } from '../../services/SeguridadService/seguridad.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  private seguridadService = inject(SeguridadService);

  logout(): void {
    this.seguridadService.logout();
  }

}
