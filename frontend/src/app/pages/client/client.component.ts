import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { iClient } from '@app/@core/interfaces/Client.interface';
import { ClientService } from '@app/@core/services/Client.service';
import { ToastUtility } from '@app/@core/utils/toast.utility';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss',
})
export class ClientComponent implements OnInit {
  recivedTabIndex: number = 0;
  clientForm: FormGroup;
  clientList: Observable<iClient[]> | undefined;
  clientService: ClientService = inject(ClientService);

  constructor(private fbClient: FormBuilder, private toast: ToastUtility) {
    this.clientForm = this.fbClient.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      clienType: ['', Validators.required],
      registryDate: [null, Validators.required],
      enabled: [false],
    });
  }

  ngOnInit() {
    /*this.toolList =this.toolService.fetchData();*/
    this.clientList = this.clientService.fetchData1();
  }

  getMessage(message: number) {
    this.recivedTabIndex = message;
  }

  editarHerramienta(_t22: any) {
    throw new Error('Method not implemented.');
  }
  abrirConfirmacion(_t22: any) {
    throw new Error('Method not implemented.');
  }
}
