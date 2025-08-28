import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ClientEntity } from '@app/@core/entities/Client.entity';
import { ServiceEntity } from '@app/@core/entities/Service.entity';
import { EmailService } from '@app/@core/services/Email.service';
import { ServicesInstances } from '@app/@core/services/Services.service';
import { ToastUtility } from '@app/@core/utils/toast.utility';
import { environment } from '@env/environment';

interface ParentItem {
  id: number;
  name: string;
  showDetails: false,
  subItems: SubItem[];
}

interface SubItem {
  subId: number;
  description: string;
  status: 'active' | 'inactive' | 'pending';
}

@Component({
  selector: 'app-service',
  standalone: false,
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss'
})
export class ServiceComponent {

    isLoading = true;
  serviceList: ServiceEntity[] = [];

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

  constructor(private toast: ToastUtility, private readonly servicesList: ServicesInstances, http: HttpClient) {
    /*this.mailForm = this.fb.group({
      to: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      text: ['', Validators.required]
    });*/
    this.emailService = new EmailService(http);
  }

  generateInvoice() { throw new Error('Method not implemented.'); }


  onSelect(service: ServiceEntity) {
    //this.selectedService = service;
    alert(`Seleccionaste: ${service.client.email} `);
  }

  sendEmail(ServiceDto: ServiceEntity) {
  
    //verificar si hay factura existente
    // si no hay, sugerir al usuario, crear factura
    // si hay,  verificar  y luego enviarla
    //verificamos el cliente-servicio seleccionado
console.log('SERVICE.Component:  '+JSON.stringify(ServiceDto));
    this.emailService.sendEmail(ServiceDto).subscribe({
      next: () => alert('Correo enviado correctamente ✅'),
      error: (err) => {
        console.error(err);
        alert('Error al enviar el correo ❌');
      }
    });


   // this.enviado = true;
    /*if (this.mailForm.valid) {
      this.mailService.sendEmail(
        this.mailForm.value.to,
        this.mailForm.value.subject,
        this.mailForm.value.text
      ).subscribe({
        next: res => this.respuesta = 'Correo enviado con éxito',
        error: err => this.respuesta = 'Error al enviar el correo'
      });
    }*/
  }


  ngOnInit() {
    this.servicesList.getAllServices().subscribe({
      next: (servList) => {
        this.serviceList = servList;
        this.isLoading = false;

        this.services = this.serviceList;
        this.collectionSize = this.services.length;
        this.paginatedServices = this.services.slice(0, this.pageSize);
        console.log(JSON.stringify(this.serviceList))
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  /*METODOS PAGINACION*/
  private updatePaginatedData(): void {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedServices = this.services.slice(startIndex, endIndex);
  }

  onPageChange(newPage: number): void {
    //console.log('AQUI ENTRA');
    this.page = newPage;
    console.log(this.page);
    this.updatePaginatedData();
  }
  /*FIN METODOS DE PAGINACION*/

  toggleDetails(Item: any) { Item.showDetails = !Item.showDetails; }
  onClear() { throw new Error('Method not implemented.'); }
  categories: any;
  onSelectChange($event: any) { throw new Error('Method not implemented.'); }
  toolLabel: any;
  toolForm: any;
  toolButton: any;

  onSubmit(arg0: any) { throw new Error('Method not implemented.'); }

  getMessage($event: any) { throw new Error('Method not implemented.'); }
  recivedTabIndex: number = 0;

  parentData: ParentItem[] = [
    {
      id: 1,
      name: 'Parent A',
      showDetails: false,
      subItems: [
        { subId: 101, description: 'Sub A1', status: 'active' },
        { subId: 102, description: 'Sub A2', status: 'pending' },
      ],
    },
    {
      id: 2,
      name: 'Parent B',
      showDetails: false,
      subItems: [
        { subId: 201, description: 'Sub B1', status: 'inactive' },
        { subId: 202, description: 'Sub B2', status: 'active' },
      ],
    },
  ];
}