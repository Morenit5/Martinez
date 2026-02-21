import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
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
import { Subscription } from 'rxjs';
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
  selector: 'app-quote',
  standalone: false,
  templateUrl: './quote.component.html',
  styleUrl: './quote.component.scss', 
  providers: [{ provide: NgbDateAdapter, useClass: DateAdapterService }]
})

export class QuoteComponent implements OnInit {

cliente;
  isUpdateBtnDisabled:boolean= false;
    valueSubscription: Subscription;

  isLoading = false;
  isUpdating = false; // bandera para saber cuando el servicio esta actualizando
  serviceList: ServiceEntity[] = [];
  clientList: ClientEntity[] = [];

  //entities usados para crear un servicio nuevo
  service: ServiceEntity;
  quoteDelete: ServiceEntity;
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

  serviceLabel: string = 'Cotización';
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
  //activeService = 1;  // para controlar el servicio activo ==> fijo/eventual/extra , por default es fijo

  radioOptions = ['Fijo', 'Eventual']; //, 'Extra', 'Extra'
  isExtraSwitchValue: boolean = false;
  isRecurrentService: boolean = false;
  isExtraOption: boolean = false;
  extraValue: string = this.radioOptions[0]; //valor seleccionado por defecto para radio opciones es Fijo
  lastUsedValue: string;
  clientesFijos: string = 'Fijo';
  clientesEventuales: string = 'Eventual';

  initialServiceFormValues: any;
  initialPaymentFormValues: any;
  initialInvoiceUpdateValues: any;

  //Forms para actualizacion de la factura (Generar Y Mandar)
  invoiceUpdateform: FormGroup;

  //para buscar por services 
  originalValues: ServiceEntity[] = [];  //para detener valores originales cuando se hace una busqueda en el tab de Consulta
  quoteEntitiyToGet: any;

  months: string[] = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  //recurrencia
  isRecurrencyEnabled: boolean = false;

