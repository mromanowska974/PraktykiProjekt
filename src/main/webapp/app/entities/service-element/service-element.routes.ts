import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ServiceElementComponent } from './list/service-element.component';
import { ServiceElementDetailComponent } from './detail/service-element-detail.component';
import { ServiceElementUpdateComponent } from './update/service-element-update.component';
import ServiceElementResolve from './route/service-element-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const serviceElementRoute: Routes = [
  {
    path: '',
    component: ServiceElementComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ServiceElementDetailComponent,
    resolve: {
      serviceElement: ServiceElementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ServiceElementUpdateComponent,
    resolve: {
      serviceElement: ServiceElementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ServiceElementUpdateComponent,
    resolve: {
      serviceElement: ServiceElementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default serviceElementRoute;
