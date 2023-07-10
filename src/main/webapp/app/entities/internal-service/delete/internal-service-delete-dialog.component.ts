import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { IInternalService } from '../internal-service.model';
import { InternalServiceService } from '../service/internal-service.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './internal-service-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class InternalServiceDeleteDialogComponent {
  internalService?: IInternalService;

  constructor(protected internalServiceService: InternalServiceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.internalServiceService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