  // VARIABLES
  showToastWarning = false;
  toastWarningMessage = '';
  displayBtnSendEmail: boolean= false;
  showToastWarningQuote = false;
  taxPercentage: number = 0;

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
      isExtra: [''],
      isQuote:[]
    });
    this.initialServiceFormValues = this.serviceForm.value;
    this.createInvoiceUpdateForm();
  }

  createService(quoteEntity: ServiceEntity) {
    this.updateQuote(quoteEntity, false, 'generar');
  }

  // Mostrar mensaje en toast con botones Sí/No
  showToastWarningMessage(message: string) {
    this.toastWarningMessage = message;
    this.showToastWarning = true;
  }

  // Mostrar mensaje en toast con botones Sí/No
  showToastWarningMessageQuote(message: string) {
    this.toastWarningMessage = message;
    this.showToastWarningQuote = true;
  }

  siEliminar() {
 
    this.updateQuote(this.quoteDelete, false, 'eliminar');
    this.showToastWarning = false;
  }

  generateService() {
   
    this.updateQuote(this.quoteDelete, false, 'generar');
    this.showToastWarningQuote = false;
  }

  cancelarToast() {
    // this.showToast = false;
    this.showToastWarning = false;
     this.showToastWarningQuote = false;
    this.quoteDelete = null;
  }

  preguntarEliminar(serviceDTO: ServiceEntity) {

    this.quoteDelete = serviceDTO;
    // this.showToast = true;
    this.showToastWarningMessage('¿Desea eliminar la Cotización "'+ serviceDTO.serviceName+'" ?');
  }

  generateQuoteConfirmation(serviceDTO: ServiceEntity) {

    this.quoteDelete = serviceDTO;
    // this.showToast = true;
    this.showToastWarningMessageQuote('¿Desea Generar el Servicio "'+ serviceDTO.serviceName+'" ?');
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
      //console.log('ERROR:' + error);
      return false;
    }
  }

  get defaultInvoiceFormArray(): FormArray {
    return this.serviceForm.get('invoice') as FormArray;
  }

  createDefaultPaymentItemFormGroup(formatedDate: any) {
  let getTax = this.calculateTax();

       let paymentItem = this.serviceFrm.group({
      paymentId: [],
      paymentDate: [formatedDate],
      paymentAmount: [0],
      paymentMethod: ['none'],
      taxAmount: [getTax],
      paymentStatus: [paymentStatus.PorPagar],
      isServicePaid: [false]
    });

    this.defaultPaymentFormArray.clear();
    this.defaultPaymentFormArray.push(paymentItem);
  }

  calculateTax()
  {
     let taxToPay: number;
    if (this.taxPercentage != 0) {
      taxToPay = (this.totalPrice * this.taxPercentage) / 100;
      console.log(taxToPay);
    }
    else {
      taxToPay = 0;
    }

    return taxToPay;
  }

  get defaultPaymentFormArray() {
    
    return this.defaultInvoiceFormArray.at(0).get('payment') as FormArray;
  }
  // ************* Termina - Metodos para crear los valores por default de Invoice y Payment Cuando se genera un service *************

  async generateInvoice(service: ServiceEntity, invoiceIndex: number) {

    let pdfBlob: any;
    (await this.emailService.generateQuote(service, invoiceIndex)).subscribe({
      next: (resp) => {
        pdfBlob = resp;

      },
      error: (err) => {
        console.error(err);
        this.toast.showToast('Cotización no generada', 3000, 'check2-square', true);
      },
      complete: () => {
        this.generarPdf(pdfBlob);
        // AL RECIBIR EL BLOB HAY QUE DECIDIR SI SE VA A PONER EL PREVIEW LISTO SU CHETO DE FCO YA ESTA FALLANDO GN
      }
    });

  }

  async generarPdf(pdfBytes) {

    const blob = new Blob([pdfBytes as unknown as ArrayBuffer], { type: 'application/pdf' });
    this.pdfUrl = URL.createObjectURL(blob);
    const nuevaVentana = window.open(this.pdfUrl, '_blank'); 

    // Si el navegador bloquea la ventana, ofrecer descarga
    if (!nuevaVentana) {
       nuevaVentana.onload = () => {
      const link = document.createElement('a');
      link.href = this.pdfUrl;
      link.download;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(this.pdfUrl);
      this.isLoading = false;
     /* this.getAllServicesIntances(); //Traemos todas las intances*/
    
       };
      }

  }

  sendEmailQuote(ServiceDto: ServiceEntity) {

    //verificar si hay factura existente
    // si no hay, sugerir al usuario, crear factura
    // si hay,  verificar  y luego enviarla
    //verificamos el cliente-servicio seleccionado
    let quotename = 'quote_'+ServiceDto.client?.name.trim().replaceAll(' ','_')+ ServiceDto.serviceId+'.pdf';

    this.emailService.sendEmailQuote(ServiceDto, quotename).subscribe({
      next: (resp) => {
        if(resp.message == 'No se encontro la cotización, favor de volver a generarla'){
          this.toast.showToast(resp.message , 5000, 'check2-square', false);
        }else {
          this.toast.showToast('Cotización enviada correctamente ', 5000, 'check2-square', true)
        }
      },
      error: (err) => {
        console.error(err);
        this.toast.showToast('Error al enviar el correo ', 3000, 'check2-square', true);
      },
      complete: () => {
        this.displayBtnSendEmail = false;
        //.getAllServicesIntances(); //Traemos todas las intances  

      }
    });
  }


  ngOnInit() {
    this.getMessage(0);
    this.getallClientsBy(this.clientesFijos);
    this.lastUsedValue = this.clientesFijos;
    this.getAllQuotesIntances(); // de entrada traemos clientes fijos solamente
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
   * Metodo Usado para el tab de Consulta
   * es decir getAllServicesBy() funciona con todo lo relacionado a Consulta
   */
  getAllQuotesIntances() {
    this.serviceList = null;

    this.serviceInstance.getAllQuotes().subscribe({
      next: (quoteList) => {
        this.originalValues = quoteList;
        this.serviceList = quoteList;
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


  toggleDetails(Item: any) {
    Item.showDetails = !Item.showDetails;
  }

  onCancel() {

    this.resetFields();

    this.serviceLabel = 'Cotización';
    this.serviceButton = 'Registrar'


    this.isReadOnly = false; //enable de regreso el field cliente
    //go back to consulta tab
    this.recivedTabIndex = 0;
    this.reqTabId = 0;

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


        this.serviceForm.get('isQuote').setValue(true);
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
            this.toast.showToast('Cotización creada exitosamente!!', 3000, 'check2-circle', true);
          },
          error: (err) => {
            //console.log(err);
            this.toast.showToast('Error crear la Cotización!!', 3000, 'x-circle', false);
          },
          complete: () => {

            this.onCancel() // llamamos on cancel para poder irnos al tab de consulta
          }
        }); 

      } else if (action == 'Actualizar') {

        this.serviceForm.get('price').setValue(this.totalPrice); // totalPrice contiene la sumatoria del total de la factura
        let srvfrmInvoice= this.serviceForm.get('invoice') as FormArray;
        let srvpaymentGroup= srvfrmInvoice.at(0) as FormGroup;
        let srvfrmPaymentArray= srvpaymentGroup.get('payment') as FormArray;
        let srvpaymentGrp= srvfrmPaymentArray.at(0) as FormGroup;
        srvpaymentGrp.get('taxAmount').setValue(this.calculateTax());
       
        this.serviceInstance.updateService(this.serviceForm.value).subscribe({
          next: (response) => {
            this.toast.showToast('Cotización actualizada exitosamente!!', 3000, 'check2-circle', true);
          },
          error: (err) => {

            this.toast.showToast('Error al actualizar la Cotización!!', 3000, 'x-circle', false);
          },
          complete: () => {
            this.onCancel();
            this.initialServiceForm(); // Se agrega este metodo para reinicializar los valores despues de actualizar
          }
        });
      }

    } else {

      this.serviceForm.markAllAsTouched();
      this.toast.showToast('Campos Inválidos, por favor revise el formulario!!', 3000, 'x-circle', false);
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

    //debemos ver si esto ya esta cargado tal vez usar un metodo para cache values
    //y no ir tantas veces a la backend
    if (message == 0) {  //Tab Consulta
      this.getAllQuotesIntances();
      //this.getRecurrentInvoiceStatus();
    }

    if (message == 1) {  //Tab Crear Cotizacion

      this.onRadioChange();
    }

  }

  updateQuote(serviceDTO: ServiceEntity, isEnabled:boolean, accion: string) {

    //preguntar antes de eliminar
    this.showToast = false;

    // verificamos el estatus del pago, si no hay pago- confirmacion de pago, preguntar si se desea eliminar
    // caso de que el pago esta pagado, pero no se ha generado la factura, no se debera poder eliminar
    // caso de que la factura ya se genero pero no se ha enviado al cliente, no se debera poder eliminar
    const serviceObject = new ServiceEntity();

    if (accion == 'eliminar') {
      serviceObject.enabled = isEnabled; // deshabilitamos el objeto
    }

    if (accion == 'generar') {
      serviceObject.isQuote = isEnabled;
    }
    
    serviceObject.serviceId = serviceDTO.serviceId;
    
    this.serviceInstance.updateService(serviceObject).subscribe({
      next: (response) => {
        if(accion=='eliminar')
        {
          this.toast.showToast('Cotización eliminada exitosamente!!', 3000, 'check2-circle', true);
        }
        else
        {
          this.toast.showToast('Cotización generada exitosamente!!', 3000, 'check2-circle', true);
        }
      },
      error: (err) => {
        if(accion=='eliminar')
        {
          this.toast.showToast('Error al eliminar la Cotización!!', 3000, 'x-circle', false);
        }
        else
        {
          this.toast.showToast('Error al generar la Cotización!!' + err, 3000, 'x-circle', false);
        }
      },
      complete: () => {
        this.getMessage(0)
      }
    });
  }

  updateServiceDetail(serviceDTO: ServiceEntity) {

    if (this.isUpdating) {
      this.resetFields() //este metodo sirve para limpiar 
    }

    this.recivedTabIndex = 1;
    this.reqTabId = 1;
    this.serviceLabel = 'Actualizar Cotización';
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
      this.extraValue = this.radioOptions[1];
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
      invoice: this.serviceFrm.array([
        this.serviceFrm.group({
          invoiceId: serviceDTO.invoice[0].invoiceId,
          payment: this.serviceFrm.array([
            this.serviceFrm.group({
              paymentId: serviceDTO.invoice[0].payment[0].paymentId,
              taxAmount: serviceDTO.invoice[0].payment[0].taxAmount
            })
          ])
        })
      ]),
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
      isExtra: [''],
      isQuote:[]
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

    }

  }


  onSearchServiceKeyUp(event: KeyboardEvent) {

    if (event.key === 'Enter') {
      if (this.quoteEntitiyToGet == undefined || this.quoteEntitiyToGet.trim().length === 0) { return; }

      let listEntities: ServiceEntity[];

      listEntities = this.findByService();

      if (listEntities.length !== 0) {

        this.serviceList = listEntities;
        this.collectionSize = this.serviceList.length;
        this.paginatedServices = this.serviceList.slice(0, this.pageSize);

      } else {
        this.toast.showToastWarning('No se encontraron cotizaciones con ese nombre', 5000, 'x-circle');
      }

    } else if (event.key === 'Backspace' || event.key === 'Delete') {


      if ((this.quoteEntitiyToGet && this.quoteEntitiyToGet.length == 0) || !this.quoteEntitiyToGet) {
        if (this.originalValues && this.originalValues.length !== 0) {

          this.serviceList = this.originalValues;
          this.collectionSize = this.serviceList.length;
          this.paginatedServices = this.serviceList.slice(0, this.pageSize);
        }
      }
    }
  }

  findByService(): ServiceEntity[] {

    
    let searchResults: ServiceEntity[] = this.originalValues.filter(item => item.client.name.toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').includes(this.quoteEntitiyToGet.toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')));

    //si no encontramos nada atraves de nombre buscamos atraves de nombre
    if (searchResults.length <= 0) {
      searchResults = this.originalValues.filter(item => item.client.lastName.toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').includes(this.quoteEntitiyToGet.toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')));
    }
    return searchResults;
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


