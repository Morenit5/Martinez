import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToolEntity } from '@app/@core/entities/tool.entity';

@Component({
  selector: 'app-tool',
  standalone: false,
  templateUrl: './tool.component.html',
  styleUrl: './tool.component.scss',
})
export class ToolComponent {
  toolForm: FormGroup;
  tools: ToolEntity[] = [];
  active = 1;
  isEdit = false;

  constructor(private fb: FormBuilder) {
    this.toolForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      image: ['', Validators.required],
      status: ['', Validators.required],
      toolState: ['', Validators.required],
      provider: ['', Validators.required],
      acquisitionDate: [null, Validators.required],
      enabled: [false]
    });
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

  addTool() {
    if (this.toolForm.valid) {
      console.log(this.toolForm.value);
      // API call to add user
    }
  }

  onClear() {
    this.toolForm.reset();
  }
}
