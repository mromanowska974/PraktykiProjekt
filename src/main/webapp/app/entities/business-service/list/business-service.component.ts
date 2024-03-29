import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortDirective, SortByDirective } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { BusinessService, IBusinessService } from '../business-service.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, BusinessServiceService } from '../service/business-service.service';
import { BusinessServiceDeleteDialogComponent } from '../delete/business-service-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';
import { StatusOfServiceElement } from 'app/entities/enumerations/status-of-service-element.model';
import { IClient } from 'app/entities/client/client.model';

@Component({
  standalone: true,
  selector: 'jhi-business-service',
  templateUrl: './business-service.component.html',
  styleUrls: ['./business-service.component.css'],
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
  ],
})
export class BusinessServiceComponent implements OnChanges {
  businessServices?: IBusinessService[] | null;
  @Input() client: IClient | null;
  @Input() isDefaultValueSelected: boolean = true;
  @Output() selectedBusinessService = new EventEmitter<BusinessService>();

  clickedElementIndex: number;

  constructor(
    protected businessServiceService: BusinessServiceService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    //filtering business services by client
    var currentClient = changes['client'].currentValue;
    if (currentClient != null) {
      console.log(currentClient);
      this.clickedElementIndex = -1;
      this.businessServiceService.findByClient(currentClient.id).subscribe(businessServices => {
        this.businessServices = businessServices.body;
      });
    }

    //showing all business services if default value ''Wszystkie'' is selected
    if (changes['isDefaultValueSelected'].currentValue) {
      this.businessServiceService.query().subscribe(businessServices => {
        this.businessServices = businessServices.body;
      });
    }
  }

  onStatusChange(businessService: IBusinessService) {
    if (businessService.status === StatusOfServiceElement.ACTIVE) businessService.status = StatusOfServiceElement.NOT_ACTIVE;
    else businessService.status = StatusOfServiceElement.ACTIVE;

    this.businessServiceService.update(businessService).subscribe(() => console.log(businessService.status));
  }

  onEditPageLoad(id: number) {
    this.router.navigate(['/edit', id]);
  }

  onBusinessServiceSelected(businessService: BusinessService, index: number) {
    this.clickedElementIndex = index;
    this.selectedBusinessService.emit(businessService);
  }

  onDeleteBusinessService(businessService: BusinessService, index: number) {
    if (confirm('Czy na pewno chcesz usunąć wybraną Usługę Biznesową?')) {
      this.businessServiceService.delete(businessService.id).subscribe(() => {
        console.log(this.businessServices);
        this.businessServices?.splice(index, 1);
        console.log(this.businessServices);
        //window.location.reload();
      });
    }
  }
}
