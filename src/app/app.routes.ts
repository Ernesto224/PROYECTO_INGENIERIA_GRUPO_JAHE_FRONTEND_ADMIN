import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ListadoReservacionesComponent } from './pages/listado-reservaciones/listado-reservaciones.component';
import { VerEstadoHotelHoyComponent } from './pages/ver-estado-hotel-hoy/ver-estado-hotel-hoy.component';
import { ConsultarDisponibilidadHabitacionesComponent } from './pages/consultar-disponibilidad-habitaciones/consultar-disponibilidad-habitaciones.component';
import { PublicidadComponent } from './pages/publicidad/publicidad.component';
import { ComoLlegarComponent } from './pages/como-llegar/como-llegar.component';
import { InicioClientesComponent } from './pages/inicio-clientes/inicio-clientes.component';
import { SobreNosotrosComponent } from './pages/sobre-nosotros/sobre-nosotros.component';
import { FacilidadesComponent } from './pages/facilidades/facilidades.component';
import { LoginComponent } from './pages/login/login.component';
import { administradorGuard } from './Core/guards/administrador.guard';
import { ModificarTipoHabitacionComponent } from './pages/modificar-tipo-habitacion/modificar-tipo-habitacion.component';
import { AdministrarHabitacionComponent } from './pages/administrar-habitacion/administrar-habitacion.component';
import { OfertaComponent } from './pages/oferta/oferta.component';
import { ModificarTemporadaComponent } from './pages/temporada/temporada.component';

export const routes: Routes = [


    {path:'',
        component:MainLayoutComponent,
        children: [
            {path: 'inicio', component:InicioComponent, canActivate:[administradorGuard]},
            {path: 'listado-de-reservaciones', component:ListadoReservacionesComponent, canActivate:[administradorGuard]},
            {path: 'habitaciones/administrar-habitacion', component:AdministrarHabitacionComponent, canActivate:[administradorGuard]},
            {path: 'habitaciones/modificar-tipo-habitacion', component:ModificarTipoHabitacionComponent, canActivate:[administradorGuard]},
            {path: 'ver-estado-del-hotel-hoy', component:VerEstadoHotelHoyComponent, canActivate:[administradorGuard]},
            {path: 'consultar-disponibilidad-de-habitaciones', component:ConsultarDisponibilidadHabitacionesComponent, canActivate:[administradorGuard]},
            {path: 'publicidad', component:PublicidadComponent},
            {path: 'oferta', component:OfertaComponent},
            {path: 'temporada', component:ModificarTemporadaComponent},

            {path: 'modificar-paginas/home', component:InicioClientesComponent, canActivate:[administradorGuard]},
            {path: 'modificar-paginas/sobre-nosotros', component:SobreNosotrosComponent, canActivate:[administradorGuard]},
            {path: 'modificar-paginas/facilidades', component:FacilidadesComponent, canActivate:[administradorGuard]},
            {path: 'modificar-paginas/como-llegar', component:ComoLlegarComponent, canActivate:[administradorGuard]},
           

            { path: '', redirectTo: 'inicio', pathMatch: 'full' }
       
        ]

    },

    {path: 'login', component:LoginComponent}, 


    //si la ruta  no existe redirecciona a inicio
    {path: '**', redirectTo:'inicio'},


];