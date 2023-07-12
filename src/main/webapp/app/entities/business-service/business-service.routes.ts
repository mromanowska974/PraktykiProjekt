import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BusinessServiceComponent } from './list/business-service.component';
import { BusinessServiceDetailComponent } from './detail/business-service-detail.component';
import { BusinessServiceAddComponent } from './add/business-service-add.component';
import BusinessServiceResolve from './route/business-service-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const businessServiceRoute: Routes = [
  {
    path: '',
    component: BusinessServiceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BusinessServiceDetailComponent,
    resolve: {
      businessService: BusinessServiceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BusinessServiceAddComponent,
    resolve: {
      businessService: BusinessServiceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BusinessServiceAddComponent,
    resolve: {
      businessService: BusinessServiceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default businessServiceRoute;
