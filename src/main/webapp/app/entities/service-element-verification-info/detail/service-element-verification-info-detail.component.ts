import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IServiceElementVerificationInfo } from '../service-element-verification-info.model';

@Component({
  standalone: true,
  selector: 'jhi-service-element-verification-info-detail',
  templateUrl: './service-element-verification-info-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ServiceElementVerificationInfoDetailComponent {
  @Input() serviceElementVerificationInfo: IServiceElementVerificationInfo | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}
