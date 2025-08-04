import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PaymentEntity } from '@app/@core/entities/Payment.entity';
import { iPayment } from '@app/@core/interfaces/Payment.interface';
import { PaymentService } from '@app/@core/services/Payment.service';
import { ToastUtility } from '@app/@core/utils/toast.utility';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tool',
  standalone: false,
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})

export class PaymentComponent implements OnInit, OnChanges {

  paymentLabel: string = 'Registro de Pagos';
  paymentButton: string = 'Registrar';
  payments: PaymentEntity[] = []; // se crea un array vacio de la interfaz
  paymentId: number | null = null;

  onSelectChange($event: any) {
    throw new Error('Method not implemented.');
  }

  enviarFormulario() {
    throw new Error('Method not implemented.');
  }

  recivedTabIndex: number = 0;
  checkoutForm;
  exceptions: any;
  paymentForm: FormGroup;
  //payments: PaymentEntity[] = [];
  paymentList: Observable<iPayment[]> | undefined;
  paymentService: PaymentService = inject(PaymentService);
  filteredPaymentList: PaymentEntity[] = [];
  reqTabId: number;

  constructor(private fbTool: FormBuilder, private toast: ToastUtility) {
    this.paymentList = this.paymentService.fetchData1();
    /*.subscribe(result => {
                console.log(result);
                return result;
            });*/

    this.paymentForm = new FormGroup({
      paymentDate: new FormControl('', [Validators.required]),
      paymentAmount: new FormControl('', [Validators.required]),
      paymentMethod: new FormControl('', [Validators.required]),
      taxAmount: new FormControl('', [Validators.required]),
      paymentStatus: new FormControl('', [Validators.required]),
      invoiceId: new FormControl('', [Validators.required])/**/
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

    /*this.paymentService.getCategories().subscribe(data => {
      this.payments = data;
    });*/
  }

  onSubmit(accion: string) { //: void
    this.paymentForm.updateValueAndValidity();

    if (this.paymentForm.valid)
    {
      if (accion == 'Registrar')
      {
        let convertDate = JSON.parse(JSON.stringify(this.paymentForm.controls['paymentDate'].value));
        let fechaConvertida = convertDate.year + '-' + convertDate.month + '-' + convertDate.day;
        console.log(this.paymentForm.valid);
        this.paymentForm.value['paymentDate'] = fechaConvertida;
        //const newTool: ToolEntity = this.toolForm.value;

        this.paymentService.add(this.paymentForm.value).subscribe({
          next: (response) => {
            this.toast.showToast('Pago registrado exitosamente!!', 7000, 'check2-circle', true);
            console.log(response);
          },
          error: (err) => {
            this.toast.showToast('Error al registar el pago!!', 7000, 'x-circle', false);
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
      this.paymentLabel = 'Registro de Pagos';
      this.paymentButton = 'Registrar'
    }

    this.paymentForm.reset();
  }

  filterResults(text: string) {
    console.log('Entra a FilterResults');

    if (!text) {
      this.filteredPaymentList = this.payments;
      return;
    }
    this.filteredPaymentList = this.payments.filter((payment) =>
      payment.paymentMethod.toLowerCase().includes(text.toLowerCase()),
    );
    console.log("entra aqui" + this.filteredPaymentList);
  }

  updatePayment(paymentInstance: iPayment) {
    this.recivedTabIndex = 1;
    this.reqTabId = 1;
    this.paymentLabel = 'Actualizar Pago';
    this.paymentButton = 'Actualizar'

    this.paymentForm.patchValue({
      paymentId: paymentInstance.paymentId,
      paymentDate: paymentInstance.paymentDate,
      paymentAmount: paymentInstance.paymentAmount,
      paymentMethod: paymentInstance.paymentMethod,
      taxAmount: paymentInstance.taxAmount,
      paymentStatus: paymentInstance.paymentStatus,
      //invoiceId: paymentInstance.invoiceId 
    });

    console.log(paymentInstance);
  }

  async deletePayment(payment: iPayment) {
    const paymentObject = new PaymentEntity();

    paymentObject.enabled = false; // deshabilitamos el objeto
    paymentObject.paymentId = payment.paymentId;
    //console.log("ToolComponent "+ JSON.stringify(toolObject));

    this.paymentService.update(payment.paymentId, paymentObject).then(data => {
      console.log('Datos con promise:', data);
      this.paymentList = this.paymentService.fetchData1();
    }).catch(error => {
      console.error('Error al eliminar', error);
    });
  }
} 