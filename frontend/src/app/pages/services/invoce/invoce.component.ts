import { Component, ViewChild } from '@angular/core';
import { ServiceEntity } from '@app/@core/entities/Service.entity';
import { ModalConfig } from '@app/@core/interfaces/ModalConfig.interface';
import { EmailService } from '@app/@core/services/Email.service';
import { ServicesInstances } from '@app/@core/services/Services.service';
import { ToastUtility } from '@app/@core/utils/toast.utility';
import { PdfviewerComponent } from '../pdfviewer/pdfviewer.component';


@Component({
  selector: 'app-invoce',
  standalone: false,
  templateUrl: './invoce.component.html',
  styleUrl: './invoce.component.scss'
})
export class InvoceComponent {

  recivedTabIndex: number = 0;
  isLoading: boolean = true;

  /*Paginacion*/
  serviceList: ServiceEntity[] = [];
  paginatedServices: ServiceEntity[] = [];
  originalValues: ServiceEntity[] = []; //para detener valores originales cuando se hace una busqueda
  page = 1; // Página actual
  pageSize = 7; // Elementos por página
  collectionSize = 0; // Total de registros
  totalPages = 0;
  currentPage = 1;

  //PDF Viewer
  pdfData: Blob;
  pdfUrl: string;
  @ViewChild('modal') private modalComponent: PdfviewerComponent
  modalConfig: ModalConfig;

  monthOptions: string[] = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dec'];
  mesToGet: string = undefined;
  entitiyToGet: string;  //el usuario que queremos buscar

  lastVal = 'asc'
  arrow = 'arrow-up-short'


  constructor(private toast: ToastUtility, private readonly serviceInstance: ServicesInstances, private readonly emailService: EmailService) { 
   
  }


  ngOnInit() {
     this.getAllClosedServicesIntances(); // de entrada traemos clientes fijos solament
  }

  private async openPDFViewer() {
    this.modalConfig = { closeButtonLabel: 'Cerrar', };
    this.pdfUrl = URL.createObjectURL(this.pdfData);

    return await this.modalComponent.open();
  }

  onNameChange(newValue: string) {

    let monthIndex = this.monthOptions.indexOf(this.entitiyToGet.toString())

    if (monthIndex >= 0) {
      monthIndex++; //aumentamos uno al mes ya que el array comienza en 0
      if (monthIndex > 0 && monthIndex < 10) {
        this.mesToGet = '0' + monthIndex;
      } else {
        this.mesToGet = monthIndex.toString();
      }
    }


  }

  //nombre
  //apellido
  //nombre + apellido
  //fecha
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
     // console.log(this.originalValues)

     if(this.entitiyToGet== undefined || this.entitiyToGet.trim().length===0)
        {
          return;
        }

      let listEntities: ServiceEntity[];

      const numWords = this.entitiyToGet.trim().split(/\s+/).length;
      if (numWords == 1) {
        if (this.mesToGet != undefined) {
          listEntities = this.findByMonth();
        } else {
          listEntities = this.findByName(); //este busca primero por nombre, si no encuentra nada busca por apellido
        }
      } else if (numWords > 1) {
        listEntities = this.findByFirstLast();
      }

