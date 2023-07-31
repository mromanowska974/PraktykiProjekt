import { Component, Inject, OnInit } from '@angular/core';
import { InternalServiceService } from '../service/internal-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IInternalService } from '../internal-service.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClickedButtonFrom } from 'app/entities/enumerations/clicked-button-from.model';
import { BusinessService } from 'app/entities/business-service/business-service.model';
import { BusinessServiceService } from 'app/entities/business-service/service/business-service.service';

@Component({
  selector: 'jhi-internal-service-add-existing',
  templateUrl: './internal-service-add-existing.component.html',
  styleUrls: ['./internal-service-add-existing.component.scss'],
})
export class InternalServiceAddExistingComponent implements OnInit {
  internalServices: IInternalService[] | null;
  businessService: BusinessService | null;

  constructor(
    protected internalServiceService: InternalServiceService,
    protected businessServiceService: BusinessServiceService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    console.log(this.data.clickedButtonFrom);
    this.internalServiceService.query().subscribe(internalServices => {
      this.internalServices = internalServices.body;
    });
  }

  onInternalServiceClicked(internalService: IInternalService) {
    if (this.data.clickedButtonFrom === ClickedButtonFrom.ADD_NEW_BS_PAGE) {
      this.internalServiceService.internalServiceSelected.emit(internalService);
      this.internalServiceService.isInternalServiceSelected = true;
      console.log('dodaje do nowego ub');
    } else {
      console.log('dodaje do istniejacego ub');
      this.businessService = this.data.businessService;
      this.businessService?.internalServices?.push(internalService);
      this.businessServiceService.update(this.businessService!).subscribe();
    }
  }
}
