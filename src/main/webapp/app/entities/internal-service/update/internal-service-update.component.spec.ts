import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { InternalServiceFormService } from './internal-service-form.service';
import { InternalServiceService } from '../service/internal-service.service';
import { IInternalService } from '../internal-service.model';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';

import { InternalServiceUpdateComponent } from './internal-service-update.component';

describe('InternalService Management Update Component', () => {
  let comp: InternalServiceUpdateComponent;
  let fixture: ComponentFixture<InternalServiceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let internalServiceFormService: InternalServiceFormService;
  let internalServiceService: InternalServiceService;
  let employeeService: EmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), InternalServiceUpdateComponent],
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
      .overrideTemplate(InternalServiceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InternalServiceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    internalServiceFormService = TestBed.inject(InternalServiceFormService);
    internalServiceService = TestBed.inject(InternalServiceService);
    employeeService = TestBed.inject(EmployeeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Employee query and add missing value', () => {
      const internalService: IInternalService = { id: 456 };
      const employee: IEmployee = { id: 8163 };
      internalService.employee = employee;

      const employeeCollection: IEmployee[] = [{ id: 52146 }];
      jest.spyOn(employeeService, 'query').mockReturnValue(of(new HttpResponse({ body: employeeCollection })));
      const additionalEmployees = [employee];
      const expectedCollection: IEmployee[] = [...additionalEmployees, ...employeeCollection];
      jest.spyOn(employeeService, 'addEmployeeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ internalService });
      comp.ngOnInit();

      expect(employeeService.query).toHaveBeenCalled();
      expect(employeeService.addEmployeeToCollectionIfMissing).toHaveBeenCalledWith(
        employeeCollection,
        ...additionalEmployees.map(expect.objectContaining)
      );
      expect(comp.employeesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const internalService: IInternalService = { id: 456 };
      const employee: IEmployee = { id: 88449 };
      internalService.employee = employee;

      activatedRoute.data = of({ internalService });
      comp.ngOnInit();

      expect(comp.employeesSharedCollection).toContain(employee);
      expect(comp.internalService).toEqual(internalService);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInternalService>>();
      const internalService = { id: 123 };
      jest.spyOn(internalServiceFormService, 'getInternalService').mockReturnValue(internalService);
      jest.spyOn(internalServiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ internalService });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: internalService }));
      saveSubject.complete();

      // THEN
      expect(internalServiceFormService.getInternalService).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(internalServiceService.update).toHaveBeenCalledWith(expect.objectContaining(internalService));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInternalService>>();
      const internalService = { id: 123 };
      jest.spyOn(internalServiceFormService, 'getInternalService').mockReturnValue({ id: null });
      jest.spyOn(internalServiceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ internalService: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: internalService }));
      saveSubject.complete();

      // THEN
      expect(internalServiceFormService.getInternalService).toHaveBeenCalled();
      expect(internalServiceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInternalService>>();
      const internalService = { id: 123 };
      jest.spyOn(internalServiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ internalService });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(internalServiceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareEmployee', () => {
      it('Should forward to employeeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(employeeService, 'compareEmployee');
        comp.compareEmployee(entity, entity2);
        expect(employeeService.compareEmployee).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
