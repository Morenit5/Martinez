import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, LOCALE_ID, OnInit, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientEntity } from '@app/@core/entities/Client.entity';
import { ServiceEntity, ServiceDetailEntity } from '@app/@core/entities/Service.entity';
import { ClientInstances } from '@app/@core/services/Client.service';
import { EmailService } from '@app/@core/services/Email.service';
import { InvoiceInstances } from '@app/@core/services/invoice.service';
import { ServicesInstances } from '@app/@core/services/Services.service';
import { ToastUtility } from '@app/@core/utils/toast.utility';
import { DateAdapterService } from '@app/shared/services/date-adapter.service';
import { NgbDateAdapter, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { Subscription } from 'rxjs';
import { InvoiceEntity } from '@app/@core/entities/Invoice.entity';
import { PaymentEntity } from '@app/@core/entities/Payment.entity';

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
  providers: [{ provide: NgbDateAdapter, useClass: DateAdapterService }]
})
export class ServiceComponent implements OnInit {


  cliente;
  isUpdateBtnDisabled:boolean= false;
    valueSubscription: Subscription;

  isLoading = false;
  isUpdating = false; // bandera para saber cuando el servicio esta actualizando
  serviceList: ServiceEntity[] = [];
  clientList: ClientEntity[] = [];

  //entities usados para crear un servicio nuevo
  service: ServiceEntity;
  serviceDelete: ServiceEntity;
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
  showToast = false;

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
  lastUsedValue: string;
  clientesFijos: string = 'Fijo';
  clientesEventuales: string = 'Eventual';

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
  esPagoCash: string;

  initialServiceFormValues: any;
  initialPaymentFormValues: any;
  initialInvoiceUpdateValues: any;

  //Forms para actualizacion de la factura (Generar Y Mandar)
  invoiceUpdateform: FormGroup;

  //para buscar por services 
  originalValues: ServiceEntity[] = [];  //para detener valores originales cuando se hace una busqueda en el tab de Consulta
  serviceEntitiyToGet: any;

  months: string[] = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  //recurrencia
  isRecurrencyEnabled: boolean = false;

