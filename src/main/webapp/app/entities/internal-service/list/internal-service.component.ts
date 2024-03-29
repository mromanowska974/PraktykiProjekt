import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortDirective, SortByDirective } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { IInternalService, InternalService } from '../internal-service.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, InternalServiceService } from '../service/internal-service.service';
import { InternalServiceDeleteDialogComponent } from '../delete/internal-service-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';
import { BusinessService } from 'app/entities/business-service/business-service.model';
import { BusinessServiceService } from 'app/entities/business-service/service/business-service.service';

@Component({
  standalone: true,
  selector: 'jhi-internal-service',
  templateUrl: './internal-service.component.html',
  styleUrls: ['./internal-service.component.css'],
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
export class InternalServiceComponent implements OnInit {
  @Input() internalServices?: InternalService[] | null;
  @Input() businessService: BusinessService = new BusinessService();

  constructor(
    protected internalServiceService: InternalServiceService,
    protected businessServiceService: BusinessServiceService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal
  ) {}

  ngOnInit(): void {}

  onEditInternalService(internalService: IInternalService) {
    this.router.navigate(['/internal-service', internalService.id, 'edit']);
  }

  onDelete(index: number) {
    console.log(this.businessService);
    console.log(index);
    if (confirm('Czy chcesz usunąć tą Usługę Wewnętrzną z wybranej Usługi Biznesowej?')) {
      this.businessService.internalServices?.splice(index, 1);
      this.businessServiceService.update(this.businessService).subscribe();
    }
  }
}
