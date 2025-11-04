import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, LOCALE_ID, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientEntity } from '@app/@core/entities/Client.entity';
import { ServiceEntity, ServiceDetailEntity } from '@app/@core/entities/Service.entity';
import { ClientInstances } from '@app/@core/services/Client.service';
import { EmailService } from '@app/@core/services/Email.service';
import { InvoiceInstances } from '@app/@core/services/invoice.service';
import { ServicesInstances } from '@app/@core/services/Services.service';
import { ToastUtility } from '@app/@core/utils/toast.utility';
import { DateAdapterService } from '@app/shared/services/date-adapter.service';
import { NgbDateAdapter, NgbDateStruct, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { firstValueFrom, from, Subscription } from 'rxjs';

enum Status {
  EnProceso = "En_Proceso",
  Recurrente = "Recurrente",
  Terminado = "Terminado",
  Cerrado = "Cerrado"
}

enum paymentStatus {
  PorPagar = "Por_Pagar",
  Pagado = "Pagado",
}


@Component({
  selector: 'app-service',
  standalone: false,
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss',
  providers: [{ provide: NgbDateAdapter, useClass: DateAdapterService}]
})
export class ServiceComponent {

  valueSubscription: Subscription;

  isLoading = false;
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
  pageSize = 7; // Elementos por página
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
  extraValue: string = this.radioOptions[0]; //valor seleccionado por defecto para radio opciones es Fijo
  lastUsedValue:string;
  clientesFijos:string = 'Fijo';
  clientesEventuales:string = 'Eventual';

  //Variables para el tab de Pagos
  paymentForm: FormGroup;
  PaymentMethod = [
    { value: 'Transferencia', label: 'Transferencia' },
    { value: 'Cheque', label: 'Cheque' },
    { value: 'Deposito', label: 'Deposito' }
  ];
  paymentDateIsValid: boolean = true;
  paymentAmountIsValid: boolean = true;
  paymentMethodIsValid: boolean = true;
  taxAmountIsValid: boolean = true;
  paymentStatusIsValid: boolean = true;
  
  //search bar para pagos
  clientEntitiyToGet: string;  //el cliente que queremos buscar su pago, esto tambien puede contener el pago en efectivo
  originalClientServicesValues: ServiceEntity[] = [];  //para retener valores originales cuando se hace una busqueda en el tab de pagos
  esPagoCash:string;

  initialServiceFormValues: any;
  initialPaymentFormValues: any;
  initialInvoiceUpdateValues: any;

  //Forms para actualizacion de la factura (Generar Y Mandar)
  invoiceUpdateform:FormGroup; 

  //para buscar por services 
  originalValues: ServiceEntity[] = [];  //para detener valores originales cuando se hace una busqueda en el tab de Consulta
  serviceEntitiyToGet: any;

  months: string[] = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

  constructor(private toast: ToastUtility, private readonly serviceInstance: ServicesInstances, private readonly invoiceInstance: InvoiceInstances,
    private readonly clientInstance: ClientInstances, http: HttpClient, private serviceFrm: FormBuilder, @Inject(LOCALE_ID) private locale: string) {

    this.emailService = new EmailService(http);

    this.serviceForm = this.serviceFrm.group({
      //campos del servicio
      serviceId: [],
      serviceName: ['', Validators.required],
      serviceDate: [''],
      status: [Status.EnProceso],
      price: [], //tengo que hacer sumatoria aqui
      client: this.serviceFrm.group({
        clientId: ['', Validators.required],
      }),
      serviceDetail: this.serviceFrm.array([]),
      invoice: this.serviceFrm.array([]),
      isExtra: [''] 
    });
    this.initialServiceFormValues = this.serviceForm.value;

    this.paymentForm = this.serviceFrm.group({
      invoiceId: [],
      invoiceDate: [],
      invoicedMonth:[],
      invoiceNumber: [],
      totalAmount: [],
      invoiceName: [],
      subtotalAmount: [],
      isGenerated:[false],
      service: this.serviceFrm.group({
        serviceId: ['', Validators.required],
        status:[]
      }),
      payment: this.serviceFrm.array([]),
      
    });
    this.initialPaymentFormValues = this.paymentForm.value;


    this.createInvoiceUpdateForm();
  }

  
  // add the invoice group
  addInvoiceUpdateArray(id:number,updateInvStatus:boolean=false): boolean {
    try {
      let invoiceArrayFrm;
      if (updateInvStatus) {

        invoiceArrayFrm = this.serviceFrm.group({
          invoiceId: [id, Validators.required],
          invoiceStatus: [Status.Cerrado]
        });
      } else {
        invoiceArrayFrm = this.serviceFrm.group({
          invoiceId: [id, Validators.required],
          isGenerated: [true]
        });
      }

      if(this.InvoiceUpdateFormArray == null || this.InvoiceUpdateFormArray == undefined){
        this.createInvoiceUpdateForm();
      }

      this.InvoiceUpdateFormArray.clear();
      this.InvoiceUpdateFormArray.push(invoiceArrayFrm);
      return true;
    } catch (error) {
      return false;
    }
  }

  createInvoiceUpdateForm() {
    this.invoiceUpdateform = this.serviceFrm.group({
      serviceId: [null],
      status: [''], //valor debe ser T e r m i n a d o
      invoice: this.serviceFrm.array([])
    });
    this.initialInvoiceUpdateValues = this.invoiceUpdateform.value;
  }

  get InvoiceUpdateFormArray() {
    return this.invoiceUpdateform.get('invoice') as FormArray;
  }

  // Method to create a new FormGroup for an item
  createServiceDetailsItemFormGroup(servDetail: ServiceDetailEntity): FormGroup {
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

  createPaymentItemFormGroup(servEnt: ServiceEntity,invoiceIndex:number): boolean {
    let metodoPago = servEnt.invoice[invoiceIndex].payment[0].paymentMethod; // paymentEnt.paymentMethod;
    if(this.esPagoCash){
      metodoPago = 'Cash';
    }
    if(metodoPago == undefined || metodoPago == null || metodoPago == 'none'){
       this.toast.showToastWarning('Metodo de pago no ha sido seleccionado', 5000);
       return false;
    }

    let paymentItem = this.serviceFrm.group({
      paymentId: [servEnt.invoice[invoiceIndex].payment[0].paymentId],
      paymentDate: [servEnt.invoice[invoiceIndex].payment[0].paymentDate],
      paymentAmount: [servEnt.price],
      paymentMethod: [metodoPago],
      taxAmount: [servEnt.invoice[invoiceIndex].payment[0].taxAmount],
      paymentStatus: [paymentStatus.Pagado],
      isServicePaid: [true]
    });

    this.paymentFormArray.clear();
    this.paymentFormArray.push(paymentItem);
    return true;
  }

  get paymentFormArray() {
    return this.paymentForm.get('payment') as FormArray;
  }



  // ************* Inicia - Metodos para crear los valores por default de Invoice y Payment Cuando se genera un service *************

  createDefaultInvoiceFormGroup(formatedDate:any): boolean {
    try {
      let chosenMonth =  this.months[(formatedDate.split('-')[1]) - 1]; //restamos uno ya que el array de months comienza en 0 

      let invoiceItem = this.serviceFrm.group({
        invoiceId: [],
        invoiceDate: [formatedDate],
        invoicedMonth:[chosenMonth],
        invoiceNumber: [1],
        totalAmount: [0],
        invoiceName: [''],
        subtotalAmount: [0],
        payment: this.serviceFrm.array([]),
      });

      this.defaultInvoiceFormArray.clear();
      this.defaultInvoiceFormArray.push(invoiceItem);
      return true;

    } catch (error) {
      console.log('ERROR:'+error);
      return false;
    }
  }

  get defaultInvoiceFormArray() {
    return this.serviceForm.get('invoice') as FormArray;
  }

  createDefaultPaymentItemFormGroup(formatedDate:any) {
   let paymentItem = this.serviceFrm.group({
      paymentId: [],
      paymentDate: [formatedDate],
      paymentAmount: [0],
      paymentMethod: ['none'],
      taxAmount: [0],
      paymentStatus: [paymentStatus.PorPagar],
      isServicePaid: [false]
    });

    this.defaultPaymentFormArray.clear();
    this.defaultPaymentFormArray.push(paymentItem);
  }

  get defaultPaymentFormArray() {
    //this.serviceForm.get('invoice').get('payment') as FormArray;
    return this.defaultInvoiceFormArray.at(0).get('payment') as FormArray;
  }
  // ************* Termina - Metodos para crear los valores por default de Invoice y Payment Cuando se genera un service *************
 

  async generateInvoice(service: ServiceEntity, invoiceIndex : number) {
    //Al “Generar Factura” necesitamos actualizar ==> entity_service, entity_invoice con los siguientes valores:
    //entitiy_service >> Status = T e r m i n a d o
    //entity_invoice >> isGenerated = True
   
    let pdfBlob:any;
    (await this.emailService.generateInvoice(service,invoiceIndex)).subscribe({
      next: (resp) => {
        pdfBlob = resp;
      },
      error: (err) => {
        console.error(err);
        this.toast.showToast('Factura no generada', 5000, 'check2-square', true);
      },
      complete: () => {
        if(service.status == Status.Recurrente){
          this.updateRecurrenteChildInvoiceStatusGenerated(service,invoiceIndex, pdfBlob)
        } else {
           this.updateGenerateInvoiceStatus(service,invoiceIndex, pdfBlob)
        }
       
      }
    });

  }

  private updateGenerateInvoiceStatus(service: ServiceEntity, invoiceIndex:number, pdfBlob:any) {
  
    const invUpdated = this.addInvoiceUpdateArray(service.invoice[invoiceIndex].invoiceId);
    
    if(invUpdated == false){
      this.toast.showToast('Error al generar la Factura!!', 7000, 'x-circle', false);
      return;
    }

    
    this.invoiceUpdateform.patchValue({ //puede ser patchValue(para llenado parcial de la forma) en lugar de setValue,
      serviceId: service.serviceId,
      status: service.status == 'Recurrente'? Status.Recurrente: Status.Terminado,
      //serviceName: service.serviceName
    })

    console.log(this.invoiceUpdateform.value)

    if (this.invoiceUpdateform.valid) {
      this.serviceInstance.updateService(this.invoiceUpdateform.value).subscribe({  
        next: (response) => { },
        error: (err) => {
          this.toast.showToast('Error al generar la Factura!!', 7000, 'x-circle', false);
        },
        complete: () => {
          this.getAllServicesIntances(); //Traemos todas las intances  
          this.toast.showToast('Factura generada correctamente ', 5000, 'check2-square', true)
          this.invoiceUpdateform.reset(this.initialInvoiceUpdateValues);
          this.generarPdf(pdfBlob);
        }
      });

    } else {
      this.invoiceUpdateform.markAllAsTouched();
      this.toast.showToast('Error al generar el fomulario de Factura !!', 7000, 'x-circle', false);
    }

  }

  private updateRecurrenteChildInvoiceStatusGenerated(service: ServiceEntity, invoiceIndex:number, pdfBlob:any,closeServiceInvoice:boolean = false) {
  
    let invoiceArrayFrm;
    try {
      if (closeServiceInvoice == false) {
        invoiceArrayFrm = this.serviceFrm.group({
          invoiceId: [service.invoice[invoiceIndex].invoiceId],
          isGenerated: [true]
        });
      } else {
        invoiceArrayFrm = this.serviceFrm.group({
          invoiceId: [service.invoice[invoiceIndex].invoiceId],
          invoiceStatus: [Status.Cerrado]
        });
      }

    } catch (error) {
      console.log(error);
    }

  
    if (invoiceArrayFrm.valid) {
      this.invoiceInstance.addInvoice(invoiceArrayFrm.value).subscribe({  
        next: (response) => { },
        error: (err) => {
          this.toast.showToast('Error al generar la Factura!!', 7000, 'x-circle', false);
        },
        complete: () => {
          if (closeServiceInvoice == false) {
            //case de uso para cuando se genera la facutura
            this.getAllServicesIntances(); //Traemos todas las intances  
            this.toast.showToast('Factura generada correctamente ', 5000, 'check2-square', true)
            this.generarPdf(pdfBlob);
            
          } else { //caso  de uso para cuando se envia la facutura
            this.sendEmail(service,invoiceIndex);
            //this.getAllServicesIntances(); //Traemos todas las intances  
            //this.toast.showToast('Factura generada correctamente ', 5000, 'check2-square', true)
          }

          invoiceArrayFrm.reset();
        }
      });

    } else {
      this.invoiceUpdateform.markAllAsTouched();
      this.toast.showToast('Error al generar el fomulario de Factura !!', 7000, 'x-circle', false)
      
    }

  }  


  async updateSendMailAndCloseStatus(service: ServiceEntity, invoiceIndex:number) {


    if (service.status == Status.Recurrente) {
      this.updateRecurrenteChildInvoiceStatusGenerated(service, invoiceIndex, null, true);
      return; //regresamos ya que para recurrentes no tenemos porque llamar de nuevo al backend 
    }

    const invUpdated = this.addInvoiceUpdateArray(service.invoice[invoiceIndex].invoiceId, true);
    
    if(invUpdated == false){
      this.toast.showToast('Error al generar la Factura!!', 7000, 'x-circle', false);
      return;
    }

    this.invoiceUpdateform.patchValue({ //puede ser patchValue(para llenado parcial de la forma) en lugar de setValue,
      serviceId: service.serviceId,
      status: Status.Cerrado,
    })

    if (this.invoiceUpdateform.valid) {
      this.serviceInstance.addService(this.invoiceUpdateform.value).subscribe({
        next: (response) => { },
        error: (err) => {
          console.log(err);
          this.toast.showToast('Error al enviar el correo!!', 7000, 'x-circle', false);
        },
        complete: () => {
          this.sendEmail(service,invoiceIndex);
          this.invoiceUpdateform.reset(this.initialInvoiceUpdateValues);
        }
        
      });

    } else {
      this.invoiceUpdateform.markAllAsTouched();
      this.toast.showToast('Error al generar el fomulario para enviar el correo !!', 7000, 'x-circle', false);
    }
  }

  async generarPdf(pdfBytes) {
  
    const blob = new Blob([pdfBytes as unknown as ArrayBuffer], { type: 'application/pdf' });
    this.pdfUrl = URL.createObjectURL(blob);

    // Descargar automáticamente
    const a = document.createElement('a');
    a.href = this.pdfUrl;
    a.download;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(this.pdfUrl);
    this.isLoading = false;
    this.getAllServicesIntances(); //Traemos todas las intances 
  }

  sendEmail(ServiceDto: ServiceEntity,invoiceIndex:number) {

    //verificar si hay factura existente
    // si no hay, sugerir al usuario, crear factura
    // si hay,  verificar  y luego enviarla
    //verificamos el cliente-servicio seleccionado

    this.emailService.sendEmail(ServiceDto,invoiceIndex).subscribe({
      next: () => {},
      error: (err) => {
        console.error(err);
        this.toast.showToast('Error al enviar el correo ', 5000, 'check2-square', true);
      },
      complete: () => {
          this.toast.showToast('Correo enviado con factura Adjunta  ', 5000, 'check2-square', true)
          //this.invoiceUpdateform.reset(this.initialInvoiceUpdateValues);
          this.getAllServicesIntances(); //Traemos todas las intances  
          
        }
    });
  }


  ngOnInit() {

    this.getallClientsBy(this.clientesFijos);
    this.lastUsedValue = this.clientesFijos;
    this.getAllServicesIntancesBy(this.clientesFijos); // de entrada traemos clientes fijos solamente

  }


  onNavChange(changeEvent: NgbNavChangeEvent) {
    this.isExtraSwitchValue = false; //reseteamos a falso esta bandera por si acaso ya que esta llama a servicios extras

    if (changeEvent.nextId === 1) { //para llamar  los servicios fijos
      this.getAllServicesIntancesBy(this.clientesFijos);

    } else if (changeEvent.nextId === 2) { //para llamar  los servicios eventuales
      this.getAllServicesIntancesBy(this.clientesEventuales);
      
    }
  }

  onSwitchChange() {
    this.getAllServicesIntancesBy(this.clientesFijos, this.isExtraSwitchValue);
  }

  onRecurrentSwitchChange(){
    //este metodo nos ayudara solo para saber el valor de this.isRecurrentService
    //de lo contrario este metodo no es necesario
    //console.log(this.isRecurrentService)
  }

 
  onRadioChange() {

   if (this.extraValue == 'Extra') {
      this.isExtraOption = true;
    } else {
      this.isExtraOption = false;
    }
    
    let cltType = this.extraValue == 'Fijo' || this.extraValue == 'Extra'? 'Fijo':'Eventual'; 
    
    //esto evita tantas llamdas al backend en caso que haga click en los radio botones varias veces a  la vez
    if((this.lastUsedValue == 'Fijo' || this.lastUsedValue == 'Extra') &&  this.extraValue != 'Eventual') { return }
    if((this.lastUsedValue == 'Eventual') &&  (this.extraValue != 'Fijo' && this.extraValue != 'Extra') ) { return }

    this.getallClientsBy(cltType);
    this.lastUsedValue = cltType;
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

  /**
   * Metodo Usado para el tab de Pagos
   * es decir getAllServices() funciona con todo lo relacionado a pagos
   */
  getAllServicesIntances() {
    this.isLoading = true;
   
    this.serviceInstance.getAllServices().subscribe({
      next: (servList) => {
        this.originalClientServicesValues = servList;
        this.serviceList = servList;

        this.services = this.serviceList;
        this.collectionSize = this.services.length;
        this.paginatedServices = this.services.slice(0, this.pageSize);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
       this.isLoading = false;
      }
    });
  }

  /**
   * Metodo Usado para el tab de Consulta
   * es decir getAllServicesBy() funciona con todo lo relacionado a Consulta
   */
  getAllServicesIntancesBy(clientType: string, extra?: boolean) {
    this.serviceList = null;

    this.serviceInstance.getAllServicesBy(clientType, extra).subscribe({
      next: (servList) => {
        this.originalValues = servList;
        this.serviceList = servList;
        //this.isLoading = false;

        this.services = this.serviceList;
        this.collectionSize = this.services.length;
        this.paginatedServices = this.services.slice(0, this.pageSize);
       
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
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  toggleDetails(Item: any) {
    Item.showDetails = !Item.showDetails;
  }

  toggleInoviceDetails(Item: any) {
    Item.showMonthlyInvoices = !Item.showMonthlyInvoices;
  }

  onCancel() {

    this.resetFields();

    this.serviceLabel = 'Registro de Servicios';
    this.serviceButton = 'Registrar'
    

    this.isReadOnly = false; //enable de regreso el field cliente
    //go back to consulta tab
    this.recivedTabIndex = 0;
    this.reqTabId = 0;
    this.activeService = 1;
    
  }

  resetFields(){
    this.serviceForm.reset(this.initialServiceFormValues);
    this.itemsFormArray.clear();
    this.serviceDetails.length = 0; //remove from UI

    //cleanup UI for next service details
    this.serviceType = undefined;
    this.quantity = undefined;
    this.description = undefined;
    this.price = undefined;
    this.unitMeasurement = undefined;
    
    this.isRecurrentService = false; //reseteamos la bandera de servicio recurrente
    this.isExtraOption = false;
    this.extraValue = 'Fijo';

    this.isUpdating = false; 
  }
    
  //SE llama cuando Creamos o Actualizamos un Servicio
  onSubmit(action: string) {

    if (this.serviceForm.valid) {

      if (this.isRecurrentService) {
        this.serviceForm.get('status').setValue(Status.Recurrente);
      }
      
      this.totalPrice = 0; //reset to zero prior to do final calculation
      this.serviceForm.get('isExtra').setValue(this.isExtraOption);  //this is boolean therefore we change its value here to either true or false according to value in isExtraOption 
      this.serviceForm.value['serviceDetail'].forEach((item: any) => {
        this.calculateTotal(item.price);
        const mustRemove = item.serviceDetailsId == '' || item.serviceDetailsId == undefined;
        if (mustRemove) {
          delete item.serviceDetailsId;
        }
      });

      if (action == 'Registrar') {

        console.log(JSON.stringify(this.serviceForm.value));
        
        this.serviceForm.get('price').setValue(this.totalPrice); // totalPrice contiene la sumatoria del total de la factura
        const success = this.createDefaultInvoiceFormGroup(this.serviceForm.get('serviceDate').value);
        if(success){
          this.createDefaultPaymentItemFormGroup(this.serviceForm.get('serviceDate').value);
        }else {
          this.toast.showToast('no se pudo crear el invoice por default!', 5000, 'check2-circle', true);
          return;
        }
        
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

       
        this.serviceForm.get('price').setValue(this.totalPrice); // totalPrice contiene la sumatoria del total de la factura
        this.serviceInstance.updateService(this.serviceForm.value).subscribe({
          next: (response) => {
            this.toast.showToast('Servicio actualizado exitosamente!!', 7000, 'check2-circle', true);
          },
          error: (err) => {
            
            this.toast.showToast('Error al actualizar el servicio!!', 7000, 'x-circle', false);
          },
          complete: () => {
            this.onCancel();
            this.getAllServicesIntances();
          }
        });
      }

    } else {
    
      this.serviceForm.markAllAsTouched();
      this.toast.showToast('Campos Inválidos, porfavor revise el formulario!!', 7000, 'x-circle', false);
    }
  }

  /**
   * Confirmacion de Pago de Servicio 
   * Recibimos el ServiceEntitiy que deseamos pagar
   * si el pago es cash entonces el payment status sera 'Pagado', el Service Status sera 'Terminado' y el invoice isGenerated sera 'True'
   * de caso contrario se sigue el flujo normal de cobro para generar facturas
  */
  onPaymentSubmit(serviceEnt:ServiceEntity,invoiceIndex:number) {


    const succesful = this.createPaymentItemFormGroup(serviceEnt,invoiceIndex);
    if(!succesful){ 
      return;
    }

    this.totalPrice = 0; //reset to zero prior to do final calculation
    this.calculateTotal(serviceEnt.price? serviceEnt.price.toString(): '0');
    this.calculateTotal(serviceEnt.invoice[invoiceIndex].payment[0].taxAmount? serviceEnt.invoice[invoiceIndex].payment[0].taxAmount.toString(): '0');
    

    let invoiceNum = uuidv4();
    this.paymentForm.patchValue({ //puede ser patchValue(para llenado parcial de la forma) en lugar de setValue,
      invoiceId: serviceEnt.invoice[invoiceIndex].invoiceId,
      invoiceDate: serviceEnt.invoice[invoiceIndex].payment[0].paymentDate,
      invoiceNumber: invoiceNum,
      totalAmount: this.totalPrice,
      invoicedMonth: serviceEnt.invoice[invoiceIndex].invoicedMonth,
      invoiceName: this.removeExtraSpaces(serviceEnt.client.name) + '_' + this.removeExtraSpaces(serviceEnt.client.lastName) + '_' + invoiceNum + '.pdf',
      subtotalAmount: serviceEnt.invoice[invoiceIndex].payment[0].paymentAmount,
      isGenerated: this.esPagoCash && this.esPagoCash == 'Cash'? true : serviceEnt.invoice[invoiceIndex].isGenerated,
      service: {
        serviceId: serviceEnt.serviceId,
        status: this.esPagoCash && this.esPagoCash == 'Cash'? Status.Cerrado : serviceEnt.status,
      }
      //payment: este se llena cuando llamos a this.createPaymentItemFormGroup al comienzo de este metodo
    })

    if (this.paymentForm.valid) {
      console.log(this.paymentForm);
      this.invoiceInstance.addInvoice(this.paymentForm.value).subscribe({  
        next: (response) => {
          this.toast.showToast('Pago generado exitosamente!!', 7000, 'check2-circle', true);
        },
        error: (err) => {
          console.log(err);
          this.toast.showToast('Error al generar el Pago!!', 7000, 'x-circle', false);
        },
        complete: () => {
          // aqui limpiamos el formulario
          this.paymentForm.reset(this.initialPaymentFormValues);
          this.esPagoCash = undefined;
          this.getAllServicesIntances(); //Traemos todas las intances que 
        }
      });

    } else {
      this.paymentForm.markAllAsTouched();
      this.toast.showToast('Campos Inválidos, porfavor revise el formulario de Pago!!', 7000, 'x-circle', false);
    }
  }

  removeExtraSpaces(inputString: string): string {
    const processedString = inputString.replace(/\s+/g, '_');
    return processedString.trim();
  }

  getMessage(message: number) {
   
    if (message == undefined) { //es undefined en la primera vez que carga, por default ponemos al tab 0 para q se muestre
      message = 0;
      this.recivedTabIndex = 0;
      this.reqTabId = 0;
    }
    this.recivedTabIndex = message;
    this.reqTabId = message;
    this.isExtraSwitchValue = false; //reseteamos a falso esta bandera por si acaso ya que esta llama a servicios extras
    this.activeService = 1; //reseteamos la flag para servicios. fijos en el tab de consulta


    //debemos ver si esto ya esta cargado tal vez usar un metodo para cache values
    //y no ir tantas veces a la backend
    if(message == 0){  //Tab Consulta
      this.getAllServicesIntancesBy(this.clientesFijos,false);
    }

    if(message == 1){  //Tab Crear Servicio
      
      this.onRadioChange();
    }
 
    if(message == 2){  //Tab Pagos
      this.getAllServicesIntances();
    }
  }

deleteServiceDetail(serviceDTO: ServiceEntity) {
    // verificamos el estatus del pago, si no hay pago- confirmacion de pago, preguntar si se desea eliminar
    // caso de que el pago esta pagado, pero no se ha generado la factura, no se debera poder eliminar
    // caso de que la factura ya se genero pero no se ha enviado al cliente, no se debera poder eliminar
        const serviceObject = new ServiceEntity();
        serviceObject.enabled = false; // deshabilitamos el objeto
        serviceObject.serviceId = serviceDTO.serviceId;
        this.serviceInstance.updateService(serviceObject).subscribe({
          next: (response) => {
            this.toast.showToast('Servicio eliminada exitosamente!!', 7000, 'check2-circle', true);
          },
          error: (err) => {
            this.toast.showToast('Error al eliminar el Servicio!!', 7000, 'x-circle', false);
          },
          complete: () => {
            this.getAllServicesIntances();
          }
        });
    //this.toast.showToast('Hay que implementar este metodo', 7000, 'x-circle', false);
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

    if (this.client.clientType == 'Fijo') {
      if(!serviceDTO.isExtra){
        this.extraValue = this.radioOptions[0];
      }else{
        this.extraValue = this.radioOptions[1];
      }

    } else { //Eventual
      this.extraValue = this.radioOptions[2];
    }
    
    
    this.getallClientsBy(this.extraValue);

    this.isRecurrentService = serviceDTO.status == Status.Recurrente? true:false;

    this.serviceForm = this.serviceFrm.group({
      //campos del servicio
      serviceId: serviceDTO.serviceId,
      serviceName: serviceDTO.serviceName,
      serviceDate: serviceDTO.serviceDate,
      status: serviceDTO.status,
      price: serviceDTO.price,
      client: this.serviceFrm.group({
        clientId: this.client.clientId,

      }),
      serviceDetail: this.serviceFrm.array([]),
      isExtra:this.isExtraOption
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
    let itemFormGroup = this.createServiceDetailsItemFormGroup(servDetail);
    if (this.serviceDetailsId != undefined && action == 'actualizar') {
      itemFormGroup.get('serviceDetailsId')?.setValue(servDetail.serviceDetailsId);
    }

    this.itemsFormArray.push(itemFormGroup);

    //agregamos los details a la UI
    this.serviceDetails.push(servDetail);
  }

  private calculateTotal(itemPrice: string){
    this.totalPrice += parseInt(itemPrice, 10) ;
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
      this.onInputBlur((event.target as HTMLInputElement).name,'');
    }
  }

  onInputBlur(control: string, value:any) {
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

    } else if (control == 'paymentAmount') {
      this.paymentAmountIsValid = value && !isNaN(value)? true : false;

    } 
    else if (control == 'taxAmount') {
      this.taxAmountIsValid = value && !isNaN(value)? true : false;

    } else if (control == 'paymentMethod') {
      
      this.paymentMethodIsValid = value? value =='none'? false: true: false;
    } 
    
  }
   
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
     
      if (this.clientEntitiyToGet == undefined || this.clientEntitiyToGet.trim().length===0) { return; }

      this.clientEntitiyToGet = this.clientEntitiyToGet.replace(/\s+/g, ' ').trim();
      if (this.clientEntitiyToGet.toLocaleLowerCase() == 'pago cash') { //este es para ocultar pagos en efectivo
        this.clientEntitiyToGet = '';
        this.esPagoCash = 'Cash'
        return;
      } else {
        // de lo contrario hacemos busqueda requerida

        let listEntities: ServiceEntity[];

        listEntities = this.pagosFindByCientService();

        if (listEntities.length !== 0) {

          this.serviceList = listEntities;
          this.collectionSize = this.serviceList.length;
          this.paginatedServices = this.serviceList.slice(0, this.pageSize);

        } else {
          this.toast.showToastWarning('No se encontraron Pagos para ese nombre o servicio', 5000, 'x-circle');
        }

      }


    } else if (event.key === 'Backspace' || event.key === 'Delete') {

      if ((this.clientEntitiyToGet && this.clientEntitiyToGet.length == 0) || !this.clientEntitiyToGet) {
        if (this.originalValues && this.originalValues.length !== 0) {
          
          this.serviceList = this.originalClientServicesValues;
          this.collectionSize = this.serviceList.length;
          this.paginatedServices = this.serviceList.slice(0, this.pageSize);
        }
      }
    }
  }

   onNameChange(newValue: string) {
    this.clientEntitiyToGet = newValue;
  }

  onSearchServiceKeyUp(event: KeyboardEvent) {

    if (event.key === 'Enter') {
      if (this.serviceEntitiyToGet == undefined || this.serviceEntitiyToGet.trim().length === 0) { return; }

      let listEntities: ServiceEntity[];

      listEntities = this.findByService();

      if (listEntities.length !== 0) {

        this.serviceList = listEntities;
        this.collectionSize = this.serviceList.length;
        this.paginatedServices = this.serviceList.slice(0, this.pageSize);

      } else {
        this.toast.showToastWarning('No se encontraron servicios con ese nombre', 5000, 'x-circle');
      }

    } else if (event.key === 'Backspace' || event.key === 'Delete') {


      if ((this.serviceEntitiyToGet && this.serviceEntitiyToGet.length == 0) || !this.serviceEntitiyToGet) {
        if (this.originalValues && this.originalValues.length !== 0) {

          this.serviceList = this.originalValues;
          this.collectionSize = this.serviceList.length;
          this.paginatedServices = this.serviceList.slice(0, this.pageSize);
        }
      }
    }
  }

  findByService(): ServiceEntity[] {

    let searchResults: ServiceEntity[] = this.originalValues.filter(item => item.serviceName.includes(this.serviceEntitiyToGet));

    //si no encontramos nada atraves de nombre buscamos atraves de nombre
    if (searchResults.length <= 0) {
      searchResults = this.originalValues.filter(item => item.client.name.includes(this.serviceEntitiyToGet));
    }
    return searchResults;
  }

  pagosFindByCientService(): ServiceEntity[] {

    //buscamos primero por cliente de lo contrario nos movemos a buscar por services
    let searchResults: ServiceEntity[] = this.originalClientServicesValues.filter(item => item.client.name.includes(this.clientEntitiyToGet)); 

    //si no encontramos nada atraves de nombre buscamos atraves de nombre
    if (searchResults.length <= 0) {
      searchResults = this.originalClientServicesValues.filter(item => item.serviceName.includes(this.clientEntitiyToGet));
    }
    return searchResults;
  }

  regenerarFacturaRecurrente(entity: ServiceEntity) {
    this.toast.showToastWarning('Aqui vamos a renovar el servico un mes mas', 5000, 'x-circle');
  }

}