  // VARIABLES
  showToastWarning = false;
  toastWarningMessage = '';
  displayBtnSendEmail: boolean= false;

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
      invoicedMonth: [],
      invoiceNumber: [],
      totalAmount: [],
      invoiceName: [],
      subtotalAmount: [],
      isGenerated: [false],
      service: this.serviceFrm.group({
        serviceId: ['', Validators.required],
        status: []
      }),
      payment: this.serviceFrm.array([]),
      //
    });
    this.initialPaymentFormValues = this.paymentForm.value;


    this.createInvoiceUpdateForm();
  }

  // Mostrar mensaje en toast con botones Sí/No
  showToastWarningMessage(message: string) {
    this.toastWarningMessage = message;
    this.showToastWarning = true;
  }

  siEliminar() {
   
    this.deleteServiceDetail(this.serviceDelete);
    this.showToastWarning = false;
  }

  cancelarToast() {
    // this.showToast = false;
    this.showToastWarning = false;
    this.serviceDelete = null;
  }

  preguntarEliminar(serviceDTO: ServiceEntity) {

    this.serviceDelete = serviceDTO;
    // this.showToast = true;
    this.showToastWarningMessage('¿Desea eliminar el Servicio "'+ serviceDTO.serviceName+'" ?');

  }

  // add the invoice group
  addInvoiceUpdateArray(id: number, updateInvStatus: boolean = false): boolean {
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

      if (this.InvoiceUpdateFormArray == null || this.InvoiceUpdateFormArray == undefined) {
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

  createPaymentItemFormGroup(servEnt: ServiceEntity, invoiceIndex: number): boolean {
    let metodoPago = servEnt.invoice[invoiceIndex].payment[0].paymentMethod; // paymentEnt.paymentMethod;
    if (this.esPagoCash) {
      metodoPago = 'Cash';
    }
    if (metodoPago == undefined || metodoPago == null || metodoPago == 'none') {
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

  createDefaultInvoiceFormGroup(formatedDate: any): boolean {
    try {
      let chosenMonth = this.months[(formatedDate.split('-')[1]) - 1]; //restamos uno ya que el array de months comienza en 0 

      let invoiceItem = this.serviceFrm.group({
        invoiceId: [],
        invoiceDate: [formatedDate],
        invoicedMonth: [chosenMonth],
        invoiceNumber: [1],
        totalAmount: [0],
        invoiceName: [''],
        subtotalAmount: [0],
        payment: this.serviceFrm.array([]),
        //enabled:[]
      });

      this.defaultInvoiceFormArray.clear();
      this.defaultInvoiceFormArray.push(invoiceItem);
      return true;

    } catch (error) {
      console.log('ERROR:' + error);
      return false;
    }
  }

  get defaultInvoiceFormArray(): FormArray {
    return this.serviceForm.get('invoice') as FormArray;
  }

  createDefaultPaymentItemFormGroup(formatedDate: any) {
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


  async generateInvoice(service: ServiceEntity, invoiceIndex: number) {
    //Al “Generar Factura” necesitamos actualizar ==> entity_service, entity_invoice con los siguientes valores:
    //entitiy_service >> Status = T e r m i n a d o
    //entity_invoice >> isGenerated = True

    let pdfBlob: any;
    (await this.emailService.generateInvoice(service, invoiceIndex)).subscribe({
      next: (resp) => {
        pdfBlob = resp;

      },
      error: (err) => {
        console.error(err);
        this.toast.showToast('Factura no generada', 3000, 'check2-square', true);
      },
      complete: () => {
        if (service.status == Status.Recurrente) {
          this.updateRecurrenteChildInvoiceStatusGenerated(service, invoiceIndex, pdfBlob)
        } else {
          this.updateGenerateInvoiceStatus(service, invoiceIndex, pdfBlob)
        }

      }
    });

  }

  private updateGenerateInvoiceStatus(service: ServiceEntity, invoiceIndex: number, pdfBlob: any) {

    const invUpdated = this.addInvoiceUpdateArray(service.invoice[invoiceIndex].invoiceId);

    if (invUpdated == false) {
      this.toast.showToast('Error al generar la Factura!!', 3000, 'x-circle', false);
      return;
    }


    this.invoiceUpdateform.patchValue({ //puede ser patchValue(para llenado parcial de la forma) en lugar de setValue,
      serviceId: service.serviceId,
      status: service.status == 'Recurrente' ? Status.Recurrente : Status.Terminado,
      //serviceName: service.serviceName
    })

    if (this.invoiceUpdateform.valid) {
      this.serviceInstance.updateService(this.invoiceUpdateform.value).subscribe({
        next: (response) => { },
        error: (err) => {
          this.toast.showToast('Error al generar la Factura!!', 3000, 'x-circle', false);
        },
        complete: () => {
          this.getAllServicesIntances(); //Traemos todas las intances  
          this.toast.showToast('Factura generada correctamente ', 3000, 'check2-square', true)
          this.invoiceUpdateform.reset(this.initialInvoiceUpdateValues);
          this.generarPdf(pdfBlob);
        }
      });

    } else {
      this.invoiceUpdateform.markAllAsTouched();
      this.toast.showToast('Error al generar el fomulario de Factura !!', 3000, 'x-circle', false);
    }

  }

  private updateRecurrenteChildInvoiceStatusGenerated(service: ServiceEntity, invoiceIndex: number, pdfBlob: any, closeServiceInvoice: boolean = false) {

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
          this.toast.showToast('Error al generar la Factura!!', 3000, 'x-circle', false);
        },
        complete: () => {
          if (closeServiceInvoice == false) {
            //case de uso para cuando se genera la factura
            this.getAllServicesIntances(); //Traemos todas las intances  
            this.toast.showToast('Factura generada correctamente ', 3000, 'check2-square', true)
            this.generarPdf(pdfBlob);

          } else { //caso  de uso para cuando se envia la factura
            this.sendEmail(service, invoiceIndex);
            //this.getAllServicesIntances(); //Traemos todas las intances  
            //this.toast.showToast('Factura generada correctamente ', 5000, 'check2-square', true)
          }

          invoiceArrayFrm.reset();
        }
      });

    } else {
      this.invoiceUpdateform.markAllAsTouched();
      this.toast.showToast('Error al generar el fomulario de Factura !!', 3000, 'x-circle', false)

    }

  }


  async updateSendMailAndCloseStatus(service: ServiceEntity, invoiceIndex: number) {
  this.displayBtnSendEmail = true;

    if (service.status == Status.Recurrente) {
      this.updateRecurrenteChildInvoiceStatusGenerated(service, invoiceIndex, null, true);
      return; //regresamos ya que para recurrentes no tenemos porque llamar de nuevo al backend 
    }

    const invUpdated = this.addInvoiceUpdateArray(service.invoice[invoiceIndex].invoiceId, true);

    if (invUpdated == false) {
      this.toast.showToast('Error al generar la Factura!!', 3000, 'x-circle', false);
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
          this.toast.showToast('Error al enviar el correo!!', 3000, 'x-circle', false);
        },
        complete: () => {
          this.sendEmail(service, invoiceIndex);
          this.invoiceUpdateform.reset(this.initialInvoiceUpdateValues);
        }

      });

    } else {
      this.invoiceUpdateform.markAllAsTouched();
      this.toast.showToast('Error al generar el fomulario para enviar el correo !!', 3000, 'x-circle', false);
    }
  }

  async generarPdf(pdfBytes) {

    const blob = new Blob([pdfBytes as unknown as ArrayBuffer], { type: 'application/pdf' });
    this.pdfUrl = URL.createObjectURL(blob);
    const nuevaVentana = window.open(this.pdfUrl, '_blank'); 

    // Si el navegador bloquea la ventana, ofrecer descarga
    if (!nuevaVentana) {
      const link = document.createElement('a');
      link.href = this.pdfUrl;
      link.download;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(this.pdfUrl);
      this.isLoading = false;
     /* this.getAllServicesIntances(); //Traemos todas las intances*/
    }

  }

  sendEmail(ServiceDto: ServiceEntity, invoiceIndex: number) {

    //verificar si hay factura existente
    // si no hay, sugerir al usuario, crear factura
    // si hay,  verificar  y luego enviarla
    //verificamos el cliente-servicio seleccionado

    this.emailService.sendEmail(ServiceDto, invoiceIndex).subscribe({
      next: (resp) => {
        if(resp.message == 'No se encontro la factura, favor de volver a generarla'){
          this.toast.showToast(resp.message , 5000, 'check2-square', false);
        }else {
          this.toast.showToast('Factura enviada correctamente ', 5000, 'check2-square', true)
        }
      },
      error: (err) => {
        console.error(err);
        this.toast.showToast('Error al enviar el correo ', 3000, 'check2-square', true);
      },
      complete: () => {
        this.displayBtnSendEmail = false;
        this.getAllServicesIntances(); //Traemos todas las intances  

      }
    });
  }


  ngOnInit() {
    this.getMessage(0);
    this.getallClientsBy(this.clientesFijos);
    this.lastUsedValue = this.clientesFijos;
    this.getAllServicesIntancesBy(this.clientesFijos); // de entrada traemos clientes fijos solamente
    this.getRecurrentInvoiceStatus();

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

  onRecurrentSwitchChange() {
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

    let cltType = this.extraValue == 'Fijo' || this.extraValue == 'Extra' ? 'Fijo' : 'Eventual';

    //esto evita tantas llamadas al backend en caso que haga click en los radio botones varias veces a  la vez
    if ((this.lastUsedValue == 'Fijo' || this.lastUsedValue == 'Extra') && this.extraValue != 'Eventual') { return }
    if ((this.lastUsedValue == 'Eventual') && (this.extraValue != 'Fijo' && this.extraValue != 'Extra')) { return }

    //this.serviceForm.get('client').reset(); 
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

    this.clientList.length = 0;
    this.clientInstance.getAllClientsBy(clientType).subscribe({
      next: (clientsList) => {

        clientsList.forEach(element => {
          this.clientList = [...this.clientList, element];
        });


        //this.clientList = clientsList;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  getRecurrentInvoiceStatus() {
    this.serviceInstance.getAutoInvoiceStatus().subscribe({
      next: (response) => {
        this.isRecurrencyEnabled = response.active; //si la recurrencia es activa entonces escondemos el boton de lo contrario lo mostramos
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

  resetFields() {
    this.serviceForm.reset(this.initialServiceFormValues);
    if (this.itemsFormArray != null) { this.itemsFormArray.clear(); }
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

        this.serviceForm.get('price').setValue(this.totalPrice); // totalPrice contiene la sumatoria del total de la factura
        const success = this.createDefaultInvoiceFormGroup(this.serviceForm.get('serviceDate').value);
        if (success) {
          this.createDefaultPaymentItemFormGroup(this.serviceForm.get('serviceDate').value);
        } else {
          this.toast.showToast('no se pudo crear el invoice por default!', 3000, 'check2-circle', false);
          return;
        }

        this.serviceInstance.addService(this.serviceForm.value).subscribe({
          next: (response) => {

            console.table(response);
            this.toast.showToast('Servicio creado exitosamente!!', 3000, 'check2-circle', true);
          },
          error: (err) => {
            console.log(err);
            this.toast.showToast('Error crear el servicio!!', 3000, 'x-circle', false);
          },
          complete: () => {

            this.onCancel() // llamamos on cancel para poder irnos al tab de consulta
          }
        });

      } else if (action == 'Actualizar') {

        this.serviceForm.get('price').setValue(this.totalPrice); // totalPrice contiene la sumatoria del total de la factura
        this.serviceForm.removeControl('invoice');
        
        this.serviceInstance.updateService(this.serviceForm.value).subscribe({
          next: (response) => {
            this.toast.showToast('Servicio actualizado exitosamente!!', 3000, 'check2-circle', true);
          },
          error: (err) => {

            this.toast.showToast('Error al actualizar el servicio!!', 3000, 'x-circle', false);
          },
          complete: () => {
            this.onCancel();
            this.getAllServicesIntances();
            this.initialServiceForm(); // Se agrega este metodo para reinicializar los valores despues de actualizar
          }
        });
      }

    } else {

      this.serviceForm.markAllAsTouched();
      this.toast.showToast('Campos Inválidos, por favor revise el formulario!!', 3000, 'x-circle', false);
    }
  }

  /**
   * Confirmacion de Pago de Servicio 
   * Recibimos el ServiceEntitiy que deseamos pagar
   * si el pago es cash entonces el payment status sera 'Pagado', el Service Status sera 'Terminado' y el invoice isGenerated sera 'True'
   * de caso contrario se sigue el flujo normal de cobro para generar facturas
  */
  onPaymentSubmit(serviceEnt: ServiceEntity, invoiceIndex: number) {


    const succesful = this.createPaymentItemFormGroup(serviceEnt, invoiceIndex);
    if (!succesful) {
      return;
    }

    this.totalPrice = 0; //reset to zero prior to do final calculation
    this.calculateTotal(serviceEnt.price ? serviceEnt.price.toString() : '0');
    this.calculateTotal(serviceEnt.invoice[invoiceIndex].payment[0].taxAmount ? serviceEnt.invoice[invoiceIndex].payment[0].taxAmount.toString() : '0');


    let invoiceNum = uuidv4();
    this.paymentForm.patchValue({ //puede ser patchValue(para llenado parcial de la forma) en lugar de setValue,
      invoiceId: serviceEnt.invoice[invoiceIndex].invoiceId,
      invoiceDate: serviceEnt.invoice[invoiceIndex].payment[0].paymentDate,
      invoiceNumber: invoiceNum,
      totalAmount: this.totalPrice,
      invoicedMonth: serviceEnt.invoice[invoiceIndex].invoicedMonth,
      invoiceName: this.removeExtraSpaces(serviceEnt.client.name) + '_' + this.removeExtraSpaces(serviceEnt.client.lastName) + '_' + invoiceNum + '.pdf',
      subtotalAmount: serviceEnt.invoice[invoiceIndex].payment[0].paymentAmount,
      isGenerated: this.esPagoCash && this.esPagoCash == 'Cash' ? true : serviceEnt.invoice[invoiceIndex].isGenerated,
      service: {
        serviceId: serviceEnt.serviceId,
        status: this.esPagoCash && this.esPagoCash == 'Cash' ? Status.Cerrado : serviceEnt.status,
      }
      //payment: este se llena cuando llamos a this.createPaymentItemFormGroup al comienzo de este metodo
    })

    if (this.paymentForm.valid) {
     
      this.invoiceInstance.addInvoice(this.paymentForm.value).subscribe({
        next: (response) => {
          this.toast.showToast('Pago generado exitosamente!!', 3000, 'check2-circle', true);
        },
        error: (err) => {
          console.log(err);
          this.toast.showToast('Error al generar el Pago!!', 3000, 'x-circle', false);
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
      this.toast.showToast('Campos Inválidos, porfavor revise el formulario de Pago!!', 3000, 'x-circle', false);
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
    if (message == 0) {  //Tab Consulta
      this.getAllServicesIntancesBy(this.clientesFijos, false);
      this.getRecurrentInvoiceStatus();
    }

    if (message == 1) {  //Tab Crear Servicio

      this.onRadioChange();
    }

    if (message == 2) {  //Tab Pagos
      this.getAllServicesIntances();
    }
  }

  deleteServiceDetail(serviceDTO: ServiceEntity) {

    //preguntar antes de eliminar
    this.showToast = false;

    // verificamos el estatus del pago, si no hay pago- confirmacion de pago, preguntar si se desea eliminar
    // caso de que el pago esta pagado, pero no se ha generado la factura, no se debera poder eliminar
    // caso de que la factura ya se genero pero no se ha enviado al cliente, no se debera poder eliminar
    const serviceObject = new ServiceEntity();
    let invoiceObjectArray:InvoiceEntity[] = [];
    let invoiceObject = new InvoiceEntity();
    
    invoiceObject.enabled=false;
    invoiceObject.invoiceNumber=serviceDTO.invoice[0].invoiceNumber;
    invoiceObject.invoiceId = serviceDTO.invoice[0].invoiceId;

    invoiceObjectArray.push(invoiceObject);
    serviceObject.enabled = false; // deshabilitamos el objeto
    serviceObject.serviceId = serviceDTO.serviceId;
    serviceObject.invoice = invoiceObjectArray;

    this.serviceInstance.updateService(serviceObject).subscribe({
      next: (response) => {
        this.toast.showToast('Servicio eliminado exitosamente!!', 3000, 'check2-circle', true);
      },
      error: (err) => {
        this.toast.showToast('Error al eliminar el Servicio!!', 3000, 'x-circle', false);
      },
      complete: () => {
        this.getMessage(0)
      }
    });
    //this.toast.showToast('Hay que implementar este metodo', 7000, 'x-circle', false);
  }

  updateServiceDetail(serviceDTO: ServiceEntity) {

    if (this.isUpdating) {
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
      if (!serviceDTO.isExtra) {
        this.extraValue = this.radioOptions[0];
      } else {
        this.extraValue = this.radioOptions[1];
      }

    } else { //Eventual
      this.extraValue = this.radioOptions[2];
    }

    this.cliente = this.client.clientId;


    //this.getallClientsBy(this.extraValue);

    this.isRecurrentService = serviceDTO.status == Status.Recurrente ? true : false;

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
      invoice:this.serviceFrm.array([]),
      isExtra: this.isExtraOption
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

  initialServiceForm() {
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
    this.isUpdateBtnDisabled=false; //deshabilitamos el botón
  }

  private calculateTotal(itemPrice: string) {
    this.totalPrice += parseInt(itemPrice, 10);
  }

  onDeleteDetails(itemIndex: number) {
    this.itemsFormArray.removeAt(itemIndex); //remove from groupForm

    this.serviceDetails.splice(itemIndex, 1); //remove from UI
  }

  onEditDetails(servDetail: ServiceDetailEntity, entityIndex: number) {
    this.isUpdateBtnDisabled=true; //deshabilitamos el botón
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
      this.onInputBlur((event.target as HTMLInputElement).name, '');
    }
  }

  onInputBlur(control: string, value: any) {
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
      this.paymentAmountIsValid = value && !isNaN(value) ? true : false;

    }
    else if (control == 'taxAmount') {
      this.taxAmountIsValid = value && !isNaN(value) ? true : false;

    } else if (control == 'paymentMethod') {

      this.paymentMethodIsValid = value ? value == 'none' ? false : true : false;
    }

  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {

      if (this.clientEntitiyToGet == undefined || this.clientEntitiyToGet.trim().length === 0) { return; }

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
          this.toast.showToastWarning('No se encontraron Pagos para ese servicio', 5000, 'x-circle');
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

    const currentDate = new Date();
    let currentDateFormatted = formatDate(currentDate, 'yyyy-MM-dd', this.locale);
    this.serviceForm.get('serviceId').setValue(entity.serviceId);
    this.serviceForm.get('serviceName').setValue('Servicio');
    this.serviceForm.get('client.clientId').setValue(entity.client.clientId);

    /*const months = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];*/

    const fullNameMonths = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    //const currentMonth = months[currentDate.getMonth()];
    const currentFullMonth = fullNameMonths[currentDate.getMonth()];
    
    let cMonth = currentDate.getMonth()+1;
    let invoiceDate = currentDate.getFullYear() + '-' + cMonth;

    if (this.serviceForm.valid) {

      // verificamos si existe factura en el mes actual
      let servId: number = entity.serviceId;
      
      this.serviceInstance.getInvoicesXMonth(servId, invoiceDate).subscribe({
        next: (invoiceExists) => {

          if (invoiceExists.exists == true || invoiceExists.exists == 'true') {

            // mando mensaje 
            this.toast.showToastWarning('La factura del mes de "' + currentFullMonth + '" ya existe! <br><br> *Recordatorio: <br> Crear la factura cada inicio de mes.', 3000);
            
            return;
          } else {
            
            const success = this.createDefaultInvoiceFormGroup(currentDateFormatted); //agregamos el default invoice a la serviceForm
            if (success) {
              this.createDefaultPaymentItemFormGroup(currentDateFormatted); //agregamos el default payment al invoiceGroup q acabamos de agregar
            } else {
              this.toast.showToast('no se pudo crear el invoice!!', 3000, 'check2-circle', false);
              return;
            }


            //remove unnecessary fields
            this.serviceForm.removeControl('serviceDate');
            this.serviceForm.removeControl('status');
            this.serviceForm.removeControl('price');
            this.serviceForm.removeControl('serviceDetail');
            this.serviceForm.removeControl('isExtra');
            //this.serviceForm.removeControl('serviceName');
            // this.serviceForm.removeControl('client');

            this.serviceInstance.generateInvoice(this.serviceForm.value).subscribe({
              next: (response) => {
                this.toast.showToast('Servicio recurrente actualizado exitosamente!!', 3000, 'check2-circle', true);
              },
              error: (err) => {

                this.toast.showToast('Error al actualizar el servicio recurrente!!', 3000, 'x-circle', false);
              },
              complete: () => {
                this.onCancel();
                this.getAllServicesIntancesBy(this.clientesFijos); 
                this.initialServiceForm();
              }
            }); 
          }// termino else
           
        },
        error: (error) => {
          console.error(error);
          this.toast.showToast(error, 3000, 'x-circle', false);
        },
        complete: () => {
          this.onCancel();
          this.getAllServicesIntancesBy(this.clientesFijos); // de entrada traemos clientes fijos solamente
          this.initialServiceForm();
        }
      });

    }
  }

  existenceInvoice(serviceId: number, invoicedMonth: string) {

    this.serviceInstance.getInvoicesXMonth(serviceId, invoicedMonth).subscribe({
      next: (servList) => {

        
        this.originalValues = servList;
        this.serviceList = servList;

      },
      error: (error) => {
        console.error(error);
      },
    });

  }

}


