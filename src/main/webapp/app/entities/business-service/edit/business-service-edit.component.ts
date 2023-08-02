import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessService, IBusinessService } from '../business-service.model';
import { BusinessServiceService } from '../service/business-service.service';
import { IServiceElement } from 'app/entities/service-element/service-element.model';
import { PaymentType } from 'app/entities/enumerations/payment-type.model';
import { ServiceElementService } from 'app/entities/service-element/service/service-element.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'jhi-business-service-edit',
  templateUrl: './business-service-edit.component.html',
  styleUrls: ['./business-service-edit.component.scss'],
})
export class BusinessServiceEditComponent implements OnInit, OnDestroy {
  sectionSelected: string = 'C';

  businessServiceId: number;
  businessService: BusinessService | null = new BusinessService();
  isDataLoaded: boolean = false;

  functionalDescription: string;
  exclusions: string;
  dutiesAndResponsibilities: string;
  personResponsibleForService: string;
  hoursOfService: string;
  serviceActivatingCost: string;
  priceListOfService: string;
  notes: string;

  serviceElementsOfMonthlyPaymentType: IServiceElement[] | null = [];
  serviceElementsOfOneTimePaymentType: IServiceElement[] | null = [];

  paymentType: typeof PaymentType = PaymentType;

  serviceElementSub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private businessServiceService: BusinessServiceService,
    private serviceElementService: ServiceElementService
  ) {}

  ngOnInit(): void {
    this.businessServiceId = +this.route.snapshot.params['id'];

    // setting business service
    if (this.businessServiceService.isBusinessServiceSaved) {
      console.log(this.businessServiceService.businessService);
      this.businessService = this.businessServiceService.businessService;
      this.serviceElementsOfMonthlyPaymentType = this.businessServiceService.serviceElementsOfMonthlyPaymentType;
      this.serviceElementsOfOneTimePaymentType = this.businessServiceService.serviceElementsOfOneTimePaymentType;
      console.log(this.businessService);

      this.businessServiceService.isBusinessServiceSaved = false;
      this.isDataLoaded = true;
    } else {
      this.getBusinessService();
      this.serviceElementService.findByBusinessServiceAndPaymentType(this.businessServiceId, PaymentType.MONTHLY).subscribe(resp => {
        this.serviceElementsOfMonthlyPaymentType = resp.body;
        console.log(this.serviceElementsOfMonthlyPaymentType);
      });

      this.serviceElementService.findByBusinessServiceAndPaymentType(this.businessServiceId, PaymentType.DISPOSABLE).subscribe(resp => {
        this.serviceElementsOfOneTimePaymentType = resp.body;
        console.log(this.serviceElementsOfOneTimePaymentType);
      });
    }

    //receiving new service element
    this.serviceElementSub = this.serviceElementService.toReceive.subscribe(resp => {
      resp.businessService = this.businessService;
      //console.log(resp);
      if (resp.paymentType === PaymentType.MONTHLY) {
        this.serviceElementsOfMonthlyPaymentType!.push(resp);
      } else if (resp.paymentType === PaymentType.DISPOSABLE) {
        this.serviceElementsOfOneTimePaymentType!.push(resp);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.serviceElementSub) {
      this.serviceElementSub.unsubscribe();
    }
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
    this.serviceElementsOfMonthlyPaymentType!.forEach(serviceElement => {
      this.serviceElementService.create(serviceElement).subscribe(() => console.log(serviceElement));
    });

    this.serviceElementsOfOneTimePaymentType!.forEach(serviceElement => {
      this.serviceElementService.create(serviceElement).subscribe(() => console.log(serviceElement));
    });

    this.businessServiceService.update(this.businessService!).subscribe();
    console.log(this.businessService);
    this.router.navigate(['/']);
  }

  onAddServiceElement(paymentType: PaymentType) {
    this.businessServiceService.businessService = this.businessService;
    this.businessServiceService.serviceElementsOfMonthlyPaymentType = this.serviceElementsOfMonthlyPaymentType;
    this.businessServiceService.serviceElementsOfOneTimePaymentType = this.serviceElementsOfOneTimePaymentType;

    this.businessServiceService.isBusinessServiceSaved = true;
    this.router.navigate(['/service-element', 'new'], {
      queryParams: { paymentType: paymentType },
    });
  }
}
