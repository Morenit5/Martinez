import { Component, inject, OnInit } from '@angular/core';
import { UseRandomUser } from '@core/usecases';
import { RandomUserEntity } from '@core/entities';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastUtility } from '@app/@core/utils/toast.utility';

import { UserEntity } from '@app/@core/entities/User.entity';
import { UsersInstances } from '@app/@core/services/Users.service';
//import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  standalone: false,
})
export class ListComponent implements OnInit {

  users: RandomUserEntity[] = [];
  users1: UserEntity[] = [];
  usersForm: any;
  usersLabel: any;
  usersButton: any;
  
  reqTabId: any;
  recivedTabIndex: number = 0;
  isLoading = true;

  private readonly _useRandomUser = new UseRandomUser();
  

  constructor(private fmBldUsers: FormBuilder, private toast: ToastUtility, private readonly userList:UsersInstances) {
      this.usersForm = this.fmBldUsers.group({
        userId: [],
        username: ['', Validators.required],
        password: ['', Validators.required],
        name: [],
        lastname: [],
        email: ['', Validators.required],
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
        console.log(JSON.stringify(this.users1) )
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

  onClear() {
    throw new Error('Method not implemented.');
  }

  onSubmit(arg0: any) {
    throw new Error('Method not implemented.');
  }

  getMessage($event: any) {
    throw new Error('Method not implemented.');
  }
}
