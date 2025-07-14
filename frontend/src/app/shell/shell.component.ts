import { Component, OnInit, inject, signal, TemplateRef, WritableSignal } from '@angular/core';
import { ShellService } from '@app/shell/services/shell.service';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Router } from '@angular/router';
import { NgbOffcanvas, OffcanvasDismissReasons ,NgbDate} from '@ng-bootstrap/ng-bootstrap';

@UntilDestroy()
@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  standalone: false,
})
export class ShellComponent implements OnInit {
  isSidebarActive = false;

  constructor(
    private readonly _shellService: ShellService,
    private readonly _router: Router,
  ) {}


  	private offcanvasService = inject(NgbOffcanvas);
	closeResult: WritableSignal<string> = signal('');

	open(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' }).result.then(
			(result) => {
				this.closeResult.set(`Closed with: ${result}`);
			},
			(reason) => {
				this.closeResult.set(`Dismissed ${this.getDismissReason(reason)}`);
			},
		);
	}

  private getDismissReason(reason: any): string {
		switch (reason) {
			case OffcanvasDismissReasons.ESC:
				return 'by pressing ESC';
			case OffcanvasDismissReasons.BACKDROP_CLICK:
				return 'by clicking on the backdrop';
			default:
				return `with: ${reason}`;
		}
	}

  ngOnInit() {
    // this._socketService.connect();
  }

  sidebarToggle(toggleState: boolean) {
    this.isSidebarActive = toggleState;
  }

  private _reloadCurrentRoute(path?: string) {
    const currentUrl = path || this._router.url;
    this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this._router.navigate([currentUrl]);
    });
  }
}
