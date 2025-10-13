import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryEntity } from '@app/@core/entities/Category.entity';
import { ToolEntity } from '@app/@core/entities/Tool.entity';
import { ToolService } from '@app/@core/services/Tool.service';
import { ToastUtility } from '@app/@core/utils/toast.utility';
import { DateAdapterService } from '@app/shared/services/date-adapter.service';
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tool',
  standalone: false,
  templateUrl: './tool.component.html',
  styleUrl: './tool.component.scss',
  providers: [{ provide: NgbDateAdapter, useClass: DateAdapterService}]
})

export class ToolComponent implements OnInit {
   
toolEntitiyToGet: any;
  originalValues: ToolEntity[] = []; //para guardar temporalmente valores originales
  toolLabel: string = 'Registro de Herramientas';
  toolButton: string = 'Registrar';
  categories: CategoryEntity[] = [];
  categoryId: number | null = null;
  recivedTabIndex: number = 0;
  checkoutForm;
  exceptions: any;
  toolForm: FormGroup;
  //toolList: Observable<ToolEntity[]> | undefined;
  toolService: ToolService = inject(ToolService);
  filteredToolList: ToolEntity[] = [];
  reqTabId: number;
  category: CategoryEntity;
   initialToolFormValues: any;

  /*Paginacion*/
  tools: ToolEntity[] = [];// se crea un array vacio de la interfaz
  paginatedTools: ToolEntity[] = [];
  page = 1; // Página actual
  pageSize = 7; // Elementos por página 
  collectionSize = 0; // Total de registros
  totalPages = 0;
  currentPage = 1;
  /*Paginacion*/

  isLoading = true;
initialClientFormValues: any;
name: string= undefined;
      code: string= undefined;
      status: string= undefined;
      toolState: string= undefined;
      //category: string= undefined;
      acquisitionDate: string= undefined;

  constructor(private fbTool: FormBuilder, private toast: ToastUtility) {
    this.getAllDataTools();

    this.toolForm = this.fbTool.group({
      toolId: [],
      name: ['', Validators.required],
      code: ['', Validators.required],
      status: ['', Validators.required],
      toolState: ['', Validators.required],
      category: ['', Validators.required],
      acquisitionDate: ['', Validators.required], 
      price:['', Validators.required], 
    });
    this.initialToolFormValues = this.toolForm.value;
    this.updatePaginatedData();
  }


    resetFields(){
    this.toolForm.reset(this.initialClientFormValues);
    
    //cleanup UI for next service details
this.name= undefined;
this.code= undefined;
      this.status= undefined;
      this.toolState= undefined;
      this.category= undefined;
      this.acquisitionDate= undefined;

    
  }

