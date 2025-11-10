export class ConfigurationEntity {
  configurationId: number;
  email:string;
  password: string;
  isInvoiceAutomatically: boolean;
  licenseNumber: string;
  enableNotification: boolean;  //notificaciones para los clientes antes que se venza la factura
  enableOnDate: number; //en que dia se mandara la notificacion para los clientes antes que se venza la factura
  enabled: boolean;
    
}
