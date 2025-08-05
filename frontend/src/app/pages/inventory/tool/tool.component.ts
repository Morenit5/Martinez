import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryEntity } from '@app/@core/entities/Category.entity';
import { ToolEntity } from '@app/@core/entities/Tool.entity';
import { iTool } from '@app/@core/interfaces/Tool.interface';
import { ToolService } from '@app/@core/services/Tool.service';
import { ToastUtility } from '@app/@core/utils/toast.utility';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tool',
  standalone: false,
  templateUrl: './tool.component.html',
  styleUrl: './tool.component.scss',
})

export class ToolComponent implements OnInit {

  toolLabel: string = 'Registro de Herramientas';
  toolButton: string = 'Registrar';
  categories: CategoryEntity[] = [];
  categoryId: number | null = null;
  recivedTabIndex: number = 0;
  checkoutForm;
  exceptions: any;
  toolForm: FormGroup;
  tools: ToolEntity[] = [];// se crea un array vacio de la interfaz
  toolList: Observable<iTool[]> | undefined;
  toolService: ToolService = inject(ToolService);
  filteredToolList: ToolEntity[] = [];
  reqTabId: number;
  category: CategoryEntity;

  constructor(private fbTool: FormBuilder, private toast: ToastUtility) {
    this.toolList = this.toolService.fetchData1();

    this.toolForm = this.fbTool.group({
      toolId: [],
      name: ['', Validators.required],
      code: ['', Validators.required],
      status: ['', Validators.required],
      toolState: ['', Validators.required],
      category: ['', Validators.required],
      acquisitionDate: ['', Validators.required]
    })
  }

  @Output() guardado = new EventEmitter<void>();

  onSelectChange($categoryId: any) { 
    this.category = new CategoryEntity();
    this.category.categoryId = $categoryId;    
  }
  enviarFormulario() { throw new Error('Method not implemented.'); }

  getMessage(message: number) {
    this.recivedTabIndex = message;
  }

  ngOnInit() {
    this.toolService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  onSubmit(accion: string) { 
    this.toolForm.updateValueAndValidity();

    if (this.toolForm.valid) {

      let convertDate = JSON.parse(JSON.stringify(this.toolForm.controls['acquisitionDate'].value));
        let fechaConvertida = convertDate.year + '-' + convertDate.month + '-' + convertDate.day;
        console.log(this.toolForm.valid);
        this.toolForm.value['acquisitionDate'] = fechaConvertida;
      if (accion == 'Registrar') {

        this.toolService.addTool(this.toolForm.value).subscribe({
          next: (response) => {
            this.toast.showToast('Herramienta registrada exitosamente!!', 7000, 'check2-circle', true);
            console.log(response);
          },
          error: (err) => {
            this.toast.showToast('Error al registar la herramienta!!', 7000, 'x-circle', false);
          },
          complete: () => {
            this.onClear();
          }
        });
      }else if (accion == 'Actualizar') {

        this.toolService.updateTool(this.toolForm.value).subscribe({
          next: (response) => {
            this.toast.showToast('Herramienta actualizada exitosamente!!', 7000, 'check2-circle', true);
          },
          error: (err) => {
            this.toast.showToast('Error al actualizar la Herramienta!!', 7000, 'x-circle', false);
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
      this.toolLabel = 'Registro de Herramientas';
      this.toolButton = 'Registrar'
    }
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

  updateTool(toolInstance: ToolEntity) {
    this.recivedTabIndex = 1;
    this.reqTabId = 1;
    this.toolLabel = 'Actualizar Herramienta';
    this.toolButton = 'Actualizar'

    this.toolForm.patchValue({
      toolId: toolInstance.toolId,
      name: toolInstance.name,
      code: toolInstance.code,
      image: toolInstance.image,
      status: toolInstance.status,
      toolState: toolInstance.toolState,
      category: this.category,
      acquisitionDate: toolInstance.acquisitionDate /*,
        prize: toolInstance.prize*/
    });

    console.log(toolInstance);
  }

  async deleteTool(tool: ToolEntity) {
    const toolObject = new ToolEntity();
    toolObject.enabled = false; // deshabilitamos el objeto
    toolObject.toolId = tool.toolId;

    this.toolService.update(tool.toolId, toolObject).then(data => {
      console.log('Datos con promise:', data);
      //enviar el toast
       this.toast.showToast('Herramienta eliminada exitosamente!!', 7000, 'check2-circle', true);

    }).catch(error => {
      console.error('Error al eliminar', error);
      //enviar el toast
      this.toast.showToast('Error al registar la herramienta!!', 7000, 'x-circle', false);
    });
    this.toolList = this.toolService.fetchData1();
  }
}

