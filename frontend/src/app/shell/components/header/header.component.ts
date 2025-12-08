import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { AuthenticationService, CredentialsService } from '@auth';
import { Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent {

  menuHidden = true;
  currentUser :string = 'User';

  constructor(private readonly _credentialsService: CredentialsService,private readonly _authService: AuthenticationService, private readonly _router: Router,) {
    const colMenuElement = document.getElementById('sidebarcolumn') as HTMLInputElement | null;
    const colContentElement = document.getElementById('contentcolumn') as HTMLInputElement | null;

    if (colMenuElement) {
      const value = colMenuElement.value;
      console.log(value);
    } else {
      //console.error('Element with ID "myInputElementId" not found.');
    }

    if (colContentElement) {
      const value = colContentElement.value;
      console.log(value);
    } else {
      // console.error('Element with ID "myInputElementId" not found.');
    }

     if (this._credentialsService.isAuthenticated()) {
      const newCredentials = this._credentialsService.credentials;
      this.currentUser = newCredentials.firstName;
     }

  }

  toggleSideMenu() {
    const colSidebar = document.getElementById('sidebarcolumn');
    const colContent = document.getElementById('contentcolumn');

    if (colSidebar && colContent) {

      if (colSidebar.classList.contains("hide")) {
        //entramos aqui cuando mostramos el menu
        colSidebar.classList.remove("hide");
        colSidebar.classList.add("show");
        colContent.style.marginLeft = "0px"; // Adjust based on sidebar width
      } else {
        //entramos aqui cuando escondemos el menu
        colSidebar.classList.remove("show");
        colSidebar.classList.add("hide");
        colContent.style.marginLeft = "0px";
      }
    } else {
      console.error('No se pudo localizar la barra de menu');
    }
  }

  signOut() {
    if (!this._credentialsService.isAuthenticated()) {
      this._credentialsService.setCredentials();
      this._router.navigate(['/login']).then(() => {
        window.location.reload();
      });
    } else {
      this._authService.logout().subscribe({
        next: () => {
         this._credentialsService.setCredentials();
          this._router.navigate(['/login']).then(() => {
            window.location.reload();
          });
        },
        error: () => {
          console.error('Error logging out');
        },
      });
    }
  }

  hide() { }
}
