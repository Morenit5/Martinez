import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToolEntity } from '@app/@core/entities/Tool.entity';
import { iTool } from '@app/@core/interfaces/Tool.interface';
import { ToolService } from '@app/@core/services/Tool.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tool',
  standalone: false,
  templateUrl: './tool.component.html',
  styleUrl: './tool.component.scss',
})

export class ToolComponent implements OnInit {

  recivedTabIndex: number;

  getMessage(message: number) {
    this.recivedTabIndex = message;
  }

  toolForm: FormGroup;
  tools: ToolEntity[] = [];// se crea un array vacio de la interfaz
  toolList: Observable<iTool[]> | undefined;

  toolService: ToolService = inject(ToolService);
  filteredToolList: ToolEntity[] = [];

  /* constructor(private fbTool: FormBuilder) {
     this.toolForm = this.fbTool.group({
       name: ['', Validators.required],
       code: ['', Validators.required],
       image: ['', Validators.required],
       status: ['', Validators.required],
       toolState: ['', Validators.required],
       provider: ['', Validators.required],
       acquisitionDate: [null, Validators.required],
       enabled: [false]
     });
   }*/

  ngOnInit() {
    /*this.toolList =this.toolService.fetchData();*/
    this.toolList = this.toolService.fetchData1();
  }


  onSubmit(): void {
    if (this.toolForm.valid) {
      const newTool: ToolEntity = this.toolForm.value;
      //this.toolForm.push(newTool);
      this.toolForm.reset();
    } else {
      this.toolForm.markAllAsTouched();
    }
  }

  onClear() {
    this.toolForm.reset();
  }

  filterResults(text: string) {
    console.log('Entra a FilterResults');

    if (!text) {
      this.filteredToolList = this.tools;
      return;
    }
    this.filteredToolList = this.tools.filter((tool) =>
      tool.name.toLowerCase().includes(text.toLowerCase()),
    );
    console.log("entra aqui" + this.filteredToolList);
  }

  editarHerramienta(arg0: any) {
    throw new Error('Method not implemented.');
  }

  abrirConfirmacion(_t39: any) {
    throw new Error('Method not implemented.');
  }

}
