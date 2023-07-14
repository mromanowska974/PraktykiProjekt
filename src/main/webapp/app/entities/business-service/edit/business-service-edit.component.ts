import { Component, OnInit } from '@angular/core';
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
}
