import { Component } from '@angular/core';
import { ServiceEntity } from '@app/@core/entities/Service.entity';
import { ServicesInstances } from '@app/@core/services/Services.service';
import { ToastUtility } from '@app/@core/utils/toast.utility';

interface ParentItem {
  id: number;
  name: string;
  showDetails: false,
  subItems: SubItem[];
}

interface SubItem {
  subId: number;
  description: string;
  status: 'active' | 'inactive' | 'pending';
}

@Component({
  selector: 'app-service',
  standalone: false,
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss'
})
export class ServiceComponent {
generateInvoice() {
throw new Error('Method not implemented.');
}
  isLoading = true;
  serviceList: ServiceEntity[] = []; 
 

  constructor( private toast: ToastUtility, private readonly servicesList:ServicesInstances){}

  ngOnInit() {
    this.servicesList.getAllServices().subscribe({
      next: (servList) => {
        this.serviceList = servList;
        this.isLoading = false;
        console.log(JSON.stringify(this.serviceList) )
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  toggleDetails(Item: any) {
    Item.showDetails = !Item.showDetails;
  }
  onClear() {
    throw new Error('Method not implemented.');
  }
  categories: any;
  onSelectChange($event: any) {
    throw new Error('Method not implemented.');
  }
  toolLabel: any;
  toolForm: any;
  toolButton: any;
  onSubmit(arg0: any) {
    throw new Error('Method not implemented.');
  }
  getMessage($event: any) {
    throw new Error('Method not implemented.');
  }
  recivedTabIndex: number = 0;

  parentData: ParentItem[] = [
    {
      id: 1,
      name: 'Parent A',
      showDetails: false,
      subItems: [
        { subId: 101, description: 'Sub A1', status: 'active' },
        { subId: 102, description: 'Sub A2', status: 'pending' },
      ],
    },
    {
      id: 2,
      name: 'Parent B',
      showDetails: false,
      subItems: [
        { subId: 201, description: 'Sub B1', status: 'inactive' },
        { subId: 202, description: 'Sub B2', status: 'active' },
      ],
    },
  ];





}


