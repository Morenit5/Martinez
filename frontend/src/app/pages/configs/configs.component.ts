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
  configForm: FormGroup;
  recivedTabIndex: number = 0;
  initialConfigFormValues: any;

  constructor(private fbTool: FormBuilder, private toast: ToastUtility,private readonly mailService:EmailService) {
    this.getConfigStatus();
    
    this.configForm = this.fbTool.group({
      enableReminder: ['', Validators.required],
      dayOfMonth: ['', Validators.required],
      
    });
    this.initialConfigFormValues = this.configForm.value;
  }

  onSubmit() {
    this.configForm.updateValueAndValidity();

    if (this.configForm.valid) {
      
      let enable = this.configForm.get('enableReminder').value;
      let enableOnDate = this.configForm.get('dayOfMonth').value;

     
     this.mailService.enableReminders(enable,enableOnDate).subscribe({
          next: (response) => {
            if(response.active == true){
              this.toast.showToast(response.message, 7000, 'check2-circle', true);
            }else{
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
