import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ServiceElementVerificationInfoFormService } from './service-element-verification-info-form.service';
import { ServiceElementVerificationInfoService } from '../service/service-element-verification-info.service';
import { IServiceElementVerificationInfo } from '../service-element-verification-info.model';
import { IDepartment } from 'app/entities/department/department.model';
import { DepartmentService } from 'app/entities/department/service/department.service';
import { IServiceElement } from 'app/entities/service-element/service-element.model';
import { ServiceElementService } from 'app/entities/service-element/service/service-element.service';

import { ServiceElementVerificationInfoUpdateComponent } from './service-element-verification-info-update.component';

describe('ServiceElementVerificationInfo Management Update Component', () => {
  let comp: ServiceElementVerificationInfoUpdateComponent;
  let fixture: ComponentFixture<ServiceElementVerificationInfoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let serviceElementVerificationInfoFormService: ServiceElementVerificationInfoFormService;
  let serviceElementVerificationInfoService: ServiceElementVerificationInfoService;
  let departmentService: DepartmentService;
  let serviceElementService: ServiceElementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ServiceElementVerificationInfoUpdateComponent],
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
      .overrideTemplate(ServiceElementVerificationInfoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ServiceElementVerificationInfoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    serviceElementVerificationInfoFormService = TestBed.inject(ServiceElementVerificationInfoFormService);
    serviceElementVerificationInfoService = TestBed.inject(ServiceElementVerificationInfoService);
    departmentService = TestBed.inject(DepartmentService);
    serviceElementService = TestBed.inject(ServiceElementService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call department query and add missing value', () => {
      const serviceElementVerificationInfo: IServiceElementVerificationInfo = { id: 456 };
      const department: IDepartment = { id: 49982 };
      serviceElementVerificationInfo.department = department;

      const departmentCollection: IDepartment[] = [{ id: 78115 }];
      jest.spyOn(departmentService, 'query').mockReturnValue(of(new HttpResponse({ body: departmentCollection })));
      const expectedCollection: IDepartment[] = [department, ...departmentCollection];
      jest.spyOn(departmentService, 'addDepartmentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ serviceElementVerificationInfo });
      comp.ngOnInit();

      expect(departmentService.query).toHaveBeenCalled();
      expect(departmentService.addDepartmentToCollectionIfMissing).toHaveBeenCalledWith(departmentCollection, department);
      expect(comp.departmentsCollection).toEqual(expectedCollection);
    });

    it('Should call ServiceElement query and add missing value', () => {
      const serviceElementVerificationInfo: IServiceElementVerificationInfo = { id: 456 };
      const serviceElement: IServiceElement = { id: 45316 };
      serviceElementVerificationInfo.serviceElement = serviceElement;

      const serviceElementCollection: IServiceElement[] = [{ id: 23206 }];
      jest.spyOn(serviceElementService, 'query').mockReturnValue(of(new HttpResponse({ body: serviceElementCollection })));
      const additionalServiceElements = [serviceElement];
      const expectedCollection: IServiceElement[] = [...additionalServiceElements, ...serviceElementCollection];
      jest.spyOn(serviceElementService, 'addServiceElementToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ serviceElementVerificationInfo });
      comp.ngOnInit();

      expect(serviceElementService.query).toHaveBeenCalled();
      expect(serviceElementService.addServiceElementToCollectionIfMissing).toHaveBeenCalledWith(
        serviceElementCollection,
        ...additionalServiceElements.map(expect.objectContaining)
      );
      expect(comp.serviceElementsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const serviceElementVerificationInfo: IServiceElementVerificationInfo = { id: 456 };
      const department: IDepartment = { id: 97897 };
      serviceElementVerificationInfo.department = department;
      const serviceElement: IServiceElement = { id: 82365 };
      serviceElementVerificationInfo.serviceElement = serviceElement;

      activatedRoute.data = of({ serviceElementVerificationInfo });
      comp.ngOnInit();

      expect(comp.departmentsCollection).toContain(department);
      expect(comp.serviceElementsSharedCollection).toContain(serviceElement);
      expect(comp.serviceElementVerificationInfo).toEqual(serviceElementVerificationInfo);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IServiceElementVerificationInfo>>();
      const serviceElementVerificationInfo = { id: 123 };
      jest
        .spyOn(serviceElementVerificationInfoFormService, 'getServiceElementVerificationInfo')
        .mockReturnValue(serviceElementVerificationInfo);
      jest.spyOn(serviceElementVerificationInfoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serviceElementVerificationInfo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: serviceElementVerificationInfo }));
      saveSubject.complete();

      // THEN
      expect(serviceElementVerificationInfoFormService.getServiceElementVerificationInfo).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(serviceElementVerificationInfoService.update).toHaveBeenCalledWith(expect.objectContaining(serviceElementVerificationInfo));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IServiceElementVerificationInfo>>();
      const serviceElementVerificationInfo = { id: 123 };
      jest.spyOn(serviceElementVerificationInfoFormService, 'getServiceElementVerificationInfo').mockReturnValue({ id: null });
      jest.spyOn(serviceElementVerificationInfoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serviceElementVerificationInfo: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: serviceElementVerificationInfo }));
      saveSubject.complete();

      // THEN
      expect(serviceElementVerificationInfoFormService.getServiceElementVerificationInfo).toHaveBeenCalled();
      expect(serviceElementVerificationInfoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IServiceElementVerificationInfo>>();
      const serviceElementVerificationInfo = { id: 123 };
      jest.spyOn(serviceElementVerificationInfoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serviceElementVerificationInfo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(serviceElementVerificationInfoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareDepartment', () => {
      it('Should forward to departmentService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(departmentService, 'compareDepartment');
        comp.compareDepartment(entity, entity2);
        expect(departmentService.compareDepartment).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareServiceElement', () => {
      it('Should forward to serviceElementService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(serviceElementService, 'compareServiceElement');
        comp.compareServiceElement(entity, entity2);
        expect(serviceElementService.compareServiceElement).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
