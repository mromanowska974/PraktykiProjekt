import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { IExternalCompany } from '../external-company.model';
import { ExternalCompanyService } from '../service/external-company.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './external-company-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ExternalCompanyDeleteDialogComponent {
  externalCompany?: IExternalCompany;

  constructor(protected externalCompanyService: ExternalCompanyService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.externalCompanyService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
