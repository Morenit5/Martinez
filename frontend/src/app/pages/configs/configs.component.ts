import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfigurationService } from '@app/@core/services/Configuration.service';
import { EmailService } from '@app/@core/services/Email.service';
import { ServicesInstances } from '@app/@core/services/Services.service';
import { ToastUtility } from '@app/@core/utils/toast.utility';
import { forkJoin, map } from 'rxjs';


@Component({
  selector: 'app-configs',
  standalone: false,
  templateUrl: './configs.component.html',
  styleUrl: './configs.component.scss'
})
export class ConfigsComponent implements OnInit {

  configForm!: FormGroup;
  showEmailSection: boolean = false; //vamos a esconder el correo por defecto
  recivedTabIndex: number = 0;
  initialConfigFormValues: any;
  configLabel: string = 'Registro de Correo de configuración';
  configButton: string = 'Registrar';
  reqTabId: number;
  confId =  null;
  

  constructor(private fbTool: FormBuilder, private toast: ToastUtility, 
              private readonly mailService: EmailService, private readonly configService:ConfigurationService,private readonly serviceInstance: ServicesInstances) {
   

    this.configForm = this.fbTool.group({
      configurationId: [],
      //email: [''],
      //password: [''],
      //enableNotification: [true],
      isInvoiceAutomatically: [''],
      //enableOnDate: [27],

    });
    this.initialConfigFormValues = this.configForm.value;
  
  }
  
  
  ngOnInit(): void {
    this.getAllValues();
  }

  
  onSubmit(orignForm: 'Configuration' | 'Email') {
    this.configForm.updateValueAndValidity();

    if (orignForm === 'Configuration') {


      if (this.configForm.valid) {

        if(this.confId != null){
          this.configForm.get('configurationId').setValue(this.confId);
        }
        //this.configForm.get('enableOnDate').setValue(27);
       
        this.configService.setConfigurations(this.configForm.value).subscribe({
          next: (response) => {
            this.toast.showToast('Configuraciones Actualizadas correctamente!!', 7000, 'check2-circle', true);
          },
          error: (err) => {
           let errorMessage = JSON.stringify(err.error);
            console.log(errorMessage);
            if (errorMessage.startsWith('"Error:')) {
              console.log(errorMessage);
              errorMessage = errorMessage.slice(7, errorMessage.length - 1);
            }
            this.toast.showToast(errorMessage, 7000, 'x-circle', false);
          },
          complete: () => {
            console.log('Completamos la acción, ahora vamos a traer datos')
            this.getAllValues();
            
          }

        });


      } else {

        this.configForm.markAllAsTouched();
        this.toast.showToast('Campos inválidos, por favor revise el formulario!!', 7000, 'x-circle', false);
      }
    }

  
  }


  getAllValues(){
    //this.getConfigStatus();
    this.getAutoInvoiceStatus()
    //this.getEmailConfiguration(); //no tiene caso ir a buscar la config del correo ya q no esta activa en la ui
  } 

  getMessage(message: number) {

    if (message == undefined) {
      message = 0;
      this.recivedTabIndex = 0;
    }
    this.recivedTabIndex = message;
  }

  /*async getConfigStatus() {

    //obtenemos el status desde el mail service que es dnd esta 
    //el cronjob en lugar de la base de datos de configurations
    //para saber el status en tiempo real
     this.mailService.getReminderStatus().subscribe({
      next: (response) => {
        console.log('response de reminder ' + JSON.stringify(response));
        this.configForm.get('enableNotification').setValue(response.active);
        this.configForm.get('enableOnDate').setValue(response.notifyOnDate);
      },
      error: (error) => {
        console.error(error);
      },

    });
  }*/

  getAutoInvoiceStatus() {

    //obtenemos el status desde el Servicio  service que es dnd esta 
    //el cronjob en lugar de la base de datos de configurations
    //para saber el status en tiempo real
    const confInRealTime = this.serviceInstance.getAutoInvoiceStatus();
    const confInDB = this.configService.getConfig();
    let rtValue;
    let dbValue;
    forkJoin([confInRealTime, confInDB])
      .pipe(
        // Use the map operator to transform the array result into meaningful properties
        map(([rtConfig, dbConfig]) => {
           //console.log(dbConfig)
          return { rtConfig, dbConfig };
        })
      )
      .subscribe({
        next: (data) => {
          // This block executes only after all requests are successful and complete
          rtValue = data.rtConfig.active;
          dbValue = data.dbConfig[0].isInvoiceAutomatically;
          this.confId = data.dbConfig[0].configurationId;

          if (rtValue == dbValue) {
            this.configForm.get('configurationId').setValue(data.dbConfig[0].configurationId);
            this.configForm.get('isInvoiceAutomatically').setValue(dbValue);
          } else {
            //esta desfasada la base de datos con los datos de real time asi q hay q actualizar la base de datos
            this.configForm.get('configurationId').setValue(data.dbConfig[0].configurationId);
            this.configForm.get('isInvoiceAutomatically').setValue(rtValue);
            this.configService.setConfigurations(this.configForm.value).subscribe({
              next: (response) => {
                this.toast.showToast('Configuraciones Actualizadas correctamente!!', 7000, 'check2-circle', true);
              },
              error: (err) => {
                this.toast.showToast('Error al obtener datos de autorecurrencia', 7000, 'x-circle', false);
              },
              complete: () => {
                this.getAllValues();

              }

            });
          }
        },
        error: (error) => {
          console.error('One of the requests failed:', error);
        }
      })
  }

  /*getEmailConfiguration() {
    this.configService.getConfig().subscribe({
      next: (response) => {
        this.configForm.get('configurationId').setValue(response[0].configurationId);
        this.configForm.get('email').setValue(response[0].email);
        this.configForm.get('password').setValue(response[0].password);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }*/
}
