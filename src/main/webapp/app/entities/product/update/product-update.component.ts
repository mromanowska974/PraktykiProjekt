import { Component, Inject, OnInit } from '@angular/core';
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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ParameterUpdateComponent } from 'app/entities/parameter/update/parameter-update.component';

@Component({
  standalone: true,
  selector: 'jhi-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.css'],
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProductUpdateComponent implements OnInit {
  product: IProduct | null = {} as IProduct;

  isNameEntered: boolean = false;
  isSaveBtnClicked: boolean = false;

  constructor(
    protected productService: ProductService,
    protected productFormService: ProductFormService,
    protected internalServiceService: InternalServiceService,
    protected activatedRoute: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<ParameterUpdateComponent>
  ) {}

  ngOnInit(): void {
    if (this.data.action === 'ADD') this.product!.type = this.data.productType;

    if (this.data.action === 'EDIT') this.product = this.data.product;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    this.isNameEntered = this.product!.name !== undefined && this.product!.name!.length > 0 ? true : false;

    if (this.isNameEntered) {
      this.productService.sendCreatedProduct(this.product!);
      this.dialogRef.close();
    } else {
      this.isSaveBtnClicked = true;
    }
  }
}
