import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ExternalCompanyFormService } from './external-company-form.service';
import { ExternalCompanyService } from '../service/external-company.service';
import { IExternalCompany } from '../external-company.model';
import { IInternalService } from 'app/entities/internal-service/internal-service.model';
import { InternalServiceService } from 'app/entities/internal-service/service/internal-service.service';

import { ExternalCompanyUpdateComponent } from './external-company-update.component';

describe('ExternalCompany Management Update Component', () => {
  let comp: ExternalCompanyUpdateComponent;
  let fixture: ComponentFixture<ExternalCompanyUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let externalCompanyFormService: ExternalCompanyFormService;
  let externalCompanyService: ExternalCompanyService;
  let internalServiceService: InternalServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ExternalCompanyUpdateComponent],
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
      .overrideTemplate(ExternalCompanyUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExternalCompanyUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    externalCompanyFormService = TestBed.inject(ExternalCompanyFormService);
    externalCompanyService = TestBed.inject(ExternalCompanyService);
    internalServiceService = TestBed.inject(InternalServiceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call InternalService query and add missing value', () => {
      const externalCompany: IExternalCompany = { id: 456 };
      const internalService: IInternalService = { id: 52099 };
      externalCompany.internalService = internalService;

      const internalServiceCollection: IInternalService[] = [{ id: 75569 }];
      jest.spyOn(internalServiceService, 'query').mockReturnValue(of(new HttpResponse({ body: internalServiceCollection })));
      const additionalInternalServices = [internalService];
      const expectedCollection: IInternalService[] = [...additionalInternalServices, ...internalServiceCollection];
      jest.spyOn(internalServiceService, 'addInternalServiceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ externalCompany });
      comp.ngOnInit();

      expect(internalServiceService.query).toHaveBeenCalled();
      expect(internalServiceService.addInternalServiceToCollectionIfMissing).toHaveBeenCalledWith(
        internalServiceCollection,
        ...additionalInternalServices.map(expect.objectContaining)
      );
      expect(comp.internalServicesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const externalCompany: IExternalCompany = { id: 456 };
      const internalService: IInternalService = { id: 9763 };
      externalCompany.internalService = internalService;

      activatedRoute.data = of({ externalCompany });
      comp.ngOnInit();

      expect(comp.internalServicesSharedCollection).toContain(internalService);
      expect(comp.externalCompany).toEqual(externalCompany);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExternalCompany>>();
      const externalCompany = { id: 123 };
      jest.spyOn(externalCompanyFormService, 'getExternalCompany').mockReturnValue(externalCompany);
      jest.spyOn(externalCompanyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ externalCompany });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: externalCompany }));
      saveSubject.complete();

      // THEN
      expect(externalCompanyFormService.getExternalCompany).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(externalCompanyService.update).toHaveBeenCalledWith(expect.objectContaining(externalCompany));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExternalCompany>>();
      const externalCompany = { id: 123 };
      jest.spyOn(externalCompanyFormService, 'getExternalCompany').mockReturnValue({ id: null });
      jest.spyOn(externalCompanyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ externalCompany: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: externalCompany }));
      saveSubject.complete();

      // THEN
      expect(externalCompanyFormService.getExternalCompany).toHaveBeenCalled();
      expect(externalCompanyService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExternalCompany>>();
      const externalCompany = { id: 123 };
      jest.spyOn(externalCompanyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ externalCompany });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(externalCompanyService.update).toHaveBeenCalled();
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
  });
});
