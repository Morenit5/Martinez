//import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap/datepicker/ngb-date-struct";

export class PaymentEntity {

  paymentId: number;
  paymentDate: Date;
  paymentAmount: number;
  paymentMethod: string;
  taxAmount: number;
  paymentStatus: string;
  invoiceId: number;
  enabled: boolean;
  isServicePaid:boolean;
}
