import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProductFormService, ProductFormGroup } from './product-form.service';
import { IProduct } from '../product.model';
import { ProductService } from '../service/product.service';
import { IInternalService } from 'app/entities/internal-service/internal-service.model';
import { InternalServiceService } from 'app/entities/internal-service/service/internal-service.service';
import { ProductType } from 'app/entities/enumerations/product-type.model';

@Component({
  standalone: true,
  selector: 'jhi-product-update',
  templateUrl: './product-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProductUpdateComponent implements OnInit {
  isSaving = false;
  product: IProduct | null = null;
  productTypeValues = Object.keys(ProductType);

  internalServicesSharedCollection: IInternalService[] = [];

  editForm: ProductFormGroup = this.productFormService.createProductFormGroup();

  constructor(
    protected productService: ProductService,
    protected productFormService: ProductFormService,
    protected internalServiceService: InternalServiceService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareInternalService = (o1: IInternalService | null, o2: IInternalService | null): boolean =>
    this.internalServiceService.compareInternalService(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ product }) => {
      this.product = product;
      if (product) {
        this.updateForm(product);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const product = this.productFormService.getProduct(this.editForm);
    if (product.id !== null) {
      this.subscribeToSaveResponse(this.productService.update(product));
    } else {
      this.subscribeToSaveResponse(this.productService.create(product));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProduct>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(product: IProduct): void {
    this.product = product;
    this.productFormService.resetForm(this.editForm, product);

    this.internalServicesSharedCollection = this.internalServiceService.addInternalServiceToCollectionIfMissing<IInternalService>(
      this.internalServicesSharedCollection,
      product.internalService
    );
  }

  protected loadRelationshipsOptions(): void {
    this.internalServiceService
      .query()
      .pipe(map((res: HttpResponse<IInternalService[]>) => res.body ?? []))
      .pipe(
        map((internalServices: IInternalService[]) =>
          this.internalServiceService.addInternalServiceToCollectionIfMissing<IInternalService>(
            internalServices,
            this.product?.internalService
          )
        )
      )
      .subscribe((internalServices: IInternalService[]) => (this.internalServicesSharedCollection = internalServices));
  }
}
