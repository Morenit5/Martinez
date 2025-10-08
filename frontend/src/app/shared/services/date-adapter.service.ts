import { Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


@Injectable({
  providedIn: 'root'
})
export class DateAdapterService extends NgbDateAdapter<string>{

  fromModel(value: string): NgbDateStruct | null {
    if (!value) {
      return null;
    }
    const parts = value.split('-');
    return {
      year: parseInt(parts[0], 10),
      month: parseInt(parts[1], 10),
      day: parseInt(parts[2], 10)
    };
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? `${date.year}-${this.pad(date.month)}-${this.pad(date.day)}` : null;
  }

  private pad(i: number): string {
    return i < 10 ? `0${i}` : `${i}`;
  }
}
