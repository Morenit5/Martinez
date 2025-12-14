
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientEntity } from '@app/@core/entities/Client.entity';
import { ClientService } from '@app/@core/services/Client.service';
import { ToastUtility } from '@app/@core/utils/toast.utility';
import { Observable } from 'rxjs';
import * as jsonData from '@core/enums/data.json';
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { DateAdapterService } from '@app/shared/services/date-adapter.service';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss',
  providers: [{ provide: NgbDateAdapter, useClass: DateAdapterService}]
})
export class ClientComponent implements OnInit {

  onSelectChange($event: any) { throw new Error('Method not implemented.'); }

  clientLabel: string = 'Registro de Clientes';
  clientButton: string = 'Registrar';
  clientId: number | null = null;
  recivedTabIndex: number = 0;
  checkoutForm;
  exceptions: any;
  clientForm: FormGroup;
  clientList: Observable<ClientEntity[]> | undefined;
  clientService: ClientService = inject(ClientService);
  filteredToolList: ClientEntity[] = [];
  reqTabId: number;
  opciones: any;
  inputLength: number = 0;
  initialClientFormValues: any;
  name: string = undefined;
  lastName: string = undefined;
  address: string = undefined;
  phone: string = undefined;
  email: string = undefined;
  clientType: string = undefined;
  registryDate: string = undefined;
  originalValues: ClientEntity[] = []; //para guardar temporalmente valores originales
  clientEntitiyToGet: any;
  /*Paginacion*/
  clients: ClientEntity[] = [];// se crea un array vacio de la interfaz
  paginatedClients: ClientEntity[] = [];
  page = 1; // Página actual
  pageSize = 7; // Elementos por página
  collectionSize = 0; // Total de registros
  totalPages = 0;
  currentPage = 1;
  /*Paginacion*/

  isLoading = true;
  toggleDetails(Item: any) { Item.showDetails = !Item.showDetails; }

  constructor(private fbClient: FormBuilder, private toast: ToastUtility) {

    this.getAllDataClients();
    this.opciones = jsonData.clientes;

    this.clientForm = this.fbClient.group({
      clientId: [],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      clientType: ['', Validators.required],
      registryDate: ['', Validators.required]//,
      //enabled: [false],
    });

    this.updatePaginatedData();
  }
  ngOnInit(): void {
    this.getMessage(0);
  }

  getAllDataClients() {
    this.clientService.fetchData1().subscribe({
      next: (clientsList) => {
        this.clients = clientsList;
         this.originalValues = clientsList;
        this.collectionSize = this.clients.length;
        this.paginatedClients = this.clients.slice(0, this.pageSize);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  onSubmit(accion: string) {
    this.clientForm.updateValueAndValidity();

    if (this.clientForm.valid) {

     
      if (accion == 'Registrar') {

        this.clientService.addClient(this.clientForm.value).subscribe({
          next: (response) => {
            this.toast.showToast('Cliente registrado exitosamente!!', 3000, 'check2-circle', true);
          },
          error: (err) => {
            let errorMessage = err.error;
            /*if (errorMessage.startsWith('"Error:')) {
              errorMessage = errorMessage.slice(7, errorMessage.length - 1);
            }*/
            errorMessage = errorMessage.toString().slice(0, errorMessage.length - 1);
            this.toast.showToast(errorMessage/*'Error al registar la categoria!!'*/, 3000, 'x-circle', false);
          },
          complete: () => {
            this.onCancel();
            this.getAllDataClients(); 
          }
        });
      } else if (accion == 'Actualizar') {

          this.clientService.updateClient(this.clientForm.value).subscribe({
          next: (response) => {
            this.toast.showToast('Cliente actualizado exitosamente!!', 3000, 'check2-circle', true);
          },
          error: (err) => {
            this.toast.showToast('Error al actualizar al cliente!!', 3000, 'x-circle', false);
          },
          complete: () => {
            this.onCancel();
            this.getAllDataClients(); 
          }
        });
      }
    }else {
      
      this.clientForm.markAllAsTouched();
      this.toast.showToast('Campos inválidos, por favor revise el formulario!!', 3000, 'x-circle', false);
    } 
  }

  resetFields() {
    this.clientForm.reset(this.initialClientFormValues);

    //cleanup UI for next service details
    this.name = undefined;
    this.lastName = undefined;
    this.address = undefined;
    this.phone = undefined;
    this.email = undefined;
    this.clientType = undefined;
    this.registryDate = undefined;
    this.clientForm.get('clientType')?.enable();
  }

  updateClient(clientInstance: ClientEntity) {
    this.recivedTabIndex = 1;
    this.reqTabId = 1;
    this.clientLabel = 'Actualizar Cliente';
    this.clientButton = 'Actualizar'

   this.clientForm.get('clientType')?.disable();
    this.clientForm.patchValue({
      clientId: clientInstance.clientId,
      name: clientInstance.name,
      lastName: clientInstance.lastName,
      address: clientInstance.address,
      phone: clientInstance.phone,
      email: clientInstance.email,
      registryDate: clientInstance.registryDate,
      clientType: clientInstance.clientType
    });

    
  }

  async deleteClient(client: ClientEntity) {
    const clientObject = new ClientEntity();
    clientObject.enabled = false; // deshabilitamos el objeto
    clientObject.clientId = client.clientId;
    delete clientObject.showDetails;
    this.clientService.updateClient(clientObject).subscribe({
      next: (response) => {
        this.toast.showToast('Cliente eliminado exitosamente!!', 3000, 'check2-circle', true);
      },
      error: (err) => {
        this.toast.showToast('Error al eliminar al cliente!!', 3000, 'x-circle', false);
      },
      complete: () => {
        this.clientList = this.clientService.getAllClients();
        this.getAllDataClients();
      }
    });
    this.getAllDataClients();
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



  /*METODOS PAGINACION*/
  private updatePaginatedData(): void {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedClients = this.clients.slice(startIndex, endIndex);
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.updatePaginatedData();
  }
  /*FIN METODOS DE PAGINACION*/


  onKeyUp(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        if(this.clientEntitiyToGet== undefined || this.clientEntitiyToGet.trim().length===0)
        {
          return;
        }
        const searchResults: ClientEntity[] = this.originalValues.filter(item => item.name.includes(this.clientEntitiyToGet)); 
  
        if (searchResults.length !== 0) {
          this.clients = searchResults;
          this.collectionSize = this.clients.length;
          this.paginatedClients = this.clients.slice(0, this.pageSize);
  
        } else {
          this.toast.showToastWarning('El Cliente ' + this.clientEntitiyToGet + ' no existe!', 7000, 'x-circle');
        }
  
      } else if (event.key === 'Backspace' || event.key === 'Delete') {
  
        if ((this.clientEntitiyToGet && this.clientEntitiyToGet.length == 0) || !this.clientEntitiyToGet) {
          if (this.originalValues && this.originalValues.length !== 0) {
  
            this.clients = this.originalValues;
          }
         this.updatePaginatedData(); 
        }
      }
    }

  onCancel() {

    //this.isReadOnly = false; //enable de regreso el field cliente
    //go back to consulta tab
    this.reqTabId = 0; // al cancelar le enviamos al padre que cambie al tabulador 0
    this.recivedTabIndex = this.reqTabId;

    this.resetFields();
    this.clientLabel = 'Registro de Clientes';
    this.clientButton = 'Registrar'

   

  }
}