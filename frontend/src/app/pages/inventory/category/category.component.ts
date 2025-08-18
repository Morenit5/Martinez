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

  categoryLabel: string = 'Registro de Categorías';
  categoryButton: string = 'Registrar';
  reqTabId: number;
  recivedTabIndex: number = 0;
  categoryForm: FormGroup;
  categoryList: Observable<iCategory[]> | undefined;
  categoryService: CategoryService = inject(CategoryService);

  constructor(private fbCategory: FormBuilder, private toast: ToastUtility) {
    this.categoryList = this.categoryService.getAllCategories();

    this.categoryForm = this.fbCategory.group({
      categoryId: [],
      name: ['', Validators.required],
      categoryType: ['', Validators.required],
    });
  }

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
            this.toast.showToast('Error al registar la categoria!!', 7000, 'x-circle', false);
          },
          complete: () => {
            this.onClear();
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
          }
        });
      }

    } else {
      console.log(this.categoryForm.valid);
      this.categoryForm.markAllAsTouched();
      this.toast.showToast('Campos Invalidos, porfavor revise el formulario!!', 7000, 'x-circle', false);
    }

  }

  onClear() {
    if (this.reqTabId && this.reqTabId != 0) {
      this.recivedTabIndex = 0;
      this.reqTabId = 0;
      this.categoryLabel = 'Registro de Categorías';
      this.categoryButton = 'Registrar'
    }

    this.categoryForm.reset();
  }

  getMessage(message: number) {
    this.recivedTabIndex = message;
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
        this.categoryList = this.categoryService.getAllCategories();
      }
    });
  }
}
