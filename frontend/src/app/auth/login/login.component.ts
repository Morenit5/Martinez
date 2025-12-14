import { Component, OnInit } from '@angular/core';

import { environment } from '@env/environment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthenticationService } from '@app/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false,
})
export class LoginComponent  implements OnInit {
  version: string | null = environment.version;
  loginForm!: FormGroup;

  
  constructor(private readonly router: Router, private readonly route: ActivatedRoute, private readonly authService: AuthenticationService,private formBuilder: FormBuilder,) {
    
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get formFields() { return this.loginForm.controls; }


  async onSubmit() {
    //console.log('Estamos entrando aqui')
    // stop here if form is invalid

    
    let user = { 
      username:  this.loginForm.get('username').value, 
      password:  this.loginForm.get('password').value, 
    }
    
    if (this.loginForm.invalid) {
      return;
    }
    (await this.authService.login(user)).pipe(untilDestroyed(this)).subscribe({
        next: (res) => {
          // Navigate to the home page or any other page after successful login.
          if (res) {
            //console.log('Login successful');
            this.router.navigate(
                [this.route.snapshot.queryParams['redirect'] || '/dashboard'],
                { replaceUrl: true },
              )
              .then(() => {
                // Handle the navigation
                //console.log('Navigated to dashboard');
              });
          }
        },
        error: (error) => {
          //console.log('hubo error en el login')
          console.log(error)
        },
      });
  }
}
