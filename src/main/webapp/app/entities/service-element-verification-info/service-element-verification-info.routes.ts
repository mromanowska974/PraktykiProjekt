import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ServiceElementVerificationInfoComponent } from './list/service-element-verification-info.component';
import { ServiceElementVerificationInfoDetailComponent } from './detail/service-element-verification-info-detail.component';
import { ServiceElementVerificationInfoUpdateComponent } from './update/service-element-verification-info-update.component';
import ServiceElementVerificationInfoResolve from './route/service-element-verification-info-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const serviceElementVerificationInfoRoute: Routes = [
  {
    path: '',
    component: ServiceElementVerificationInfoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ServiceElementVerificationInfoDetailComponent,
    resolve: {
      serviceElementVerificationInfo: ServiceElementVerificationInfoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ServiceElementVerificationInfoUpdateComponent,
    resolve: {
      serviceElementVerificationInfo: ServiceElementVerificationInfoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ServiceElementVerificationInfoUpdateComponent,
    resolve: {
      serviceElementVerificationInfo: ServiceElementVerificationInfoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default serviceElementVerificationInfoRoute;
