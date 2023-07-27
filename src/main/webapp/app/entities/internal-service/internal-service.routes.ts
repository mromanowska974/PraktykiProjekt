import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { InternalServiceComponent } from './list/internal-service.component';
import { InternalServiceDetailComponent } from './detail/internal-service-detail.component';
import { InternalServiceUpdateComponent } from './update/internal-service-update.component';
import InternalServiceResolve from './route/internal-service-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';
import { InternalServiceAddNewComponent } from './add-new/internal-service-add-new.component';

const internalServiceRoute: Routes = [
  {
    path: '',
    component: InternalServiceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InternalServiceDetailComponent,
    resolve: {
      internalService: InternalServiceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InternalServiceUpdateComponent,
    resolve: {
      internalService: InternalServiceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InternalServiceUpdateComponent,
    resolve: {
      internalService: InternalServiceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  // {
  //   path: 'add',
  //   component: InternalServiceAddNewComponent,
  //   resolve: {
  //     internalService: InternalServiceResolve,
  //   },
  //   canActivate: [UserRouteAccessService],
  // },
  {
    path: 'add/:id',
    component: InternalServiceAddNewComponent,
    // resolve: {
    //   internalService: InternalServiceResolve,
    // },
    canActivate: [UserRouteAccessService],
  },
];

export default internalServiceRoute;
