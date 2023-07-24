import { Component, OnInit } from '@angular/core';
import { InternalServiceService } from '../service/internal-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IInternalService } from '../internal-service.model';

@Component({
  selector: 'jhi-internal-service-add-existing',
  templateUrl: './internal-service-add-existing.component.html',
  styleUrls: ['./internal-service-add-existing.component.scss'],
})
export class InternalServiceAddExistingComponent implements OnInit {
  internalServices: IInternalService[] | null;

  constructor(protected internalServiceService: InternalServiceService, protected activatedRoute: ActivatedRoute, public router: Router) {}

  ngOnInit(): void {
    this.internalServiceService.query().subscribe(internalServices => {
      this.internalServices = internalServices.body;
    });
  }

  onInternalServiceClicked(internalService: IInternalService) {
    console.log(internalService);
    this.internalServiceService.internalServiceSelected.emit(internalService);
    this.internalServiceService.isInternalServiceSelected = true;
  }
}
