import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProductFormService } from './product-form.service';
import { ProductService } from '../service/product.service';
import { IProduct } from '../product.model';
import { IInternalService } from 'app/entities/internal-service/internal-service.model';
import { InternalServiceService } from 'app/entities/internal-service/service/internal-service.service';

import { ProductUpdateComponent } from './product-update.component';

describe('Product Management Update Component', () => {
  let comp: ProductUpdateComponent;
  let fixture: ComponentFixture<ProductUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let productFormService: ProductFormService;
  let productService: ProductService;
  let internalServiceService: InternalServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ProductUpdateComponent],
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
      .overrideTemplate(ProductUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    productFormService = TestBed.inject(ProductFormService);
    productService = TestBed.inject(ProductService);
    internalServiceService = TestBed.inject(InternalServiceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call InternalService query and add missing value', () => {
      const product: IProduct = { id: 456 };
      const internalService: IInternalService = { id: 55016 };
      product.internalService = internalService;

      const internalServiceCollection: IInternalService[] = [{ id: 75434 }];
      jest.spyOn(internalServiceService, 'query').mockReturnValue(of(new HttpResponse({ body: internalServiceCollection })));
      const additionalInternalServices = [internalService];
      const expectedCollection: IInternalService[] = [...additionalInternalServices, ...internalServiceCollection];
      jest.spyOn(internalServiceService, 'addInternalServiceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ product });
      comp.ngOnInit();

      expect(internalServiceService.query).toHaveBeenCalled();
      expect(internalServiceService.addInternalServiceToCollectionIfMissing).toHaveBeenCalledWith(
        internalServiceCollection,
        ...additionalInternalServices.map(expect.objectContaining)
      );
      expect(comp.internalServicesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const product: IProduct = { id: 456 };
      const internalService: IInternalService = { id: 99010 };
      product.internalService = internalService;

      activatedRoute.data = of({ product });
      comp.ngOnInit();

      expect(comp.internalServicesSharedCollection).toContain(internalService);
      expect(comp.product).toEqual(product);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProduct>>();
      const product = { id: 123 };
      jest.spyOn(productFormService, 'getProduct').mockReturnValue(product);
      jest.spyOn(productService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ product });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: product }));
      saveSubject.complete();

      // THEN
      expect(productFormService.getProduct).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(productService.update).toHaveBeenCalledWith(expect.objectContaining(product));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProduct>>();
      const product = { id: 123 };
      jest.spyOn(productFormService, 'getProduct').mockReturnValue({ id: null });
      jest.spyOn(productService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ product: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: product }));
      saveSubject.complete();

      // THEN
      expect(productFormService.getProduct).toHaveBeenCalled();
      expect(productService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProduct>>();
      const product = { id: 123 };
      jest.spyOn(productService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ product });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(productService.update).toHaveBeenCalled();
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
