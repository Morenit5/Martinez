import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientEntity } from '@app/@core/entities/Client.entity';
import { ClientService } from '@app/@core/services/Client.service';
import { ToastUtility } from '@app/@core/utils/toast.utility';
import { Observable } from 'rxjs';
import * as jsonData from '@core/enums/data.json';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss',
})
export class ClientComponent implements OnInit {
  onSelectChange($event: any) { throw new Error('Method not implemented.'); }

  clientLabel: string = 'Registro de Clientes';
  clientButton: string = 'Registrar';
  clients: ClientEntity[] = [];// se crea un array vacio de la interfaz
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

  constructor(private fbClient: FormBuilder, private toast: ToastUtility) {
    this.clientList = this.clientService.fetchData1();
    this.opciones = jsonData.clientes;

    this.clientForm = this.fbClient.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      clientType: ['', Validators.required],
      registryDate: ['', Validators.required]//,
      //enabled: [false],
    });
      
  }

  ngOnInit() {
    /*this.toolList =this.toolService.fetchData();*/
    //this.clientList = this.clientService.fetchData1();
  }

  onSubmit(accion: string) {
    this.clientForm.updateValueAndValidity();

    if (this.clientForm.valid) {
      if (accion == 'Registrar') {
        let convertDate = JSON.parse(JSON.stringify(this.clientForm.controls['registryDate'].value));
        let fechaConvertida = convertDate.year + '-' + convertDate.month + '-' + convertDate.day;
        console.log(this.clientForm.valid);
        this.clientForm.value['registryDate'] = fechaConvertida;
        //const newTool: ToolEntity = this.toolForm.value;

        this.clientService.addClient(this.clientForm.value).subscribe({
          next: (response) => {
            this.toast.showToast('Cliente registrado exitosamente!!', 7000, 'check2-circle', true);
            console.log(response);
          },
          error: (err) => {
            this.toast.showToast('Error al registar la herramienta!!', 7000, 'x-circle', false);
          },
          complete: () => {
            this.onClear();
          }
        });
      }
    }
  }

  onClear() {
    if (this.reqTabId && this.reqTabId != 0) {
      this.recivedTabIndex = 0;
      this.reqTabId = 0;
      this.clientLabel = 'Registro de Clientes';
      this.clientButton = 'Registrar'
    }
    this.clientForm.reset();
  }

  updateClient(clientInstance: ClientEntity) {
    this.recivedTabIndex = 1;
    this.reqTabId = 1;
    this.clientLabel = 'Actualizar Cliente';
    this.clientButton = 'Actualizar'

    this.clientForm.patchValue({
      clientId: clientInstance.clientId,
      name: clientInstance.name,
      lastName: clientInstance.lastName,
      address: clientInstance.address,
      phone: clientInstance.phone,
      email: clientInstance.email,
      registryDate: clientInstance.registryDate,
      clienType:clientInstance.clienType
    });
    console.log(clientInstance);
  }

  async deleteClient(client: ClientEntity) {
    const clientObject = new ClientEntity();
    clientObject.enabled = false; // deshabilitamos el objeto
    clientObject.clientId = client.clientId;

    this.clientService.updateClient(clientObject).subscribe({
      next: (response) => {
        this.toast.showToast('Cliente eliminado exitosamente!!', 7000, 'check2-circle', true);
      },
      error: (err) => {
        this.toast.showToast('Error al eliminar al cliente!!', 7000, 'x-circle', false);
      },
      complete: () => {
        this.clientList = this.clientService.getAllClients();
      }
    });
  }

  getMessage(message: number) { this.recivedTabIndex = message; }

  
}
