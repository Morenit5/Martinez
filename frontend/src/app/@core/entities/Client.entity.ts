export class ClientEntity {
  clientId?: number;
  name?: string;
  lastName?: string;
  address?: string;
  phone?: string;
  email?: string;
  clientType?: string;
  registryDate?: Date;
  enabled?: boolean;
  showDetails: boolean = false;

  get fullName(): string {
    return `${this.name} ${this.lastName}`;
  }
}
