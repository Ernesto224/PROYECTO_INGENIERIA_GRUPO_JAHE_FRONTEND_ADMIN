import { Component, inject } from '@angular/core';
import { SeguridadService } from '../../services/SeguridadService/seguridad.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  private seguridadService = inject(SeguridadService);

  logout(): void {
    this.seguridadService.logout();
  }

}
