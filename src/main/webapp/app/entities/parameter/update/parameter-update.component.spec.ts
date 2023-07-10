import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ParameterFormService } from './parameter-form.service';
import { ParameterService } from '../service/parameter.service';
import { IParameter } from '../parameter.model';
import { IBusinessService } from 'app/entities/business-service/business-service.model';
import { BusinessServiceService } from 'app/entities/business-service/service/business-service.service';
import { IInternalService } from 'app/entities/internal-service/internal-service.model';
import { InternalServiceService } from 'app/entities/internal-service/service/internal-service.service';

import { ParameterUpdateComponent } from './parameter-update.component';

describe('Parameter Management Update Component', () => {
  let comp: ParameterUpdateComponent;
  let fixture: ComponentFixture<ParameterUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let parameterFormService: ParameterFormService;
  let parameterService: ParameterService;
  let businessServiceService: BusinessServiceService;
  let internalServiceService: InternalServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ParameterUpdateComponent],
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
      .overrideTemplate(ParameterUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParameterUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    parameterFormService = TestBed.inject(ParameterFormService);
    parameterService = TestBed.inject(ParameterService);
    businessServiceService = TestBed.inject(BusinessServiceService);
    internalServiceService = TestBed.inject(InternalServiceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call BusinessService query and add missing value', () => {
      const parameter: IParameter = { id: 456 };
      const businessService: IBusinessService = { id: 21962 };
      parameter.businessService = businessService;

      const businessServiceCollection: IBusinessService[] = [{ id: 80225 }];
      jest.spyOn(businessServiceService, 'query').mockReturnValue(of(new HttpResponse({ body: businessServiceCollection })));
      const additionalBusinessServices = [businessService];
      const expectedCollection: IBusinessService[] = [...additionalBusinessServices, ...businessServiceCollection];
      jest.spyOn(businessServiceService, 'addBusinessServiceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ parameter });
      comp.ngOnInit();

      expect(businessServiceService.query).toHaveBeenCalled();
      expect(businessServiceService.addBusinessServiceToCollectionIfMissing).toHaveBeenCalledWith(
        businessServiceCollection,
        ...additionalBusinessServices.map(expect.objectContaining)
      );
      expect(comp.businessServicesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call InternalService query and add missing value', () => {
      const parameter: IParameter = { id: 456 };
      const internalService: IInternalService = { id: 61478 };
      parameter.internalService = internalService;

      const internalServiceCollection: IInternalService[] = [{ id: 99181 }];
      jest.spyOn(internalServiceService, 'query').mockReturnValue(of(new HttpResponse({ body: internalServiceCollection })));
      const additionalInternalServices = [internalService];
      const expectedCollection: IInternalService[] = [...additionalInternalServices, ...internalServiceCollection];
      jest.spyOn(internalServiceService, 'addInternalServiceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ parameter });
      comp.ngOnInit();

      expect(internalServiceService.query).toHaveBeenCalled();
      expect(internalServiceService.addInternalServiceToCollectionIfMissing).toHaveBeenCalledWith(
        internalServiceCollection,
        ...additionalInternalServices.map(expect.objectContaining)
      );
      expect(comp.internalServicesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const parameter: IParameter = { id: 456 };
      const businessService: IBusinessService = { id: 45401 };
      parameter.businessService = businessService;
      const internalService: IInternalService = { id: 35209 };
      parameter.internalService = internalService;

      activatedRoute.data = of({ parameter });
      comp.ngOnInit();

      expect(comp.businessServicesSharedCollection).toContain(businessService);
      expect(comp.internalServicesSharedCollection).toContain(internalService);
      expect(comp.parameter).toEqual(parameter);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParameter>>();
      const parameter = { id: 123 };
      jest.spyOn(parameterFormService, 'getParameter').mockReturnValue(parameter);
      jest.spyOn(parameterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parameter });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parameter }));
      saveSubject.complete();

      // THEN
      expect(parameterFormService.getParameter).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(parameterService.update).toHaveBeenCalledWith(expect.objectContaining(parameter));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParameter>>();
      const parameter = { id: 123 };
      jest.spyOn(parameterFormService, 'getParameter').mockReturnValue({ id: null });
      jest.spyOn(parameterService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parameter: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parameter }));
      saveSubject.complete();

      // THEN
      expect(parameterFormService.getParameter).toHaveBeenCalled();
      expect(parameterService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParameter>>();
      const parameter = { id: 123 };
      jest.spyOn(parameterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parameter });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(parameterService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareBusinessService', () => {
      it('Should forward to businessServiceService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(businessServiceService, 'compareBusinessService');
        comp.compareBusinessService(entity, entity2);
        expect(businessServiceService.compareBusinessService).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareInternalService', () => {
      it('Should forward to internalServiceService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(internalServiceService, 'compareInternalService');
        comp.compareInternalService(entity, entity2);
        expect(internalServiceService.compareInternalService).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
