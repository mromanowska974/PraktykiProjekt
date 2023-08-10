import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'business-service',
        data: { pageTitle: 'zarzadzanieUslugamiBiznesowymiIWewnetrznymiApp.businessService.home.title' },
        loadChildren: () => import('./business-service/business-service.routes'),
      },
      {
        path: 'client',
        data: { pageTitle: 'zarzadzanieUslugamiBiznesowymiIWewnetrznymiApp.client.home.title' },
        loadChildren: () => import('./client/client.routes'),
      },
      {
        path: 'department',
        data: { pageTitle: 'zarzadzanieUslugamiBiznesowymiIWewnetrznymiApp.department.home.title' },
        loadChildren: () => import('./department/department.routes'),
      },
      {
        path: 'employee',
        data: { pageTitle: 'zarzadzanieUslugamiBiznesowymiIWewnetrznymiApp.employee.home.title' },
        loadChildren: () => import('./employee/employee.routes'),
      },
      {
        path: 'external-company',
        data: { pageTitle: 'zarzadzanieUslugamiBiznesowymiIWewnetrznymiApp.externalCompany.home.title' },
        loadChildren: () => import('./external-company/external-company.routes'),
      },
      {
        path: 'internal-service',
        data: { pageTitle: 'zarzadzanieUslugamiBiznesowymiIWewnetrznymiApp.internalService.home.title' },
        loadChildren: () => import('./internal-service/internal-service.routes'),
      },
      {
        path: 'parameter',
        data: { pageTitle: 'zarzadzanieUslugamiBiznesowymiIWewnetrznymiApp.parameter.home.title' },
        loadChildren: () => import('./parameter/parameter.routes'),
      },
      {
        path: 'service-element',
        data: { pageTitle: 'zarzadzanieUslugamiBiznesowymiIWewnetrznymiApp.serviceElement.home.title' },
        loadChildren: () => import('./service-element/service-element.routes'),
      },
      {
        path: 'product',
        data: { pageTitle: 'zarzadzanieUslugamiBiznesowymiIWewnetrznymiApp.serviceElement.home.title' },
        loadChildren: () => import('./product/product.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
