import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryEntity } from '@app/@core/entities/Category.entity';
import { iCategory } from '@app/@core/interfaces/Category.interface';
import { CategoryService } from '@app/@core/services/Category.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})

export class CategoryComponent {

  recivedTabIndex: number = 0;
  categoryForm: FormGroup;
  categoryList: Observable<iCategory[]> | undefined;
  categoryService: CategoryService = inject(CategoryService);

  constructor(private fbCategory: FormBuilder, private http: HttpClient) {
    this.categoryForm = this.fbCategory.group({
      name: ['', Validators.required],
      categoryType: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.categoryList = this.categoryService.fetchData1();
  }

  onSubmit() { //: void
    this.categoryForm.updateValueAndValidity();
    console.log(this.categoryForm.errors);

    if (this.categoryForm.valid) {

      console.log(this.categoryForm.valid);
      const newCategory: CategoryEntity = this.categoryForm.value;
      this.categoryService.add(newCategory);

    } else {
      console.log(this.categoryForm.valid);
      this.categoryForm.markAllAsTouched();
    }

    this.categoryService.add(this.categoryForm.value).subscribe(() => {
      alert('Categoría registrada');
      this.categoryForm.reset();
    });

  }

  onClear() {
    this.categoryForm.reset();
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