      if (listEntities.length !== 0) {

        this.serviceList = listEntities;
        this.collectionSize = this.serviceList.length;
        this.paginatedServices = this.serviceList.slice(0, this.pageSize);

      } else {
        if (this.mesToGet != undefined) {
          this.toast.showToastWarning('No se encontraron facturas del mes ' + this.entitiyToGet, 5000, 'x-circle');
        } else {
          this.toast.showToastWarning('No se encontraron facturas del Usuario ' + this.entitiyToGet, 5000, 'x-circle');
        }

      }

    } else if (event.key === 'Backspace' || event.key === 'Delete') {


      if ((this.entitiyToGet && this.entitiyToGet.length == 0) || !this.entitiyToGet) {
        if (this.originalValues && this.originalValues.length !== 0) {

          this.serviceList = this.originalValues;
          this.collectionSize = this.serviceList.length;
          this.paginatedServices = this.serviceList.slice(0, this.pageSize);
        }

      }
    }
  }

  findByName(): ServiceEntity[] {

    let searchResults: ServiceEntity[] = this.originalValues.filter(item => item.client.name.includes(this.entitiyToGet));

    //si no encontramos nada atraves de nombre buscamos atraves de apellido
    if (searchResults.length <= 0) {
      searchResults = this.findByLastName();
    }
    return searchResults;
  }

  findByLastName() {
    const searchResults: ServiceEntity[] = this.originalValues.filter(item => item.client.lastName.includes(this.entitiyToGet));
    return searchResults;
  }

  findByFirstLast() {
    let firstLast: string[] = this.entitiyToGet.trim().replace(/\s+/g, ' ').split(' ');
    const searchResults: ServiceEntity[] = this.originalValues.filter(item => item.client.name.includes(firstLast[0]) && item.client.lastName.includes(firstLast[1]));
    return searchResults;
  }

  findByMonth() {

    var dateobj = new Date();
    const searchResults: ServiceEntity[] = this.originalValues.filter(item => {
      const itemDate = item.invoice[0].invoiceDate instanceof Date ? item.invoice[0].invoiceDate[0] : new Date(item.invoice[0].invoiceDate);
      const startDate: Date = new Date(dateobj.getFullYear() + '-' + this.mesToGet + '-01');
      const endDate: Date = new Date(dateobj.getFullYear() + '-' + this.mesToGet + '-31');

      return itemDate >= startDate && itemDate <= endDate;

    });
    this.mesToGet = undefined;
    return searchResults;
  }

  /*METODOS PAGINACION*/
  private updatePaginatedData(): void {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedServices = this.serviceList.slice(startIndex, endIndex);
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.updatePaginatedData();
  }

  async onViewPDF(invoiceName: string) {
    this.isLoading = true;
    (await this.emailService.getInvoiceByClient(invoiceName)).subscribe({
      next: (resp) => {
        this.pdfData = resp;
      },
      error: (err) => {
        console.error(err);
        this.toast.showToast('Error al obtener la factura del servicio', 5000, 'check2-square', true);
      },
      complete: () => {
        this.isLoading = false;
        this.openPDFViewer();
      }
    });
  }

  sendEmail(ServiceDto: ServiceEntity,invoiceIndex:number) {

    this.emailService.sendEmail(ServiceDto,invoiceIndex).subscribe({
      next: () => this.toast.showToast('Factura reenviada correctamente ', 5000, 'check2-square', true),
      error: (err) => {
        console.error(err);
        this.toast.showToast('Error al reenviar la factura ', 5000, 'check2-square', false);
      }
    });
  }

  private getAllClosedServicesIntances(clientFirst?: string, clientLast?: string, month?: string) {
    this.serviceList.length = 0;

    if (!clientFirst && !clientLast && !month) {
      this.serviceInstance.getAllClosedServicesBy().subscribe({
        next: (servList) => {
          this.originalValues = servList;
          this.serviceList = servList;
          this.collectionSize = this.serviceList.length;
          this.paginatedServices = this.serviceList.slice(0, this.pageSize);

        },
        error: (error) => {
          console.error(error);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });

    } else {
      this.serviceInstance.getAllClosedServicesBy(clientFirst, clientLast, month).subscribe({
        next: (servList) => {
          this.originalValues = servList;
          this.serviceList = servList;
          this.collectionSize = this.serviceList.length;
          this.paginatedServices = this.serviceList.slice(0, this.pageSize);

        },
        error: (error) => {
          console.error(error);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }

  }


  sortDate(colName: string) {
    if (this.lastVal == 'desc') {
      this.arrow = 'arrow-up-short';
      this.lastVal = 'asc'

    } else {
      this.arrow = 'arrow-down-short';
      this.lastVal = 'desc'

    }

    this.sortTableByColumn(this.originalValues, colName == 'serviceDate'? 'serviceDate':'serviceName', this.lastVal);
    this.serviceList = this.originalValues;
    this.collectionSize = this.serviceList.length;
    this.paginatedServices = this.serviceList.slice(0, this.pageSize);
  }

  sortTableByColumn<T>(data: T[], columnName: keyof T, sortOrder: string): T[] {
    // Create a shallow copy to avoid modifying the original array
    const sortedData = data

    sortedData.sort((a, b) => {
      const valueA = a[columnName];
      const valueB = b[columnName];

      if (valueA < valueB) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sortedData;
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
