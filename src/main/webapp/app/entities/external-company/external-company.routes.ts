import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ExternalCompanyComponent } from './list/external-company.component';
import { ExternalCompanyDetailComponent } from './detail/external-company-detail.component';
import { ExternalCompanyUpdateComponent } from './update/external-company-update.component';
import ExternalCompanyResolve from './route/external-company-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const externalCompanyRoute: Routes = [
  {
    path: '',
    component: ExternalCompanyComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExternalCompanyDetailComponent,
    resolve: {
      externalCompany: ExternalCompanyResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExternalCompanyUpdateComponent,
    resolve: {
      externalCompany: ExternalCompanyResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExternalCompanyUpdateComponent,
    resolve: {
      externalCompany: ExternalCompanyResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default externalCompanyRoute;
