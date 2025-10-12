import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { ModalConfig } from '@app/@core/interfaces/ModalConfig.interface';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pdfviewer',
  standalone: false,
  templateUrl: './pdfviewer.component.html',
  styleUrl: './pdfviewer.component.scss'
})
export class PdfviewerComponent {

  @Input() public modalConfig: ModalConfig
  @ViewChild('modal') private modalContent: TemplateRef<PdfviewerComponent>
  private modalRef: NgbModalRef
  
   
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void { }

  open(): Promise<boolean> {
    
    return new Promise<boolean>(resolve => {
      this.modalRef = this.modalService.open(this.modalContent,{ windowClass: 'my-custom-modal'  })
      this.modalRef.result.then(resolve, resolve)
    })
  }

  async close(): Promise<void> {
    if (this.modalConfig.shouldClose === undefined || (await this.modalConfig.shouldClose())) {
      const result = this.modalConfig.onClose === undefined || (await this.modalConfig.onClose())
      this.modalRef.close(result)
    }
  }


}
