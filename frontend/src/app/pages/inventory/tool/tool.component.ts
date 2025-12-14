import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
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
  providers: [{ provide: NgbDateAdapter, useClass: DateAdapterService }]
})

export class ToolComponent implements OnInit {
  
  toolEntitiyToGet: any;
  originalValues: ToolEntity[] = []; //para guardar temporalmente valores originales
  toolLabel: string = 'Registro de Herramientas';
  toolButton: string = 'Registrar';
  categories: CategoryEntity[] = [];
  categoryId: number;
  recivedTabIndex: number = 0;
  checkoutForm;
  exceptions: any;
  toolForm: FormGroup;
  deleteToolForm: FormGroup;
  
  toolService: ToolService = inject(ToolService);
  filteredToolList: ToolEntity[] = [];
  reqTabId: number;
  category: CategoryEntity;
  
  initialDeleteToolFormValues:any;

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
 

  toolSt: {name:string}[] = [
    { name: 'Bueno' },
    { name: 'Malo' },
    { name: 'Reparación' }
  ];

  toolStatus: {name:string}[] = [
    {name:'Activo'},
    {name:'Inactivo'}
  ];
  
 
  constructor(private fbTool: FormBuilder, private toast: ToastUtility, private sanitizer: DomSanitizer) {
    
    this.getAllDataTools();

    this.prepareToolFormFields();

    this.deleteToolForm = this.fbTool.group({
      toolId: [null,Validators.required],
      enabled: [null,Validators.required]
    });
    this.initialDeleteToolFormValues = this.deleteToolForm.value;

    this.updatePaginatedData();
  }
  ngOnInit(): void {
    this.getMessage(0);
  }


  prepareToolFormFields() {

    this.toolService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => console.error('Error:', err),
      complete: () => {
        this.categoryId = this.categories.find(category => category.name === 'General').categoryId;

        this.toolForm = this.fbTool.group({
          toolId: [],
          name: ['', Validators.required],
          code: ['', Validators.required],
          status: ['Activo', { nonNullable: true, validators: [Validators.required] }],
          toolState: ['Bueno', { nonNullable: true, validators: [Validators.required] }],
          category: [this.categoryId, { nonNullable: true, validators: [Validators.required] }],
          acquisitionDate: ['', Validators.required],
          price: ['', Validators.required],
          image: [],
        });

      }
    });
  }

  getAllDataTools() {
    this.toolService.fetchData1().subscribe({
      next: (toolsList) => {
        this.tools = toolsList;
        this.originalValues = toolsList;
       
        this.collectionSize = this.tools.length;
        this.paginatedTools = this.tools.slice(0, this.pageSize);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () =>{
         this.getCurrentPageAvatars();
      }
    });
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


  onClearForm() {
    this.prepareToolFormFields();
  }

  onCancel() {

     this.prepareToolFormFields();
    this.toolLabel = 'Registro de Herramientas';
    this.toolButton = 'Registrar'

    //this.isReadOnly = false; //enable de regreso el field cliente
    //go back to consulta tab
    this.recivedTabIndex = 0;
    this.reqTabId = 0;
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

  onFileSelected(event, toolInstance: any) {

    const file: File = event.target.files[0];
    let avatarName;
    if (file) {
      
      const formData = new FormData();
      formData.append('thumbnail', file, toolInstance.toolId);

      this.toolService.uploadToolImage(formData).subscribe({
        next: (response) => {
          avatarName = response;
        },
        error: (error) => {
          console.error(error);
        },
        complete:() => {
          this.getAllDataTools();
        }
      });
    }
  }

  onImgError(event) {
    event.target.src = 'images/no-image.png'
    
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.updatePaginatedData();
  }
  /*FIN METODOS DE PAGINACION*/

  onSubmit(accion: string) {
   // this.toolForm.updateValueAndValidity();

    if (this.toolForm.valid) {

     
      if (accion == 'Registrar') {
        //console.log("ENTRA AL METODO ONSUBMIT REGISTRAR: "+ this.toolForm);
        this.toolService.addTool(this.toolForm.value).subscribe({
          next: (response) => {
            this.toast.showToast('Herramienta registrada exitosamente!!', 3000, 'check2-circle', true);
            
          },
          error: (err) => {
            let errorMessage = err.error;
            errorMessage = errorMessage.toString().slice(7, errorMessage.length - 1);
            this.toast.showToast(errorMessage, 3000, 'x-circle', false);
          },
          complete: () => {
            this.onClear();
            this.getAllDataTools();
          }
        });

        
      } else if (accion == 'Actualizar') {

        this.toolService.updateTool(this.toolForm.value).subscribe({
          next: (response) => {
            this.toast.showToast('Herramienta actualizada exitosamente!!', 3000, 'check2-circle', true);
          },
          error: (err) => {
            this.toast.showToast('Error al actualizar la Herramienta!!', 3000, 'x-circle', false);
          },
          complete: () => {
            this.onClear();
            this.getAllDataTools();
          }
        });
      }
    } else {
      
      
      this.toolForm.markAllAsTouched();
      this.toast.showToast('Campos inválidos, por favor revise el formulario!!', 3000, 'x-circle', false);
    }
  }

  onClear() {
    if (this.reqTabId && this.reqTabId != 0) {
      this.recivedTabIndex = 0;
      this.reqTabId = 0;
      this.toolLabel = 'Registro de Herramientas';
      this.toolButton = 'Registrar'
    }
     this.prepareToolFormFields();
  }

  filterResults(text: string) {
   
    if (!text) {
      this.filteredToolList = this.tools;
      return;
    }
    this.filteredToolList = this.tools.filter((tool) =>
      tool.name.toLowerCase().includes(text.toLowerCase()),
    );
    
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if(this.toolEntitiyToGet == undefined || this.toolEntitiyToGet.trim().length===0 ){return;}
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

        this.updatePaginatedData();
      }
    }
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
      category: toolInstance.category.categoryId,
      acquisitionDate: toolInstance.acquisitionDate,
      price: toolInstance.price/**/
    });

  }

  async deleteTool(tool: ToolEntity) {
    this.deleteToolForm.patchValue({
      toolId: tool.toolId,
      enabled: false
    });
    
    this.toolService.updateDeleteTool(this.deleteToolForm.value).subscribe({
      next: (response) => {
        this.toast.showToast('Herramienta Eliminada exitosamente!!', 3000, 'check2-circle', true);
      },
      error: (err) => {
        this.toast.showToast('Error al Eliminar la Herramienta!!', 3000, 'x-circle', false);
      },
      complete: () => {
        this.deleteToolForm.reset(this.initialDeleteToolFormValues);
        this.getAllDataTools();
      }
    });
  }

    getCurrentPageAvatars() {

    for (const tool of this.tools) {
      let x = this.getUserAvatarImage(tool.image).subscribe({
        next: (imageBlob) => {
          tool.imgBlob = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageBlob));
        },
      });
    }
  }


  getUserAvatarImage(avatarName: string) {
    let result;
    try {
      result = this.toolService.getUserAvatar(avatarName);

    } catch (error) {
      console.log(error);
    }
    return result;
  }

}