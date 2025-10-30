import { ClientEntity } from "./Client.entity";
import { InvoiceEntity } from "./Invoice.entity";


export class ServiceEntity {
    serviceId: number;
    serviceName: string;
    serviceDate: Date;
    invoicedMonth: string
    status: string;
    price: string;
    client: ClientEntity;
    showDetails: boolean = false;
    showMonthlyInvoices:boolean = false;
    serviceDetail: ServiceDetailEntity[];
    invoice:InvoiceEntity[];
    isExtra: boolean;
    enabled: boolean;
}



export class ServiceDetailEntity {
    serviceDetailsId: number;
    serviceType: string;
    description: string;
    unitMeasurement: string;
    quantity: number;
    price: number

}

