export class ClientEntity {
  clientId?: number;
  name?: string;
  lastName?: string;
  address?: string;
  phone?: string;
  email?: string;
  clienType?: string;
  registryDate?: Date;
  //enabled?: boolean;

  get fullName(): string {
    return `${this.name} ${this.lastName}`;
  }
}
