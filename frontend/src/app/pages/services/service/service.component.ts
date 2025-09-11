import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientEntity } from '@app/@core/entities/Client.entity';
import { ServiceEntity, ServiceDetailEntity } from '@app/@core/entities/Service.entity';
import { ClientInstances } from '@app/@core/services/Client.service';
import { EmailService } from '@app/@core/services/Email.service';
import { ServicesInstances } from '@app/@core/services/Services.service';
import { ToastUtility } from '@app/@core/utils/toast.utility';
import { environment } from '@env/environment';



@Component({
  selector: 'app-service',
  standalone: false,
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss'
})
export class ServiceComponent {

  isLoading = true;
  serviceList: ServiceEntity[] = [];
  clientList: ClientEntity[] = [];

  //entities usados para crear un servicio nuevo
  service: ServiceEntity;
  serviceDetails: ServiceDetailEntity[] = [];
  client: ClientEntity;
  serviceType: string = undefined;
  quantity: number = undefined;
  description: string = undefined;
  price: number = undefined;
  unitMeasurement: string = undefined;
  serviceTypeIsValid: boolean = true;
  quantityIsValid: boolean = true;
  descriptionIsValid: boolean = true;
  priceIsValid: boolean = true;
  unitMeasurementIsValid: boolean = true;
  
  

  /*Paginacion*/
  services: ServiceEntity[] = [];// se crea un array vacio de la interfaz
  paginatedServices: ServiceEntity[] = [];
  page = 1; // Página actual
  pageSize = 2; // Elementos por página
  collectionSize = 0; // Total de registros
  totalPages = 0;
  currentPage = 1;

  /*Paginacion*/

  /*Email*/
  mailForm: FormGroup;
  enviado = false;
  respuesta = '';
  emailService: EmailService;
  /*Email */
  user = environment.auth.user;
  pass = environment.auth.pass;
  subject = environment.subject;

  serviceLabel: string = 'Registro de Servicios';
  serviceButton: string = 'Generar';
  serviceForm: any;
  //categories: any;
  recivedTabIndex: number = 0;
  ACTIVO: any;
  inputLength:number = 0;
  reqTabId: number;

  constructor(private toast: ToastUtility, private readonly serviceInstance: ServicesInstances,  private readonly clientInstance:ClientInstances, http: HttpClient, private serviceFrm: FormBuilder) {
    this.emailService = new EmailService(http);

    this.serviceForm =  this.serviceFrm.group({
      //campos del servicio
      serviceId: [],
      serviceName: ['',Validators.required],
      serviceDate: [''],
      status: [''],
      price:[234],
      client:  this.serviceFrm.group({
        clientId: ['',Validators.required],
      }),
      serviceDetail: this.serviceFrm.array([]),
    });
  }

  // Method to create a new FormGroup for an item
  createItemFormGroup(servDetail: ServiceDetailEntity): FormGroup {
    return this.serviceFrm.group({
      serviceType:[servDetail.serviceType],
      description: [servDetail.description,Validators.required],
      unitMeasurement: [servDetail.unitMeasurement],
      quantity: [servDetail.quantity],
      price: [servDetail.price],
    });
  }

  get itemsFormArray(): FormArray {
    return this.serviceForm.get('serviceDetail') as FormArray;
  }
  
  generateInvoice() { }


  sendEmail(ServiceDto: ServiceEntity) {
  
    //verificar si hay factura existente
    // si no hay, sugerir al usuario, crear factura
    // si hay,  verificar  y luego enviarla
    //verificamos el cliente-servicio seleccionado
    
    this.emailService.sendEmail(ServiceDto).subscribe({
      next: () => this.toast.showToast('Correo enviado correctamente ', 5000, 'check2-square', true), 
      error: (err) => {
        console.error(err);
        this.toast.showToast('Correo enviado correctamente ', 5000, 'check2-square', true);
      }
    });
  }


  ngOnInit() {
    this.clientInstance.getAllClients().subscribe({
      next: (clientsList) => {
        this.clientList = clientsList;
        this.isLoading = false;
        //console.log(JSON.stringify(this.clientList))
      },
      error: (error) => {
        console.error(error);
      },
    });

    this.getAllServicesIntances();

  }

  /*METODOS PAGINACION*/
  private updatePaginatedData(): void {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedServices = this.services.slice(startIndex, endIndex);
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.updatePaginatedData();
  }
  /*FIN METODOS DE PAGINACION*/

