import { Component, inject, OnInit } from '@angular/core';
import { UseRandomUser } from '@core/usecases';
import { RandomUserEntity } from '@core/entities';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastUtility } from '@app/@core/utils/toast.utility';
import { RolEntity, UserEntity } from '@app/@core/entities/User.entity';
import { RolesInstances, UsersInstances } from '@app/@core/services/Users.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  standalone: false,
})
export class ListComponent implements OnInit {

  users: RandomUserEntity[] = [];
  users1: UserEntity[] = [];
  roles: RolEntity[] = []; 
  usersForm: FormGroup;
  usersLabel: string = 'Registro de Usuarios';
  usersButton: string = 'Registrar';
  
  reqTabId: number;
  recivedTabIndex: number = 0;
  isLoading = true;
  
  private readonly _useRandomUser = new UseRandomUser();
 
  

  constructor(private fmBldUsers: FormBuilder, private toast: ToastUtility, private readonly userList:UsersInstances,private readonly rolesList: RolesInstances) {
      this.usersForm = this.fmBldUsers.group({
        userId: [],
        userName: ['', Validators.required],
        firstName: [''],
        lastName: [''],
        inputEmail: ['',Validators.required],
        inputPassword: ['', Validators.required],
        rol: [],
        phone: []
      });
  }

  ngOnInit() {
    this._useRandomUser.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
      },
    });

    this.userList.getAllUsers().subscribe({
      next: (usersL) => {
        this.users1 = usersL;
        this.isLoading = false;
        //console.log(JSON.stringify(this.users1) )
      },
      error: (error) => {
        console.error(error);
      },
    });

    this.rolesList.getAllRoles().subscribe({
      next: (rolesL) => {
        this.roles = rolesL;
        this.isLoading = false;
        //console.log(JSON.stringify(this.users1) )
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  userClicked() {
    /*this._toast.show(
      'Se hizo click en el usuario, aqui se debe mostar mas info tal vez centrar el toast',
    );*/
  }

  onCancel() {
    if (this.reqTabId && this.reqTabId != 0) {
      this.recivedTabIndex = 0;
      this.reqTabId = 0;
      this.usersLabel = 'Registro de Usuarios';
      this.usersButton = 'Registrar'
    }
  }

  onSubmit(arg0: any) {
    console.log(arg0)
  }

  getMessage(message: number) {
    this.recivedTabIndex = message;
  }
}
