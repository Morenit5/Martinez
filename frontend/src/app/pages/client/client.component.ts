import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { iClient } from '@app/@core/interfaces/Client.interface';
import { ClientService } from '@app/@core/services/Client.service';
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

  constructor(private fbCategory: FormBuilder, private http: HttpClient) {
    this.clientForm = this.fbCategory.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      image: ['', Validators.required],
      status: ['', Validators.required],
      toolState: ['', Validators.required],
      provider: ['', Validators.required],
      acquisitionDate: [null, Validators.required],
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
