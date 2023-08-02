import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBusinessService } from '../business-service.model';
import { BusinessServiceService } from '../service/business-service.service';
import { IServiceElement } from 'app/entities/service-element/service-element.model';
import { PaymentType } from 'app/entities/enumerations/payment-type.model';
import { ServiceElementService } from 'app/entities/service-element/service/service-element.service';

@Component({
  selector: 'jhi-business-service-edit',
  templateUrl: './business-service-edit.component.html',
  styleUrls: ['./business-service-edit.component.scss'],
})
export class BusinessServiceEditComponent implements OnInit {
  sectionSelected: string = 'C';

  businessServiceId: number;
  businessService: IBusinessService | null;
  isDataLoaded: boolean = false;

  functionalDescription: string;
  exclusions: string;
  dutiesAndResponsibilities: string;
  personResponsibleForService: string;
  hoursOfService: string;
  serviceActivatingCost: string;
  priceListOfService: string;
  notes: string;

  serviceElementsOfMonthlyPaymentType: IServiceElement[] = [];
  serviceElementsOfOneTimePaymentType: IServiceElement[] = [];

  paymentType: typeof PaymentType = PaymentType;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private businessServiceService: BusinessServiceService,
    private serviceElementService: ServiceElementService
  ) {}

  ngOnInit(): void {
    this.businessServiceId = +this.route.snapshot.params['id'];
    this.getBusinessService();

    this.serviceElementService.toReceive.subscribe(resp => {
      console.log(resp);
      if (resp.paymentType === PaymentType.MONTHLY) {
        this.serviceElementsOfMonthlyPaymentType.push(resp);
      } else {
        this.serviceElementsOfOneTimePaymentType.push(resp);
      }
    });
  }

  getBusinessService() {
    this.businessServiceService.find(this.businessServiceId).subscribe(businessService => {
      this.businessService = businessService.body;
      this.isDataLoaded = true;
    });
  }

  onSelectSection(section: string) {
    this.sectionSelected = section;
  }

  onCancel() {
    this.router.navigate(['/']);
  }

  onEditBusinessService() {
    this.businessServiceService.update(this.businessService!).subscribe();
    this.router.navigate(['/']);
  }

  onAddServiceElement(paymentType: PaymentType) {
    this.router.navigate(['/service-element', 'new'], {
      queryParams: { paymentType: paymentType },
    });
  }
}
