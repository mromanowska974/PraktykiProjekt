import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Location } from '@angular/common';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ServiceElementFormService, ServiceElementFormGroup } from './service-element-form.service';
import { IServiceElement, NewServiceElement } from '../service-element.model';
import { ServiceElementService } from '../service/service-element.service';
import { IBusinessService } from 'app/entities/business-service/business-service.model';
import { BusinessServiceService } from 'app/entities/business-service/service/business-service.service';
import { IInternalService } from 'app/entities/internal-service/internal-service.model';
import { InternalServiceService } from 'app/entities/internal-service/service/internal-service.service';
import { PaymentType } from 'app/entities/enumerations/payment-type.model';
import { StatusOfServiceElement } from 'app/entities/enumerations/status-of-service-element.model';
import { prototype } from 'events';

@Component({
  standalone: true,
  selector: 'jhi-service-element-update',
  templateUrl: './service-element-update.component.html',
  styleUrls: ['./service-element-update.component.css'],
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ServiceElementUpdateComponent implements OnInit {
  serviceElement: IServiceElement | null = {} as IServiceElement;

  constructor(
    protected serviceElementService: ServiceElementService,
    protected serviceElementFormService: ServiceElementFormService,
    protected businessServiceService: BusinessServiceService,
    protected internalServiceService: InternalServiceService,
    protected activatedRoute: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    if (this.serviceElement) {
      this.serviceElement.paymentType = this.activatedRoute.snapshot.queryParams['paymentType'];
      console.log(this.serviceElement.paymentType);
    }
  }

  onCancel() {
    this.location.back();
  }

  onSaveServiceElement() {
    console.log(this.serviceElement);

    this.serviceElementService.sendCreatedServiceElement(this.serviceElement!);
    this.location.back();
    // this.serviceElementService.create(this.serviceElement!).subscribe(
    //   () => {
    //     this.location.back();
    //   }
    // )
  }
}
