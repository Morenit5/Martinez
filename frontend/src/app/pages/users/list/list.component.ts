import { Component, ElementRef, inject, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { UseRandomUser } from '@core/usecases';
import { RandomUserEntity } from '@core/entities';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ToastUtility } from '@app/@core/utils/toast.utility';
import { RolEntity, UserEntity } from '@app/@core/entities/User.entity';
import { RolesInstances, UsersInstances } from '@app/@core/services/Users.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  standalone: false,
})
export class ListComponent implements OnInit {

  users: RandomUserEntity[] = [];
  users1: UserEntity[] = [];
  originalValues: UserEntity[] = []; //para guardar temporalmente valores originales
  userEntitiyToGet: string;  //el usuario que queremos buscar

  roles: RolEntity[] = [];
  rolEntity: RolEntity;
  usersForm: FormGroup;
  usersLabel: string = 'Registro de Usuarios';
  usersButton: string = 'Registrar';
  avatarFileName = '';
  imageUrl: SafeUrl;
  
  reqTabId: number;
  recivedTabIndex: number = 0;
  isLoading = true;
  avatarImg;

  private readonly _useRandomUser = new UseRandomUser();
  fileNotFound: boolean = false; //assume we do find the correct avatar image
 

  constructor(private fmBldUsers: FormBuilder, private toast: ToastUtility, private readonly userInstances:UsersInstances,private readonly rolesList: RolesInstances,private sanitizer: DomSanitizer) {  

    this.usersForm = this.fmBldUsers.group({
        userId: [],
        username: ['', Validators.required],
        firstname: [''],
        lastname: [''],
        email: ['',[Validators.required,Validators.email]],
        password: ['', [Validators.required]],
        rol: [RolEntity,Validators.required],
        phone: []
      });

      this.getAllUserInstances();

      
  }

  onNameChange(newValue: string) {
    this.userEntitiyToGet = newValue;
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const searchResults: UserEntity[] = this.users1.filter(item => item.firstname.includes(this.userEntitiyToGet)); // || item.email.includes(this.userEntitiyToGet));

      if (searchResults.length !== 0) {
        if (this.originalValues && this.originalValues.length == 0) {
          this.originalValues = this.deepCopy(this.users1); //salvamos temporalmente valores
        }
        this.users1.length = 0; //limpiamos el array y ponemos los nuevos datos
        this.users1 = searchResults;
      } else {
        this.toast.showToastWarning('El Usuario ' + this.userEntitiyToGet + ' no existe!', 7000, 'x-circle');
      }

    } else if (event.key === 'Backspace' || event.key === 'Delete') {

      if ((this.userEntitiyToGet && this.userEntitiyToGet.length == 0) || !this.userEntitiyToGet) {
        if (this.originalValues && this.originalValues.length !== 0) {
          this.users1.length = 0; //limpiamos el array y ponemos los nuevos datos
          this.users1 = this.originalValues;
        }
      }
    }
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

    //this.getAllUserInstances();

    this.rolesList.getAllRoles().subscribe({
      next: (rolesL) => {
        this.roles = rolesL;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
      },
    });

