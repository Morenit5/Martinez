export interface iPayment {
  paymentId: number;
  paymentDate: Date;
  paymentAmount: number;
  paymentMethod: string;
  taxAmount: number;
  paymentStatus: string;
  invoiceId: number;
  enabled: boolean;
}
