import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, LOCALE_ID, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ClientEntity } from '@app/@core/entities/Client.entity';
import { PaymentEntity } from '@app/@core/entities/Payment.entity';
import { ServiceEntity, ServiceDetailEntity } from '@app/@core/entities/Service.entity';
import { ClientInstances } from '@app/@core/services/Client.service';
import { EmailService } from '@app/@core/services/Email.service';
import { ServicesInstances } from '@app/@core/services/Services.service';
import { ToastUtility } from '@app/@core/utils/toast.utility';
import { environment } from '@env/environment';
import { NgbDateStruct, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

@Component({
  selector: 'app-service',
  standalone: false,
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss'
})
export class ServiceComponent {

  isLoading = true;
  isUpdating = false; // bandera para saber cuando el servicio esta actualizando
  serviceList: ServiceEntity[] = [];
  clientList: ClientEntity[] = [];
  
  //entities usados para crear un servicio nuevo
  service: ServiceEntity;
  serviceDetails: ServiceDetailEntity[] = [];
  client: ClientEntity;
  serviceDetailsId: number | undefined = undefined;
  serviceType: string = undefined;
  quantity: number = undefined;
  description: string = undefined;
  price: number = undefined;
  totalPrice: number = undefined; //sirve para controlar el total de la factura, contiene el total de la sumatoria de cada item en la lista
  unitMeasurement: string = undefined;
  serviceTypeIsValid: boolean = true;
  quantityIsValid: boolean = true;
  descriptionIsValid: boolean = true;
  priceIsValid: boolean = true;
  unitMeasurementIsValid: boolean = true;
  isReadOnly: boolean = false; //inidicamos si el cliente esta activo, -Debe ser true para el actualizar, ya que no podra cambiar al cliente -


  /*Paginacion*/
  services: ServiceEntity[] = [];// se crea un array vacio de la interfaz
  paginatedServices: ServiceEntity[] = [];
  page = 1; // Página actual
  pageSize = 6; // Elementos por página
  collectionSize = 0; // Total de registros
  totalPages = 0;
  currentPage = 1;
  /*Paginacion*/

  /*Email*/
  mailForm: FormGroup;
  enviado = false;
  respuesta = '';
  emailService: EmailService;
  user = environment.auth.user;
  pass = environment.auth.pass;
  subject = environment.subject;
  /*Email */

  serviceLabel: string = 'Registro de Servicios';
  serviceButton: string = 'Registrar';
  serviceForm: FormGroup;
 
  /*PDF*/
  facturaDatos: any;
  pdfUrl: string | null = null;
  idFactura: number = 1; // valor por defecto
  /*PDF*/

  recivedTabIndex: number = 0;
  inputLength: number = 0;
  reqTabId: number;
  activeService = 1;  // para controlar el servicio activo ==> fijo/eventual/extra , por default es fijo
  
  radioOptions = ['Fijo', 'Extra', 'Eventual'];
  isExtraSwitchValue: boolean = false;
  isRecurrentService: boolean = false;
  isExtraOption: boolean = false;
  extraValue: string = 'Fijo'; //valor seleccionado por defecto

  //Variables para el tab de Pagos
  isServicePaid: boolean = false;
  paymentForm: FormGroup;
  PaymentMethod = [
    { value: 'Transferencia', label: 'Transferencia' },
    { value: 'Cheque', label: 'Cheque' },
    { value: 'Deposito', label: 'Deposito' }
  ];

  constructor(private toast: ToastUtility, private readonly serviceInstance: ServicesInstances,
    private readonly clientInstance: ClientInstances, http: HttpClient, private serviceFrm: FormBuilder, @Inject(LOCALE_ID) private locale: string) {

    this.emailService = new EmailService(http);

    this.serviceForm = this.serviceFrm.group({
      //campos del servicio
      serviceId: [],
      serviceName: ['', Validators.required],
      serviceDate: [''],
      status: ['En Proceso'],
      price: [], //tengo que hacer sumatoria aqui
      client: this.serviceFrm.group({
        clientId: ['', Validators.required],
      }),
      serviceDetail: this.serviceFrm.array([]),
      isExtra: [''] 
    });


    this.paymentForm = this.serviceFrm.group({
      invoiceId: [],
      invoiceDate: [],
      invoiceNumber: [],
      totalAmount: [],
      invoiceName: [],
      subtotalAmount: [],
      service: this.serviceFrm.group({
        serviceId: ['', Validators.required],
      }),
      payment: this.serviceFrm.array([
     
          new FormControl('paymentId'),
          new FormControl('paymentDate'),
          new FormControl('paymentAmount'),
          new FormControl('paymentMethod'),
          new FormControl('taxAmount'),
          new FormControl('paymentStatus'),
          new FormControl('invoiceId')
          /*paymentDate: [],
          paymentAmount: [],
          paymentMethod: [],
          taxAmount: [],
          paymentStatus: [],
          invoiceId: []*/
        
      ]),
      
    });
  }

  // Method to create a new FormGroup for an item
  createItemFormGroup(servDetail: ServiceDetailEntity): FormGroup {

    return this.serviceFrm.group({
      serviceDetailsId: [],
      serviceType: [servDetail.serviceType],
      description: [servDetail.description, Validators.required],
      unitMeasurement: [servDetail.unitMeasurement],
      quantity: [servDetail.quantity],
      price: [servDetail.price],
    });
  }

  get itemsFormArray(): FormArray {
    return this.serviceForm.get('serviceDetail') as FormArray;
  }

  get paymentArray() {
    return this.paymentForm.get('payment') as FormArray;
  }

 
  async generateInvoice(service: ServiceEntity) {
    (await this.emailService.generateInvoice(service)).subscribe({
      next: (resp) =>{
         this.toast.showToast('Factura generada correctamente ', 5000, 'check2-square', true)
        this.generarPdf(resp);
        }, 
         error: (err) => {
        console.error(err);
        this.toast.showToast('Factura no generada', 5000, 'check2-square', true);
      }
    });

  }

  async generarPdf(pdfBytes) {
  
    //const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes as unknown as ArrayBuffer], { type: 'application/pdf' });
    this.pdfUrl = URL.createObjectURL(blob);

    // Descargar automáticamente
    const link = document.createElement('a');
    link.href = this.pdfUrl;
    link.download = `Invoice.pdf`;
    link.click();
  }

   getClientsBy(clientType: string) {
    this.clientInstance.getAllClientsBy(clientType).subscribe({
      next: (clientsList) => {
        this.clientList = clientsList;
        this.isLoading = false;
        //console.log(JSON.stringify(this.clientList))
      },
      error: (error) => {
        console.error(error);
      },
    });
  }


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

    this.getallClientsBy('Fijo');
    //this.getAllServicesIntances();
    this.getAllServicesIntancesBy('Fijo'); // de entrada traemos clientes fijos solamente
    console.log(this.paymentArray.controls[2])
  }


  onNavChange(changeEvent: NgbNavChangeEvent) {
    this.isExtraSwitchValue = false; //reseteamos a falso esta bandera por si acaso ya que esta llama a servicios extras

    if (changeEvent.nextId === 1) { //para llamar  los servicios fijos
      this.getAllServicesIntancesBy('Fijo');

    } else if (changeEvent.nextId === 2) { //para llamar  los servicios eventuales
      this.getAllServicesIntancesBy('Eventual');
    }
  }

  onSwitchChange() {
    this.getAllServicesIntancesBy(this.extraValue, this.isExtraSwitchValue);
  }

  onRecurrentSwitchChange(){
    //este metodo nos ayudara solo para saber el valor de this.isRecurrentService
    //de lo contrario este metodo no es necesario
    //console.log(this.isRecurrentService)
  }

  onServicePaySwitchChange(){

  }

  onRadioChange() {
    console.log(this.extraValue );

    if (this.extraValue == 'Extra') {
      this.isExtraOption = true;
    } else {
      this.isExtraOption = false;
    }
    
    
    let cltType = this.extraValue == 'Fijo' || this.extraValue == 'Extra'? 'Fijo':'Eventual'; 
    this.getallClientsBy(cltType);
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

  getAllServicesIntances() {
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

  getAllServicesIntancesBy(clientType: string, extra?: boolean) {
    this.serviceList = null;

    this.serviceInstance.getAllServicesBy(clientType, extra).subscribe({
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

  getallClientsBy(clientType: string) {
    this.clientInstance.getAllClientsBy(clientType).subscribe({
      next: (clientsList) => {
        this.clientList = clientsList;
        this.isLoading = false;
        //console.log(JSON.stringify(this.clientList))
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

    this.resetFields();

    this.serviceLabel = 'Registro de Servicios';
    this.serviceButton = 'Registrar'

    this.getAllServicesIntancesBy(this.extraValue); // reseteamos

    this.isReadOnly = false; //enable de regreso el field cliente
    //go back to consulta tab
    this.recivedTabIndex = 0;
    this.reqTabId = 0;
    
  }

  resetFields(){
    this.serviceForm.reset({ status: 'En Proceso'});
    this.itemsFormArray.clear();
    this.serviceDetails.length = 0; //remove from UI

    //cleanup UI for next service details
    this.serviceType = undefined;
    this.quantity = undefined;
    this.description = undefined;
    this.price = undefined;
    this.unitMeasurement = undefined;

    this.isExtraOption = false;
    this.extraValue = 'Fijo';

    this.isUpdating = false; 
  }
    
  onSubmit(action: string) {

    if (this.serviceForm.valid) {
      if (this.isRecurrentService) {
        this.serviceForm.value['status'] = 'Recurrente';
      }
      this.totalPrice = 0; //reset to zero prior to do final calculation
      let convertDate = JSON.parse(JSON.stringify(this.serviceForm.controls['serviceDate'].value));
      let formatedDate = convertDate.year + '-' + convertDate.month + '-' + convertDate.day;
      this.serviceForm.value['serviceDate'] = formatedDate;
      this.serviceForm.value['isExtra'] = this.isExtraOption; //this is boolean therefore we change its value here to either true or false according to value in isExtraOption 
      this.serviceForm.value['serviceDetail'].forEach((item: any) => {
        this.calculateTotal(item.price);
        const mustRemove = item.serviceDetailsId == '' || item.serviceDetailsId == undefined;
        if (mustRemove) {
          delete item.serviceDetailsId;
        }
      });
      this.serviceForm.value['price'] = this.totalPrice //contiene la sumatoria del total de la factura
      
      if (action == 'Registrar') {

        console.log(this.serviceForm);
        this.serviceInstance.addService(this.serviceForm.value).subscribe({
          next: (response) => {
            this.toast.showToast('Servicio creado exitosamente!!', 7000, 'check2-circle', true);
          },
          error: (err) => {
            console.log(err);
            this.toast.showToast('Error crear el servicio!!', 7000, 'x-circle', false);
          },
          complete: () => {
            this.onCancel() // llamamos on cancel apra poder irnos al tab de consulta
          }
        });

      } else if (action == 'Actualizar') {

        console.log(this.serviceForm);
        this.serviceInstance.updateService(this.serviceForm.value).subscribe({
          next: (response) => {
            this.toast.showToast('Servicio actualizado exitosamente!!', 7000, 'check2-circle', true);
          },
          error: (err) => {
            //console.log(err);
            this.toast.showToast('Error al actualizar el servicio!!', 7000, 'x-circle', false);
          },
          complete: () => {
            this.onCancel();
          }
        });
      }

    } else {
      //console.log(this.serviceForm.valid);
      //console.log(this.serviceForm);
      this.serviceForm.markAllAsTouched();
      this.toast.showToast('Campos Invalidos, porfavor revise el formulario!!', 7000, 'x-circle', false);
    }
  }

  onPaymentSubmit(action: string) {

  }

  getMessage(message: number) {
    if (message == undefined) {
      message = 0;
      this.recivedTabIndex = 0;
      this.reqTabId = 0;
    }
    this.recivedTabIndex = message;
    this.reqTabId = message;
  }

  deleteServiceDetail(serviceDTO: ServiceEntity) {
    throw new Error('Method not implemented.');
  }

  updateServiceDetail(serviceDTO: ServiceEntity) {

    if(this.isUpdating){
      this.resetFields() //este metodo sirve para limpiar 
    }

    this.recivedTabIndex = 1;
    this.reqTabId = 1;
    this.serviceLabel = 'Actualizar Servicio';
    this.serviceButton = 'Actualizar'
    this.isReadOnly = true; //disable el campo de cliente
    this.isUpdating = true; //el cliente en este momento esta actualizando, puede que le de click a actualizar de nuevo por eso se require controlar con esta bandera

    this.client = serviceDTO.client;

    let servDate: string = formatDate(serviceDTO.serviceDate, 'yyyy-MM-dd', this.locale);
    let initialDate: NgbDateStruct = { year: Number(servDate.slice(0, 4)), month: Number(servDate.slice(5, 7)), day: Number(servDate.slice(8)) }; // September 11, 2025

    this.isRecurrentService = serviceDTO.status == 'Recurrente'?true:false;
    this.serviceForm = this.serviceFrm.group({
      //campos del servicio
      serviceId: serviceDTO.serviceId,
      serviceName: serviceDTO.serviceName,
      serviceDate: initialDate,
      status: serviceDTO.status,
      price: serviceDTO.price,
      client: this.serviceFrm.group({
        clientId: this.client.clientId,
      }),
      serviceDetail: this.serviceFrm.array([]),
    });

    const sDetails: ServiceDetailEntity[] = JSON.parse(JSON.stringify(serviceDTO.serviceDetail))

    for (const sd of sDetails) {
      this.serviceDetailsId = sd.serviceDetailsId;
      this.serviceType = sd.serviceType;
      this.quantity = sd.quantity;
      this.description = sd.description;
      this.price = sd.price;
      this.unitMeasurement = sd.unitMeasurement;

      this.onAddDetails('actualizar');
    }
  }

  onAddDetails(action: string = 'registrar') {
    let servDetail: ServiceDetailEntity = new ServiceDetailEntity();
    servDetail.serviceDetailsId = this.serviceDetailsId;
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
    if (this.serviceDetailsId != undefined && action == 'actualizar') {
      itemFormGroup.get('serviceDetailsId')?.setValue(servDetail.serviceDetailsId);
    }

    this.itemsFormArray.push(itemFormGroup);

    //agregamos los details a la UI
    this.serviceDetails.push(servDetail);
  }

  private calculateTotal(itemPrice: string){
    this.totalPrice += parseInt(itemPrice, 10) ;
    console.log(this.totalPrice)
  }

  onDeleteDetails(itemIndex: number) {
    this.itemsFormArray.removeAt(itemIndex); //remove from groupForm

    this.serviceDetails.splice(itemIndex, 1); //remove from UI
  }

  onEditDetails(servDetail: ServiceDetailEntity, entityIndex: number) {
    //cleanup UI for next service details
    this.serviceType = servDetail.serviceType;
    this.quantity = servDetail.quantity;
    this.description = servDetail.description;
    this.price = servDetail.price;
    this.unitMeasurement = servDetail.unitMeasurement;

    this.itemsFormArray.removeAt(entityIndex); //remove from groupForm

    this.serviceDetails.splice(entityIndex, 1); //remove from UI for edition 


  }

  disableDetailsButton(): boolean {
    if (this.inputLength <= 0) { return true; }

    if (this.serviceType == undefined || this.quantity == undefined || this.description == undefined || this.price == undefined || this.unitMeasurement == undefined) {
      return true;
    }
    return this.serviceTypeIsValid == false ||
      this.quantityIsValid == false ||
      this.descriptionIsValid == false ||
      this.priceIsValid == false ||
      this.unitMeasurementIsValid == false ? true : false;
  }

  onInput(event: Event, type: string = 'is-string'): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.inputLength = inputValue.length;

    if (type == 'is-number') {
      if (!(/^\d+(\.\d+)?$/.test(inputValue))) { //contiene solo numeros
        this.inputLength = 0; //si contiene numeros y letras reseteamos a 0 ya que no prenderemos el boton "agregar detalles" en este caso
      }
      this.onInputBlur((event.target as HTMLInputElement).name);
    }
  }

  onInputBlur(control: string) {
    if (control == 'serviceType') {
      this.serviceTypeIsValid = this.serviceType && this.serviceType.length > 0 ? true : false;

    } else if (control == 'quantity') {
      this.quantityIsValid = this.quantity && !isNaN(this.quantity) ? true : false;

    } else if (control == 'description') {
      this.descriptionIsValid = this.description && this.description.length > 0 ? true : false;

    } else if (control == 'price') {
      this.priceIsValid = this.price && !isNaN(this.price) ? true : false;

    } else if (control == 'unitMeasurement') {
      this.unitMeasurementIsValid = this.unitMeasurement && this.unitMeasurement.length > 0 ? true : false;

    }
  }



}