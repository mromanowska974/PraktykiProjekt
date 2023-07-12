import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BusinessServiceFormService } from './business-service-form.service';
import { BusinessServiceService } from '../service/business-service.service';
import { IBusinessService } from '../business-service.model';
import { IInternalService } from 'app/entities/internal-service/internal-service.model';
import { InternalServiceService } from 'app/entities/internal-service/service/internal-service.service';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';
import { IDepartment } from 'app/entities/department/department.model';
import { DepartmentService } from 'app/entities/department/service/department.service';

import { BusinessServiceAddComponent } from './business-service-add.component';

describe('BusinessService Management Update Component', () => {
  let comp: BusinessServiceAddComponent;
  let fixture: ComponentFixture<BusinessServiceAddComponent>;
  let activatedRoute: ActivatedRoute;
  let businessServiceFormService: BusinessServiceFormService;
  let businessServiceService: BusinessServiceService;
  let internalServiceService: InternalServiceService;
  let clientService: ClientService;
  let employeeService: EmployeeService;
  let departmentService: DepartmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), BusinessServiceAddComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(BusinessServiceAddComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BusinessServiceAddComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    businessServiceFormService = TestBed.inject(BusinessServiceFormService);
    businessServiceService = TestBed.inject(BusinessServiceService);
    internalServiceService = TestBed.inject(InternalServiceService);
    clientService = TestBed.inject(ClientService);
    employeeService = TestBed.inject(EmployeeService);
    departmentService = TestBed.inject(DepartmentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call InternalService query and add missing value', () => {
      const businessService: IBusinessService = { id: 456 };
      const internalServices: IInternalService[] = [{ id: 31441 }];
      businessService.internalServices = internalServices;

      const internalServiceCollection: IInternalService[] = [{ id: 12712 }];
      jest.spyOn(internalServiceService, 'query').mockReturnValue(of(new HttpResponse({ body: internalServiceCollection })));
      const additionalInternalServices = [...internalServices];
      const expectedCollection: IInternalService[] = [...additionalInternalServices, ...internalServiceCollection];
      jest.spyOn(internalServiceService, 'addInternalServiceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ businessService });
      comp.ngOnInit();

      expect(internalServiceService.query).toHaveBeenCalled();
      expect(internalServiceService.addInternalServiceToCollectionIfMissing).toHaveBeenCalledWith(
        internalServiceCollection,
        ...additionalInternalServices.map(expect.objectContaining)
      );
      expect(comp.internalServicesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Client query and add missing value', () => {
      const businessService: IBusinessService = { id: 456 };
      const client: IClient = { id: 945 };
      businessService.client = client;

      const clientCollection: IClient[] = [{ id: 39415 }];
      jest.spyOn(clientService, 'query').mockReturnValue(of(new HttpResponse({ body: clientCollection })));
      const additionalClients = [client];
      const expectedCollection: IClient[] = [...additionalClients, ...clientCollection];
      jest.spyOn(clientService, 'addClientToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ businessService });
      comp.ngOnInit();

      expect(clientService.query).toHaveBeenCalled();
      expect(clientService.addClientToCollectionIfMissing).toHaveBeenCalledWith(
        clientCollection,
        ...additionalClients.map(expect.objectContaining)
      );
      expect(comp.clientsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Employee query and add missing value', () => {
      const businessService: IBusinessService = { id: 456 };
      const employee: IEmployee = { id: 6219 };
      businessService.employee = employee;

      const employeeCollection: IEmployee[] = [{ id: 39615 }];
      jest.spyOn(employeeService, 'query').mockReturnValue(of(new HttpResponse({ body: employeeCollection })));
      const additionalEmployees = [employee];
      const expectedCollection: IEmployee[] = [...additionalEmployees, ...employeeCollection];
      jest.spyOn(employeeService, 'addEmployeeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ businessService });
      comp.ngOnInit();

      expect(employeeService.query).toHaveBeenCalled();
      expect(employeeService.addEmployeeToCollectionIfMissing).toHaveBeenCalledWith(
        employeeCollection,
        ...additionalEmployees.map(expect.objectContaining)
      );
      expect(comp.employeesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Department query and add missing value', () => {
      const businessService: IBusinessService = { id: 456 };
      const department: IDepartment = { id: 33511 };
      businessService.department = department;

      const departmentCollection: IDepartment[] = [{ id: 75616 }];
      jest.spyOn(departmentService, 'query').mockReturnValue(of(new HttpResponse({ body: departmentCollection })));
      const additionalDepartments = [department];
      const expectedCollection: IDepartment[] = [...additionalDepartments, ...departmentCollection];
      jest.spyOn(departmentService, 'addDepartmentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ businessService });
      comp.ngOnInit();

      expect(departmentService.query).toHaveBeenCalled();
      expect(departmentService.addDepartmentToCollectionIfMissing).toHaveBeenCalledWith(
        departmentCollection,
        ...additionalDepartments.map(expect.objectContaining)
      );
      expect(comp.departmentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const businessService: IBusinessService = { id: 456 };
      const internalService: IInternalService = { id: 33154 };
      businessService.internalServices = [internalService];
      const client: IClient = { id: 42710 };
      businessService.client = client;
      const employee: IEmployee = { id: 22146 };
      businessService.employee = employee;
      const department: IDepartment = { id: 67135 };
      businessService.department = department;

      activatedRoute.data = of({ businessService });
      comp.ngOnInit();

      expect(comp.internalServicesSharedCollection).toContain(internalService);
      expect(comp.clientsSharedCollection).toContain(client);
      expect(comp.employeesSharedCollection).toContain(employee);
      expect(comp.departmentsSharedCollection).toContain(department);
      expect(comp.businessService).toEqual(businessService);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBusinessService>>();
      const businessService = { id: 123 };
      jest.spyOn(businessServiceFormService, 'getBusinessService').mockReturnValue(businessService);
      jest.spyOn(businessServiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ businessService });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: businessService }));
      saveSubject.complete();

      // THEN
      expect(businessServiceFormService.getBusinessService).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(businessServiceService.update).toHaveBeenCalledWith(expect.objectContaining(businessService));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBusinessService>>();
      const businessService = { id: 123 };
      jest.spyOn(businessServiceFormService, 'getBusinessService').mockReturnValue({ id: null });
      jest.spyOn(businessServiceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ businessService: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: businessService }));
      saveSubject.complete();

      // THEN
      expect(businessServiceFormService.getBusinessService).toHaveBeenCalled();
      expect(businessServiceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBusinessService>>();
      const businessService = { id: 123 };
      jest.spyOn(businessServiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ businessService });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(businessServiceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareInternalService', () => {
      it('Should forward to internalServiceService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(internalServiceService, 'compareInternalService');
        comp.compareInternalService(entity, entity2);
        expect(internalServiceService.compareInternalService).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareClient', () => {
      it('Should forward to clientService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(clientService, 'compareClient');
        comp.compareClient(entity, entity2);
        expect(clientService.compareClient).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareEmployee', () => {
      it('Should forward to employeeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(employeeService, 'compareEmployee');
        comp.compareEmployee(entity, entity2);
        expect(employeeService.compareEmployee).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareDepartment', () => {
      it('Should forward to departmentService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(departmentService, 'compareDepartment');
        comp.compareDepartment(entity, entity2);
        expect(departmentService.compareDepartment).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
