import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailService } from '@app/@core/services/Email.service';
import { ToastUtility } from '@app/@core/utils/toast.utility';

@Component({
  selector: 'app-configs',
  standalone: false,
  templateUrl: './configs.component.html',
  styleUrl: './configs.component.scss'
})
export class ConfigsComponent {

  configForm!: FormGroup;
  emailConfigForm!:FormGroup;
  recivedTabIndex: number = 0;
  initialConfigFormValues: any;
  configLabel: string = 'Registro de Correo de configuración';
  configButton: string = 'Registrar';
  reqTabId: number;
  //emailService: EmailService = inject(CategoryService);

  constructor(private fbTool: FormBuilder, private toast: ToastUtility, private readonly mailService: EmailService) {
    this.getConfigStatus();
    this.getEmailConfiguration();

    this.configForm = this.fbTool.group({
      enableReminder: ['', Validators.required],
      dayOfMonth: ['', Validators.required],

    });
    this.initialConfigFormValues = this.configForm.value;

    this.emailConfigForm = this.fbTool.group({
      configurationId: [],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  getEmailConfiguration() {
    this.mailService.getConfig().subscribe({
      next: (response) => {
        console.log('RESPONSE '+response);

        this.emailConfigForm.patchValue({
          email: response.email,
          password: response.password
        });
      },
      error: (error) => {
        console.error('ERROR '+error);
      },
    });
  }

  onSubmit(orignForm: 'Configuration' | 'Email') {
    this.configForm.updateValueAndValidity();

if (orignForm === 'Configuration') {
    console.log('Formulario Configuracion enviado');
    console.log(this.configForm.value);

    if (this.configForm.valid) {

      let enable = this.configForm.get('enableReminder').value;
      let enableOnDate = this.configForm.get('dayOfMonth').value;


      this.mailService.enableReminders(enable, enableOnDate).subscribe({
        next: (response) => {
          if (response.active == true) {
            this.toast.showToast(response.message, 7000, 'check2-circle', true);
          } else {
            this.toast.showToast(response.message, 7000, 'check2-circle', false);
          }

        },
        error: (err) => {
          this.toast.showToast('Error al tratar de registar recordatorios', 7000, 'x-circle', false);
        },

      });


    } else {

      this.configForm.markAllAsTouched();
      this.toast.showToast('Campos inválidos, por favor revise el formulario!!', 7000, 'x-circle', false);
    }
  }

  if (orignForm === 'Email') {
    console.log('Formulario Email enviado');
    console.log(this.emailConfigForm.value);

    if (this.emailConfigForm.valid) {
      
     //
      this.mailService.addConfiguration(this.emailConfigForm.value).subscribe({
          next: (response) => {
            this.toast.showToast('Correo registrado exitosamente!!', 7000, 'check2-circle', true);
            console.log(response);
          },
          error: (err) => {
            console.log('ENTRAMOS AL ERROR: ' + JSON.stringify(err.error.error));
            let errorMessage = JSON.stringify(err.error.error);
            console.log(errorMessage);
            if (errorMessage.startsWith('"Error:')) {
              console.log(errorMessage);
              errorMessage = errorMessage.slice(7, errorMessage.length - 1);
            }
            this.toast.showToast(errorMessage, 7000, 'x-circle', false);
          },
          complete: () => {
            //this.onClear();
            //this.getAllDataCategories();
          }
        });
      //

    } else {
      console.log('Formulario Email inválido');
    }
  }   
  }

  onCancel() {
/*
    //this.isReadOnly = false; //enable de regreso el field cliente
    //go back to consulta tab
    this.reqTabId = 0; // al cancelar le enviamos al padre que cambie al tabulador 0
    this.recivedTabIndex = this.reqTabId;

    this.resetFields();
    this.configLabel = 'Registro de Clientes';
    this.configButton = 'Registrar'
*/
  }




  getMessage(message: number) {

    if (message == undefined) {
      message = 0;
      this.recivedTabIndex = 0;
    }
    this.recivedTabIndex = message;
  }

  getConfigStatus() {
    this.mailService.getReminderStatus().subscribe({
      next: (response) => {
        console.log(response);
        this.configForm.get('enableReminder').setValue(response.active);
        this.configForm.get('dayOfMonth').setValue(response.notifyOnDate);
      },
      error: (error) => {
        console.error(error);
      },

    });
  }
}
