import { ClientEntity } from "./Client.entity";


export class ServiceEntity {
    serviceId: number;
    serviceName: string;
    serviceDate: Date;
    status: string;
    price: string;
    client: ClientEntity;
    showDetails: boolean = false;
    serviceDetail: ServiceDetail[];

}


class ServiceDetail {
    serviceDetailsId: number;
    serviceType: string;
    description: string;
    unitMeasurement: number;
    quantity: number;
    price: number

}

