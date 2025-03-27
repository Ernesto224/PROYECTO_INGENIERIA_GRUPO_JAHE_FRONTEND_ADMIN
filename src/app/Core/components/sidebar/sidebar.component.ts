import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ RouterLink, RouterModule, CommonModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  router = inject(Router);

  ngOnInit(): void {
  
    this.initSidebar();
  }

 
  initSidebar() {

   
    

   

    setTimeout(() => { // este timeOut lo puse obligado por el tema de que este metodo se carga mucho antes de las validaciones de los if que estan en el html  para validar si el rol puede o no ver todo este collapse 

      // COLLAPSE MENU  
      const linkCollapse = document.getElementsByClassName('collapse__link');
      for (let i = 0; i < linkCollapse.length; i++) {
        linkCollapse[i].addEventListener('click', (event: Event) => {
          const collapseMenu = (event.currentTarget as HTMLElement).nextElementSibling as HTMLElement;
          collapseMenu.classList.toggle('showCollapse');

          const rotate = collapseMenu.previousElementSibling as HTMLElement;
          rotate.classList.toggle('rotate');
        });
      }


    }, 1000); 


  }
  

}
