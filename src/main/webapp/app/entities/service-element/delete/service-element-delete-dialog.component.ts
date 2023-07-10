import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { IServiceElement } from '../service-element.model';
import { ServiceElementService } from '../service/service-element.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './service-element-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ServiceElementDeleteDialogComponent {
  serviceElement?: IServiceElement;

  constructor(protected serviceElementService: ServiceElementService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.serviceElementService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
