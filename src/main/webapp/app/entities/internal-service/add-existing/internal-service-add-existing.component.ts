import { Component, Inject, OnInit } from '@angular/core';
import { InternalServiceService } from '../service/internal-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IInternalService, InternalService } from '../internal-service.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<InternalServiceAddExistingComponent>
  ) {}

  ngOnInit(): void {
    console.log(this.data.clickedButtonFrom);
    this.internalServiceService.query().subscribe(internalServices => {
      this.internalServices = internalServices.body;
    });
  }

  onInternalServiceClicked(internalService: IInternalService) {
    // if clicked from Add New BS page
    if (this.data.clickedButtonFrom === ClickedButtonFrom.ADD_NEW_BS_PAGE) {
      this.internalServiceService.internalServiceSelected.emit(internalService);
      this.internalServiceService.isInternalServiceSelected = true;
      console.log('dodaje do nowego ub');
    }
    // if clicked from Home page
    else {
      console.log('dodaje do istniejacego ub');
      this.businessService = this.data.businessService;

      let foundElement: InternalService | undefined;
      this.businessService!.internalServices!.forEach(element => {
        const found = this.businessService!.internalServices!.find(obj => {
          console.log(obj);
          console.log(internalService);
          console.log(obj.id === internalService.id);
          return obj.id === internalService.id;
        });

        //console.log(found)
        if (found) {
          foundElement = found;
          //console.log(foundElement)
        }
      });

      if (foundElement === undefined) {
        console.log('wchodzi do ifa');
        this.businessService?.internalServices?.push(internalService);
      }

      this.businessServiceService.update(this.businessService!).subscribe(() => this.dialogRef.close());
    }
  }
}
