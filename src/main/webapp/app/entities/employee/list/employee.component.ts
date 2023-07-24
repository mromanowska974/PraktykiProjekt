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

  constructor(protected employeeService: EmployeeService, protected activatedRoute: ActivatedRoute, public router: Router) {}

  ngOnInit(): void {
    this.employeeService.query().subscribe(employees => {
      this.employees = employees.body;
    });
  }

  onEmployeeClicked(employee?: IEmployee) {
    this.employeeService.employeeSelected.emit(employee);
    this.employeeService.isEmployeeSelected = true;
  }
}