    this.usersForm.get('rol').valueChanges.subscribe({
      next: (rol) => {
        console.log('entramos al cambio')
        if(rol != null){
          this.rolEntity = rol;
        } else{
          this.rolEntity = new RolEntity();
          this.rolEntity.rolId = 1;
          this.rolEntity.name = 'admin';
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

 

  onImgError(event){
    event.target.src = 'images/placeholder.png'
    this.fileNotFound = true;
  }

  updateUser(userInstance: UserEntity) {
    this.recivedTabIndex = 1;
    this.reqTabId = 1;
    this.usersLabel = 'Actualizar Usuario';
    this.usersButton = 'Actualizar'

    this.usersForm.get('password').clearValidators(); //no password required for update, therefore i can remove it safely
    this.usersForm.get('password').updateValueAndValidity();
    
    this.rolEntity = userInstance.rol;

    this.usersForm.patchValue({
      userId: userInstance.userId,
      username: userInstance.username,
      firstname: userInstance.firstname,
      lastname: userInstance.lastname,
      email: userInstance.email,
      password: userInstance.password, //Este campo no se regresa de la bd entonces esta vacio
      rol: this.rolEntity,
      phone: userInstance.phone
    });

 
  }


  async deleteUser(userInstance: UserEntity) {
    const usrInstance = new UserEntity();

    usrInstance.enabled = false; // deshabilitamos el objeto
    usrInstance.userId = userInstance.userId;

    this.userInstances.updateUser(usrInstance).subscribe({
      next: (response) => {
        //el response contiene el usuario actualizado 
        this.toast.showToast('Usuario eliminado exitosamente!!', 7000, 'check2-circle', true);
      },
      error: (err) => {
        this.toast.showToast('Error al eliminar el usuario!!', 7000, 'x-circle', false);
      },
      complete: () => {
        this.getAllUserInstances();
      }
    });
  }

  onCancel() {
    if (this.reqTabId && this.reqTabId != 0) {
      this.recivedTabIndex = 0;
      this.reqTabId = 0;
      this.usersLabel = 'Registro de Usuarios';
      this.usersButton = 'Registrar'
    }
    this.usersForm.get('password').setValidators(Validators.required); 
    this.usersForm.get('password').updateValueAndValidity();
    this.usersForm.reset();
  }

  onSubmit(action: string) {
    
    if (this.usersForm.valid) {

      if (action == 'Registrar') {
         this.usersForm.get('password').setValidators(Validators.required); 
         this.usersForm.get('password').updateValueAndValidity();
        if (!this.usersForm.valid) {
          this.usersForm.markAllAsTouched();
          this.toast.showToast('Campos Invalidos, porfavor revise el formulario!!', 7000, 'x-circle', false);
          return
        }

        this.userInstances.addUser(this.usersForm.value).subscribe({
          next: (response) => {
            this.toast.showToast('Usuario registrado exitosamente!!', 7000, 'check2-circle', true);
          },
          error: (err) => {
            console.log(err);
            this.toast.showToast('Error al registar al Usuario!!', 7000, 'x-circle', false);
          },
          complete: () => {
            this.onCancel();
            this.getAllUserInstances();
          }
        });

      } else if (action == 'Actualizar') {

        this.userInstances.updateUser(this.usersForm.value).subscribe({
          next: (response) => {
            this.toast.showToast('Usuario actualizado exitosamente!!', 7000, 'check2-circle', true);
          },
          error: (err) => {
            //console.log(err);
            this.toast.showToast('Error al actualizar al Usuario!!', 7000, 'x-circle', false);
          },
          complete: () => {
            this.onCancel();
            this.getAllUserInstances();
          }
        });
      }

    } else {
      //console.log(this.usersForm.valid);
      //console.log(this.usersForm);
      this.usersForm.markAllAsTouched();
      this.toast.showToast('Campos Invalidos, porfavor revise el formulario!!', 7000, 'x-circle', false);
    }
  }

  getMessage(message: number) {
    this.recivedTabIndex = message;
  }

  sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  private getAllUserInstances() { //helper method

    this.userInstances.getAllUsers().subscribe({
      next: async (usersL) => {
        this.users1 = usersL;
        this.isLoading = false;
        let imgName;
        let objectURL;
        for (const usr of this.users1) {
          this.avatarImg = null;

          if (usr.avatar == null || usr.avatar == undefined) {
            imgName = 'placeholder.png';
          } else {
            imgName = usr.avatar 
          }

          this.getUserAvatarImage(imgName).subscribe({
            next: (imageBlob) => {
              objectURL = URL.createObjectURL(imageBlob);
            },
            complete: () => {
              // This code runs when the Observable completes
              //this.avatarImg = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            }
          });

          await this.sleep(2000); 

        }
        
      },
      error: (error) => {
        console.error(error);
      },
    });
  }


  onFileSelected(event, userInstance: any) {

    const file: File = event.target.files[0];
    let avatarName;
    if (file) {
      this.avatarFileName = file.name;
      const formData = new FormData();
      console.log('desde el front' + userInstance.userId);
      formData.append('thumbnail', file,userInstance.userId);
      
      this.userInstances.uploadUserAvatar(formData).subscribe({
      next: (response) => {
        avatarName = response.avatar;
      },
      error: (error) => {

        console.error(error);
      }
      });

      this.getAllUserInstances();

    }
  }
    
  
  getUserAvatarImage(avatarName:string) {
    let result;
    try {
     result = this.userInstances.getUserAvatar(avatarName);
   
  } catch (error) {
    console.log(error);
  }
    return result;
  }

  compareObjects(obj1: any, obj2: any): boolean {
      return obj1 && obj2 ? obj1.rolId === obj2.rolId : obj1 === obj2;
  }



  deepCopy<T>(obj: T): T {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.deepCopy(item)) as T;
    }

    const copiedObj: { [key: string]: any } = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        copiedObj[key] = this.deepCopy((obj as any)[key]);
      }
    }
    return copiedObj as T;
  }

}
