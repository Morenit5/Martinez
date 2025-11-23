import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryEntity } from '@app/@core/entities/Category.entity';
import { iCategory } from '@app/@core/interfaces/Category.interface';
import { CategoryService } from '@app/@core/services/Category.service';
import { ToastUtility } from '@app/@core/utils/toast.utility';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})

export class CategoryComponent {
  categoryEntitiyToGet: any;
  originalValues: CategoryEntity[] = []; //para guardar temporalmente valores originales

  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
              if(this.categoryEntitiyToGet== undefined || this.categoryEntitiyToGet.trim().length===0)
        {
          return;
        }
      const searchResults: CategoryEntity[] = this.originalValues.filter(item => item.name.includes(this.categoryEntitiyToGet)); // || item.email.includes(this.userEntitiyToGet));

      if (searchResults.length !== 0) {
        this.categories = searchResults;
        this.collectionSize = this.categories.length;
        this.paginatedCategories = this.categories.slice(0, this.pageSize);

      } else {
        this.toast.showToastWarning('La Categoría ' + this.categoryEntitiyToGet + ' no existe!', 7000, 'x-circle');
      }

    } else if (event.key === 'Backspace' || event.key === 'Delete') {

      if ((this.categoryEntitiyToGet && this.categoryEntitiyToGet.length == 0) || !this.categoryEntitiyToGet) {
        if (this.originalValues && this.originalValues.length !== 0) {

          this.categories = this.originalValues;
        }
        this.updatePaginatedData();
      }
    }
  }

  deepCopy<T>(obj: T): T {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.deepCopy(item)) as T;
    }

    const copiedObj: { [key: string]: any } = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        copiedObj[key] = this.deepCopy((obj as any)[key]);
      }
    }
    return copiedObj as T;
  }

  categoryLabel: string = 'Registro de Categoría';
  categoryButton: string = 'Registrar';
  reqTabId: number;
  recivedTabIndex: number = 0;
  categoryForm: FormGroup;
  categoryList: Observable<iCategory[]> | undefined;
  categoryService: CategoryService = inject(CategoryService);

  /*Paginacion*/
  categories: CategoryEntity[] = [];// se crea un array vacio de la interfaz
  paginatedCategories: CategoryEntity[] = [];
  page = 1; // Página actual
  pageSize = 7; // Elementos por página
  collectionSize = 0; // Total de registros
  totalPages = 0;
  currentPage = 1;
  /*Paginacion*/

  constructor(private fbCategory: FormBuilder, private toast: ToastUtility) {
    //this.reqTabId=0;
    this.getAllDataCategories();
    this.categoryService.getAllCategories();
    //this.categoryList = this.categoryService.getAllCategories();

    this.categoryForm = this.fbCategory.group({
      categoryId: [],
      name: ['', Validators.required],
      categoryType: [''],
    });
    this.updatePaginatedData();
  }

  onCancel() {

    if (this.reqTabId && this.reqTabId == 1) {
      this.recivedTabIndex = 1;
      this.categoryLabel = 'Registro de Categoría';
      this.categoryButton = 'Registrar'
    }
    this.reqTabId = 0; // al cancelar le enviamos al padre que cambie al tabulador 0
    this.recivedTabIndex = this.reqTabId;
    this.categoryForm.reset();
  }

  getAllDataCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categoriesList) => {
        this.originalValues = categoriesList;
        this.categories = categoriesList;
        this.collectionSize = this.categories.length;
        this.paginatedCategories = this.categories.slice(0, this.pageSize);
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
    this.paginatedCategories = this.categories.slice(startIndex, endIndex);
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    console.log(this.page);

    this.updatePaginatedData();
  }
  /*FIN METODOS DE PAGINACION*/

  ngOnInit() {
  }

  onSubmit(accion: string) {

    this.categoryForm.updateValueAndValidity();

    if (this.categoryForm.valid) {

      if (accion == 'Registrar') {
        this.categoryService.addCategory(this.categoryForm.value).subscribe({
          next: (response) => {
            this.toast.showToast('Categoría registrada exitosamente!!', 7000, 'check2-circle', true);
            console.log(response);
          },
          error: (err) => {
            
            let errorMessage = JSON.stringify(err.error.error);
            console.log(errorMessage);
            if (errorMessage.startsWith('"Error:')) {
              console.log(errorMessage);
              errorMessage = errorMessage.slice(7, errorMessage.length - 1);
            }
            this.toast.showToast(errorMessage/*'Error al registar la categoria!!'*/, 7000, 'x-circle', false);
          },
          complete: () => {
            this.onClear();
            this.getAllDataCategories();
          }
        });

      } else if (accion == 'Actualizar') {

        this.categoryService.updateCategory(this.categoryForm.value).subscribe({
          next: (response) => {
            this.toast.showToast('Categoría actualizada exitosamente!!', 7000, 'check2-circle', true);
          },
          error: (err) => {
            this.toast.showToast('Error al actualizar la categoría!!', 7000, 'x-circle', false);
          },
          complete: () => {
            this.onClear();
            this.getAllDataCategories();
          }
        });
      }

    } else {
      console.log(this.categoryForm.valid);
      this.categoryForm.markAllAsTouched();
      this.toast.showToast('Campos inválidos, por favor revise el formulario!!', 7000, 'x-circle', false);
    }

  }

  onClear() {
    if (this.reqTabId && this.reqTabId != 0) {
      this.recivedTabIndex = 0;
      this.reqTabId = 0;
      this.categoryLabel = 'Registro de Categorías';
      this.categoryButton = 'Registrar'
    }
    //this.reqTabId = 0;

    this.categoryForm.reset();
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

  updateCategory(categoryInstance: iCategory) {
    this.recivedTabIndex = 1;
    this.reqTabId = 1;
    this.categoryLabel = 'Actualizar Categoría';
    this.categoryButton = 'Actualizar'

    this.categoryForm.patchValue({
      categoryId: categoryInstance.categoryId,
      name: categoryInstance.name,
      categoryType: categoryInstance.categoryType
    });

    console.log(categoryInstance);
  }

  async deleteCategory(category: iCategory) {
    const categoryObject = new CategoryEntity();

    categoryObject.enabled = false; // deshabilitamos el objeto
    categoryObject.categoryId = category.categoryId;

    this.categoryService.updateCategory(categoryObject).subscribe({
      next: (response) => {
        this.toast.showToast('Categoría eliminada exitosamente!!', 7000, 'check2-circle', true);
      },
      error: (err) => {
        this.toast.showToast('Error al eliminar la categoría!!', 7000, 'x-circle', false);
      },
      complete: () => {
        this.getAllDataCategories();
      }
    });
  }
}