import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { IServiceElementVerificationInfo } from '../service-element-verification-info.model';
import { ServiceElementVerificationInfoService } from '../service/service-element-verification-info.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './service-element-verification-info-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ServiceElementVerificationInfoDeleteDialogComponent {
  serviceElementVerificationInfo?: IServiceElementVerificationInfo;

  constructor(
    protected serviceElementVerificationInfoService: ServiceElementVerificationInfoService,
    protected activeModal: NgbActiveModal
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.serviceElementVerificationInfoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