  getAllServicesIntances(){
    this.serviceInstance.getAllServices().subscribe({
      next: (servList) => {
        this.serviceList = servList;
        this.isLoading = false;

        this.services = this.serviceList;
        this.collectionSize = this.services.length;
        this.paginatedServices = this.services.slice(0, this.pageSize);
        //console.log(JSON.stringify(this.serviceList))
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  toggleDetails(Item: any) { 
    Item.showDetails = !Item.showDetails; 
  }
  
  onCancel() { 
    this.recivedTabIndex = 0;
    this.reqTabId = 0;
  }
  

  onSubmit(action: string) {
    
    if (this.serviceForm.valid) {
       let convertDate = JSON.parse(JSON.stringify(this.serviceForm.controls['serviceDate'].value));
        let formatedDate = convertDate.year + '-' + convertDate.month + '-' + convertDate.day;
        this.serviceForm.value['serviceDate'] = formatedDate;
   
      if (action == 'Generar') {


        this.serviceInstance.addService(this.serviceForm.value).subscribe({
          next: (response) => {
            this.toast.showToast('Servicio creado exitosamente!!', 7000, 'check2-circle', true);
          },
          error: (err) => {
            console.log(err);
            this.toast.showToast('Error crear el servicio!!', 7000, 'x-circle', false);
          },
          complete: () => {
            this.serviceForm.reset();
            this.itemsFormArray.clear(); //remove from groupForm
            this.serviceDetails.length = 0; //remove from UI
            this.onCancel() // llamamos on cancel apra poder irnos al tab de consulta
            this.getAllServicesIntances();
          }
        });

      }

      /*else if (action == 'Actualizar') {

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
      }*/

    } else {
      //console.log(this.usersForm.valid);
      //console.log(this.usersForm);
      this.serviceForm.markAllAsTouched();
      this.toast.showToast('Campos Invalidos, porfavor revise el formulario!!', 7000, 'x-circle', false);
    }
  }

  getMessage(message: number) { 
    this.recivedTabIndex = message; 
    this.reqTabId = message;
  }

  onAddDetails() {
    let servDetail: ServiceDetailEntity = new ServiceDetailEntity();
    servDetail.serviceType = this.serviceType;
    servDetail.quantity = this.quantity;
    servDetail.description = this.description;
    servDetail.price = this.price;
    servDetail.unitMeasurement = this.unitMeasurement;

    //cleanup UI for next service details
    this.serviceType = undefined;
    this.quantity = undefined;
    this.description = undefined;
    this.price = undefined;
    this.unitMeasurement = undefined;

    //agregamos los details a la form
    let itemFormGroup = this.createItemFormGroup(servDetail);
    this.itemsFormArray.push(itemFormGroup);

    //agregamos los details a la UI
    this.serviceDetails.push(servDetail);
  }

  onDeleteDetails(itemIndex:number){
    this.itemsFormArray.removeAt(itemIndex); //remove from groupForm

    this.serviceDetails.splice(itemIndex,1); //remove from UI
  }

  onEditDetails(servDetail:ServiceDetailEntity, entityIndex:number){
    //cleanup UI for next service details
    this.serviceType = servDetail.serviceType;
    this.quantity = servDetail.quantity;
    this.description = servDetail.description;
    this.price = servDetail.price;
    this.unitMeasurement = servDetail.unitMeasurement;

    this.itemsFormArray.removeAt(entityIndex); //remove from groupForm

    this.serviceDetails.splice(entityIndex,1); //remove from UI for edition 

    
  }

  disableDetailsButton(): boolean {
    if (this.inputLength <= 0){return true;}

    if (this.serviceType == undefined || this.quantity == undefined || this.description == undefined || this.price == undefined || this.unitMeasurement == undefined) {
      return true;
    }
    return this.serviceTypeIsValid == false ||
      this.quantityIsValid == false ||
      this.descriptionIsValid == false ||
      this.priceIsValid == false ||
      this.unitMeasurementIsValid == false ? true : false;
  }

  onInput(event: Event,type: string = 'is-string'): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.inputLength = inputValue.length;

    if(type == 'is-number'){
      if(!(/^\d+(\.\d+)?$/.test(inputValue))){ //contiene solo numeros
          this.inputLength = 0; //si contiene numeros y letras reseteamos a o ya que no prenderemos el boton "agregar detalles" en este caso
      }
      this.onInputBlur((event.target as HTMLInputElement).name); 
    }
  }

  onInputBlur(control: string) {
    if(control == 'serviceType'){
      this.serviceTypeIsValid = this.serviceType && this.serviceType.length > 0? true:false;

    } else if(control == 'quantity'){
      this.quantityIsValid = this.quantity && !isNaN(this.quantity)? true:false;

    } else if(control == 'description'){
      this.descriptionIsValid = this.description && this.description.length > 0? true:false;

    } else if(control == 'price'){
      this.priceIsValid = this.price && !isNaN(this.price)? true:false;

    } else if(control == 'unitMeasurement'){
      this.unitMeasurementIsValid = this.unitMeasurement && this.unitMeasurement.length > 0? true:false;

    } 
  }

  

}