  getAllDataTools() {
    this.toolService.fetchData1().subscribe({
      next: (toolsList) => {
        this.tools = toolsList;
        this.originalValues = toolsList;
        console.log(toolsList);
        this.collectionSize = this.tools.length;
        this.paginatedTools = this.tools.slice(0, this.pageSize);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  @Output() guardado = new EventEmitter<void>();

  onSelectChange($categoryId: any) {
    this.category = new CategoryEntity();
    this.category.categoryId = $categoryId;
  }

 getMessage(message: number) {

    if(message == undefined)
      {
        message=0;
        this.recivedTabIndex=0;
      }
    this.recivedTabIndex = message;
  }

  ngOnInit(): void {
    //carga de categorias
    this.toolService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  onClearForm() {
 if (this.reqTabId && this.reqTabId == 1) {
      this.recivedTabIndex = 1;
      this.toolLabel = 'Registro de Herramientas';
      this.toolButton = 'Registrar'
    }
    this.reqTabId = 1; // al cancelar le enviamos al padre que cambie al tabulador 0
    this.recivedTabIndex = this.reqTabId;
    
    this.toolForm.reset();
}

 onCancel() {

        this.resetFields();
    this.toolLabel = 'Registro de Herramientas';
    this.toolButton = 'Registrar'

    //this.isReadOnly = false; //enable de regreso el field cliente
    //go back to consulta tab
    this.recivedTabIndex = 0;
    this.reqTabId = 0;
  }
clearForm(): void {
        
      }

  toggleDetails(Item: any) {
    Item.showDetails = !Item.showDetails;
  }

  /*METODOS PAGINACION*/
  private updatePaginatedData(): void {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedTools = this.tools.slice(startIndex, endIndex);
  }

  onPageChange(newPage: number): void {
    //console.log('AQUI ENTRA');
    this.page = newPage;
    console.log(this.page);
    this.updatePaginatedData();
  }
  /*FIN METODOS DE PAGINACION*/

  onSubmit(accion: string) {
    this.toolForm.updateValueAndValidity();

    if (this.toolForm.valid) {
      //let convertDate = JSON.parse(JSON.stringify(this.toolForm.controls['acquisitionDate'].value));
      //let fechaConvertida = convertDate.year + '-' + convertDate.month + '-' + convertDate.day;
      console.log(this.toolForm.valid);
      //this.toolForm.value['acquisitionDate'] = fechaConvertida;
      if (accion == 'Registrar') {

        console.log("ToolForm.Value "+this.toolForm.value);
        this.toolService.addTool(this.toolForm.value).subscribe({
          next: (response) => {
            this.toast.showToast('Herramienta registrada exitosamente!!', 7000, 'check2-circle', true);
            console.log(response);
          },
          error: (err) => {
            console.log('ENTRAMOS AL ERROR: '+JSON.stringify(err.error.error));
            let errorMessage =JSON.stringify(err.error.error); 
            console.log(errorMessage);
            if(errorMessage.startsWith('"Error:'))
            {
              console.log(errorMessage);
              errorMessage=errorMessage.slice(7,errorMessage.length-1);
            }
            this.toast.showToast( errorMessage/*'Error al registar la categoria!!'*/, 7000, 'x-circle', false);
          },
          /*error: (err) => {
            this.toast.showToast('Error al registar la herramienta!!', 7000, 'x-circle', false);
          },*/
          complete: () => {
            this.onClear();
          }
        });
      } else if (accion == 'Actualizar') {

        this.toolService.updateTool(this.toolForm.value).subscribe({
          next: (response) => {
            this.toast.showToast('Herramienta actualizada exitosamente!!', 7000, 'check2-circle', true);
          },
          error: (err) => {
            this.toast.showToast('Error al actualizar la Herramienta!!', 7000, 'x-circle', false);
          },
          complete: () => {
            this.onClear();
            this.getAllDataTools();
          }
        });
      }
    }else {
      console.log(this.toolForm.valid);
      this.toolForm.markAllAsTouched();
      this.toast.showToast('Campos inválidos, por favor revise el formulario!!', 7000, 'x-circle', false);
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
    //console.log('TEXTO ' + text);

    if (!text) {
      console.log(' entra a !text ' + text)
      this.filteredToolList = this.tools;
      return;
    }
    this.filteredToolList = this.tools.filter((tool) =>
      tool.name.toLowerCase().includes(text.toLowerCase()),
    );
    console.log("entra aqui" + this.filteredToolList);
  }

    onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const searchResults: ToolEntity[] = this.originalValues.filter(item => item.name.includes(this.toolEntitiyToGet)); 

      if (searchResults.length !== 0) {
        this.tools = searchResults;
        this.collectionSize = this.tools.length;
        this.paginatedTools = this.tools.slice(0, this.pageSize);

      } else {
        this.toast.showToastWarning('La Herramienta ' + this.toolEntitiyToGet + ' no existe!', 7000, 'x-circle');
      }

    } else if (event.key === 'Backspace' || event.key === 'Delete') {

      if ((this.toolEntitiyToGet && this.toolEntitiyToGet.length == 0) || !this.toolEntitiyToGet) {
        if (this.originalValues && this.originalValues.length !== 0) {

          this.tools = this.originalValues;
        }
      }
    }
  }

  updateTool(toolInstance: ToolEntity) {
    this.recivedTabIndex = 1;
    this.reqTabId = 1;
    this.toolLabel = 'Actualizar Herramienta';
    this.toolButton = 'Actualizar'

console.log("Esta CHINGADERA es el id: "+toolInstance.category.categoryId)
    this.toolForm.patchValue({
      toolId: toolInstance.toolId,
      name: toolInstance.name,
      code: toolInstance.code,
      image: toolInstance.image,
      status: toolInstance.status,
      toolState: toolInstance.toolState,
      category: toolInstance.category.categoryId,
      acquisitionDate: toolInstance.acquisitionDate ,
      price: toolInstance.price/**/
    });
    
    console.log(toolInstance);
  }

  async deleteTool(tool: ToolEntity) {
    //const toolObject = new ToolEntity();
    //toolObject.enabled = false; // deshabilitamos el objeto
    //toolObject.toolId = tool.toolId;

    console.log("ID: "+tool.toolId);

    this.toolForm.patchValue({
      toolId: tool.toolId,
      enabled:false
    });
    //this.toolService.updateTool(this.toolForm.value).subscribe({

    this.toolService.updateTool(this.toolForm.value ).subscribe({
          next: (response) => {
            this.toast.showToast('Herramienta actualizada exitosamente!!', 7000, 'check2-circle', true);
          },
          error: (err) => {
            this.toast.showToast('Error al actualizar la Herramienta!!', 7000, 'x-circle', false);
          },
          complete: () => {
            this.onClear();
            this.getAllDataTools();
          }
        });
    
    
   /* .subscribe(data => {
      console.log('Datos con promise:', data);
      //enviar el toast
      this.toast.showToast('Herramienta eliminada exitosamente!!', 7000, 'check2-circle', true);

    }).catch(error => {
      console.error('Error al eliminar', error);
      //enviar el toast
      this.toast.showToast('Error al registar la herramienta!!', 7000, 'x-circle', false);
    });*/
    this.getAllDataTools();
    
    /*.subscribe({
      next: (response) => {
        this.toast.showToast('Categoría eliminada exitosamente!!', 7000, 'check2-circle', true);
      },
      error: (err) => {
        this.toast.showToast('Error al eliminar la categoría!!', 7000, 'x-circle', false);
      },
      complete: () => {
        //this.categoryList = this.categoryService.getAllCategories();
        this.getAllDataTools();
      }
    });*/

    
  }
}