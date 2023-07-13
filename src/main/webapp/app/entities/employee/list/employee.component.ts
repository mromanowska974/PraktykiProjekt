import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortDirective, SortByDirective } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { IEmployee } from '../employee.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, EmployeeService } from '../service/employee.service';
import { EmployeeDeleteDialogComponent } from '../delete/employee-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';

@Component({
  standalone: true,
  selector: 'jhi-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
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
export class EmployeeComponent implements OnInit {
  employees?: IEmployee[] | null;
  // isLoading = false;

  // predicate = 'id';
  // ascending = true;

  constructor(
    protected employeeService: EmployeeService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal
  ) {}

  // trackId = (_index: number, item: IEmployee): number => this.employeeService.getEmployeeIdentifier(item);

  ngOnInit(): void {
    this.employeeService.query().subscribe(employees => {
      this.employees = employees.body;
    });
  }

  onEmployeeClicked(employeeName?: string | null, employeeSurname?: string | null) {
    this.employeeService.employeeSelected.emit({
      name: employeeName,
      surname: employeeSurname,
    });
    this.employeeService.isEmployeeSelected = true;
  }

  // delete(employee: IEmployee): void {
  //   const modalRef = this.modalService.open(EmployeeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
  //   modalRef.componentInstance.employee = employee;
  //   // unsubscribe not needed because closed completes on modal close
  //   modalRef.closed
  //     .pipe(
  //       filter(reason => reason === ITEM_DELETED_EVENT),
  //       switchMap(() => this.loadFromBackendWithRouteInformations())
  //     )
  //     .subscribe({
  //       next: (res: EntityArrayResponseType) => {
  //         this.onResponseSuccess(res);
  //       },
  //     });
  // }

  // load(): void {
  //   this.loadFromBackendWithRouteInformations().subscribe({
  //     next: (res: EntityArrayResponseType) => {
  //       this.onResponseSuccess(res);
  //     },
  //   });
  // }

  // navigateToWithComponentValues(): void {
  //   this.handleNavigation(this.predicate, this.ascending);
  // }

  // protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
  //   return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
  //     tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
  //     switchMap(() => this.queryBackend(this.predicate, this.ascending))
  //   );
  // }

  // protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
  //   const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
  //   this.predicate = sort[0];
  //   this.ascending = sort[1] === ASC;
  // }

  // protected onResponseSuccess(response: EntityArrayResponseType): void {
  //   const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
  //   this.employees = this.refineData(dataFromBody);
  // }

  // protected refineData(data: IEmployee[]): IEmployee[] {
  //   return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  // }

  // protected fillComponentAttributesFromResponseBody(data: IEmployee[] | null): IEmployee[] {
  //   return data ?? [];
  // }

  // protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
  //   this.isLoading = true;
  //   const queryObject: any = {
  //     sort: this.getSortQueryParam(predicate, ascending),
  //   };
  //   return this.employeeService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  // }

  // protected handleNavigation(predicate?: string, ascending?: boolean): void {
  //   const queryParamsObj = {
  //     sort: this.getSortQueryParam(predicate, ascending),
  //   };

  //   this.router.navigate(['./'], {
  //     relativeTo: this.activatedRoute,
  //     queryParams: queryParamsObj,
  //   });
  // }

  // protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
  //   const ascendingQueryParam = ascending ? ASC : DESC;
  //   if (predicate === '') {
  //     return [];
  //   } else {
  //     return [predicate + ',' + ascendingQueryParam];
  //   }
  // }
}
