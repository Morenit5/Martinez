import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryEntity } from '@app/@core/entities/Category.entity';
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

export class ToolComponent implements OnInit, OnChanges {

  categories: CategoryEntity[] = [];
  categoryId: number | null = null;

  onSelectChange($event: any) {
    throw new Error('Method not implemented.');
  }

  enviarFormulario() {
    throw new Error('Method not implemented.');
  }

  recivedTabIndex: number = 0;
  checkoutForm;
  exceptions: any;
  toolForm: FormGroup;
  tools: ToolEntity[] = [];// se crea un array vacio de la interfaz
  toolList: Observable<iTool[]> | undefined;
  toolService: ToolService = inject(ToolService);
  filteredToolList: ToolEntity[] = [];

  constructor(private fbTool: FormBuilder, private http: HttpClient) {
    this.toolList = this.toolService.fetchData1();

    this.toolForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(5)]),
      code: new FormControl('', [Validators.required, Validators.minLength(5)]),
      status: new FormControl('', [Validators.required]),
      toolState: new FormControl('', [Validators.required]),
      categoryId: new FormControl('', [Validators.required]),
      acquisitionDate: new FormControl('', [Validators.required])/**/
    })
  }

  @Output() guardado = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    console.log('Cada vez que se llama metodo OnChanges');
  }

  getMessage(message: number) {
    this.recivedTabIndex = message;
  }

  ngOnInit() {
    /*this.toolList =this.toolService.fetchData();*/
    //console.log('Cada vez que se llama metodo OnInit');
    //this.toolList = this.toolService.fetchData1();

    this.toolService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  onSubmit() { //: void
    this.toolForm.updateValueAndValidity();
    console.log(this.toolForm.errors);
    console.log('1 Llega al onSubmit ' + this.toolForm.valid);

    if (this.toolForm.valid) {
      let convertDate = JSON.parse(JSON.stringify(this.toolForm.controls['acquisitionDate'].value));
      let fechaConvertida = convertDate.year + '-' + convertDate.month + '-' + convertDate.day;
      console.log(this.toolForm.valid);
      this.toolForm.value['acquisitionDate'] = fechaConvertida;
      const newTool: ToolEntity = this.toolForm.value;
      this.toolService.add(newTool);

    } else {
      console.log(this.toolForm.valid);
      this.toolForm.markAllAsTouched();
    }

    this.toolService.add(this.toolForm.value).subscribe(() => {
      alert('Herramienta registrada');
      this.toolForm.reset();
    });

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

  async deleteTool(tool: iTool) {
    const toolObject = new ToolEntity();

    toolObject.enabled = false; // deshabilitamos el objeto
    toolObject.toolId = tool.toolId;
    //console.log("ToolComponent "+ JSON.stringify(toolObject));

    this.toolService.update(tool.toolId, toolObject).then(data => {
      console.log('Datos con promise:', data);
      this.toolList = this.toolService.fetchData1();
    }).catch(error => {
      console.error('Error al eliminar', error);
    });
  }
}
