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

  constructor(
    protected internalServiceService: InternalServiceService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal
  ) {}

  ngOnInit(): void {
    // this.internalServiceService.query().subscribe(internalServices => {
    //   this.internalServices = internalServices.body;
    // });
  }
}
