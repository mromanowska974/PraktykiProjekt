import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ServiceElementFormService } from './service-element-form.service';
import { ServiceElementService } from '../service/service-element.service';
import { IServiceElement } from '../service-element.model';
import { IBusinessService } from 'app/entities/business-service/business-service.model';
import { BusinessServiceService } from 'app/entities/business-service/service/business-service.service';
import { IInternalService } from 'app/entities/internal-service/internal-service.model';
import { InternalServiceService } from 'app/entities/internal-service/service/internal-service.service';

import { ServiceElementUpdateComponent } from './service-element-update.component';

describe('ServiceElement Management Update Component', () => {
  let comp: ServiceElementUpdateComponent;
  let fixture: ComponentFixture<ServiceElementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let serviceElementFormService: ServiceElementFormService;
  let serviceElementService: ServiceElementService;
  let businessServiceService: BusinessServiceService;
  let internalServiceService: InternalServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ServiceElementUpdateComponent],
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
      .overrideTemplate(ServiceElementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ServiceElementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    serviceElementFormService = TestBed.inject(ServiceElementFormService);
    serviceElementService = TestBed.inject(ServiceElementService);
    businessServiceService = TestBed.inject(BusinessServiceService);
    internalServiceService = TestBed.inject(InternalServiceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call BusinessService query and add missing value', () => {
      const serviceElement: IServiceElement = { id: 456 };
      const businessService: IBusinessService = { id: 64733 };
      serviceElement.businessService = businessService;

      const businessServiceCollection: IBusinessService[] = [{ id: 22377 }];
      jest.spyOn(businessServiceService, 'query').mockReturnValue(of(new HttpResponse({ body: businessServiceCollection })));
      const additionalBusinessServices = [businessService];
      const expectedCollection: IBusinessService[] = [...additionalBusinessServices, ...businessServiceCollection];
      jest.spyOn(businessServiceService, 'addBusinessServiceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ serviceElement });
      comp.ngOnInit();

      expect(businessServiceService.query).toHaveBeenCalled();
      expect(businessServiceService.addBusinessServiceToCollectionIfMissing).toHaveBeenCalledWith(
        businessServiceCollection,
        ...additionalBusinessServices.map(expect.objectContaining)
      );
      expect(comp.businessServicesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call InternalService query and add missing value', () => {
      const serviceElement: IServiceElement = { id: 456 };
      const internalService: IInternalService = { id: 52481 };
      serviceElement.internalService = internalService;

      const internalServiceCollection: IInternalService[] = [{ id: 72817 }];
      jest.spyOn(internalServiceService, 'query').mockReturnValue(of(new HttpResponse({ body: internalServiceCollection })));
      const additionalInternalServices = [internalService];
      const expectedCollection: IInternalService[] = [...additionalInternalServices, ...internalServiceCollection];
      jest.spyOn(internalServiceService, 'addInternalServiceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ serviceElement });
      comp.ngOnInit();

      expect(internalServiceService.query).toHaveBeenCalled();
      expect(internalServiceService.addInternalServiceToCollectionIfMissing).toHaveBeenCalledWith(
        internalServiceCollection,
        ...additionalInternalServices.map(expect.objectContaining)
      );
      expect(comp.internalServicesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const serviceElement: IServiceElement = { id: 456 };
      const businessService: IBusinessService = { id: 48278 };
      serviceElement.businessService = businessService;
      const internalService: IInternalService = { id: 60348 };
      serviceElement.internalService = internalService;

      activatedRoute.data = of({ serviceElement });
      comp.ngOnInit();

      expect(comp.businessServicesSharedCollection).toContain(businessService);
      expect(comp.internalServicesSharedCollection).toContain(internalService);
      expect(comp.serviceElement).toEqual(serviceElement);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IServiceElement>>();
      const serviceElement = { id: 123 };
      jest.spyOn(serviceElementFormService, 'getServiceElement').mockReturnValue(serviceElement);
      jest.spyOn(serviceElementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serviceElement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: serviceElement }));
      saveSubject.complete();

      // THEN
      expect(serviceElementFormService.getServiceElement).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(serviceElementService.update).toHaveBeenCalledWith(expect.objectContaining(serviceElement));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IServiceElement>>();
      const serviceElement = { id: 123 };
      jest.spyOn(serviceElementFormService, 'getServiceElement').mockReturnValue({ id: null });
      jest.spyOn(serviceElementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serviceElement: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: serviceElement }));
      saveSubject.complete();

      // THEN
      expect(serviceElementFormService.getServiceElement).toHaveBeenCalled();
      expect(serviceElementService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IServiceElement>>();
      const serviceElement = { id: 123 };
      jest.spyOn(serviceElementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serviceElement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(serviceElementService.update).toHaveBeenCalled();
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
