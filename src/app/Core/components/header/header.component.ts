import { Component, inject } from '@angular/core';
import { SeguridadService } from '../../services/seguridad.service';
import { AutenticacionService } from '../../services/AutenticacionService/autenticacion.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  autenticacionService = inject(AutenticacionService);
  seguridadService = inject(SeguridadService);


  logout(): void {
    /*this.seguridadService.logout();*/
    this.autenticacionService.logout();
  }

}
