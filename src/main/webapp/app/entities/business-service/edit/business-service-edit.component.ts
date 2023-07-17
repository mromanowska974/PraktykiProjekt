import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBusinessService } from '../business-service.model';
import { BusinessServiceService } from '../service/business-service.service';

@Component({
  selector: 'jhi-business-service-edit',
  templateUrl: './business-service-edit.component.html',
  styleUrls: ['./business-service-edit.component.scss'],
})
export class BusinessServiceEditComponent implements OnInit {
  sectionSelected: string = 'A';

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

  constructor(private router: Router, private route: ActivatedRoute, private businessServiceService: BusinessServiceService) {}

  ngOnInit(): void {
    this.businessServiceId = +this.route.snapshot.params['id'];
    this.getBusinessService();
  }

  getBusinessService() {
    this.businessServiceService.find(this.businessServiceId).subscribe(businessService => {
      this.businessService = businessService.body;
      console.log(this.businessService);
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
    console.log('przed zmianą: ');
    console.log(this.businessService);

    if (this.businessService != undefined) {
      //this.businessService.functionalDescription = this.functionalDescription;
      // this.businessService.exclusions = this.exclusions;
      // this.businessService.dutiesAndResponsibilities = this.dutiesAndResponsibilities;
      // this.businessService.personResponsibleForService = this.personResponsibleForService;
      // this.businessService.hoursOfService = this.hoursOfService;
      // this.businessService.serviceActivatingCost = this.serviceActivatingCost;
      // this.businessService.priceListOfService = this.priceListOfService;
      // this.businessService.notes = this.notes;
    }

    console.log('po zmianie: ');
    console.log(this.businessService);
    this.businessServiceService.update(this.businessService!).subscribe();
    this.router.navigate(['/']);
  }

  onAddServiceElement() {
    this.router.navigate(['/service-element', 'new']);
  }
}
