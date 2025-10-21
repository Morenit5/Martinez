import { InvoiceDetailsEntity } from "./InvoiceDetails.entity";
import { PaymentEntity } from "./Payment.entity";
import { ServiceEntity } from "./Service.entity";

export class InvoiceEntity {

    invoiceId: number;
    invoiceDate: Date;
    invoiceName: string;
    invoiceNumber: string;
    totalAmount: number;
    payment: PaymentEntity[];  //@OneToMany(() => EntityPayment, payment => payment.paymentId)
    //invoiceDetails: InvoiceDetailsEntity[];  // @OneToMany(() => EntityInvoiceDetails, invoiceDetail => invoiceDetail.invoiceDetailId)
    service?: ServiceEntity; //@OneToMany(() => EntityService, service => service.serviceId)
    
    isGenerated: boolean;
   
}