import { InvoiceEntity } from "./Invoice.entity";

export class InvoiceDetailsEntity {
    invoiceDetailId: number;
    invoice: InvoiceEntity; //@ManyToOne(() => EntityInvoice, invoice => invoice.invoiceId
    concept: string;
    price: number;
    quantity: number;
    subtotal: number;
}