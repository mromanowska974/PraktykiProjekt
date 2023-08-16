import { Routes } from '@angular/router';
import { CumulativeEditPageComponent } from './cumulative-edit-page.component';
import { ClientDetailComponent } from '../client/detail/client-detail.component';
import { DepartmentDetailComponent } from '../department/detail/department-detail.component';
import { EmployeeDetailComponent } from '../employee/detail/employee-detail.component';

const cumulativeEditPageRoute: Routes = [
  {
    path: '',
    component: CumulativeEditPageComponent,
    children: [
      {
        path: 'clients',
        component: ClientDetailComponent,
      },
      {
        path: 'departments',
        component: DepartmentDetailComponent,
      },
      {
        path: 'employees',
        component: EmployeeDetailComponent,
      },
    ],
    //   data: {
    //     defaultSort: 'id,' + ASC,
    //   },
    //   canActivate: [UserRouteAccessService],
  },
];

export default cumulativeEditPageRoute;
