import { CategoryEntity } from "./Category.entity";

export class ToolEntity {
  toolId: number;
  category: CategoryEntity;
  name: string;
  code: string;
  image: string;
  status: string;
  toolState: string;
  provider: string;
  acquisitionDate: Date;
  enabled: boolean;
  price:number;
  showDetails: boolean = false;
}



