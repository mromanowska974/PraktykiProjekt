import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InternalServiceFormService, InternalServiceFormGroup } from './internal-service-form.service';
import { IInternalService } from '../internal-service.model';
import { InternalServiceService } from '../service/internal-service.service';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';
import { StatusOfServiceCard } from 'app/entities/enumerations/status-of-service-card.model';
import { BusinessService } from 'app/entities/business-service/business-service.model';
import { IServiceElement } from 'app/entities/service-element/service-element.model';
import { IParameter } from 'app/entities/parameter/parameter.model';
import { PaymentType } from 'app/entities/enumerations/payment-type.model';
import { ParameterType } from 'app/entities/enumerations/parameter-type.model';
import { TypeOfPeriodMapping } from 'app/entities/enumerations/type-of-period-of-provision-of-service.model';
import { BusinessServiceService } from 'app/entities/business-service/service/business-service.service';
import { ServiceElementService } from 'app/entities/service-element/service/service-element.service';
import { ParameterService } from 'app/entities/parameter/service/parameter.service';
import { MatDialog } from '@angular/material/dialog';
import dayjs from 'dayjs';
import { ParameterUpdateComponent } from 'app/entities/parameter/update/parameter-update.component';
import { Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, Document } from 'docx';
import saveAs from 'file-saver';
import { Orange3dButtonDirective } from 'app/directives/orange3d-button/orange3d-button.directive';

@Component({
  standalone: true,
  selector: 'jhi-internal-service-update',
  templateUrl: './internal-service-update.component.html',
  styleUrls: ['./internal-service-update.component.css'],
  imports: [SharedModule, FormsModule, ReactiveFormsModule, Orange3dButtonDirective],
})
export class InternalServiceUpdateComponent implements OnInit {
  sectionSelected: string = 'D';

  internalServiceId: number;
  internalService: IInternalService | null = {} as IInternalService;
  oldInternalService: IInternalService | null = {} as IInternalService;
  isDataLoaded: boolean = false;

  functionalDescription: string;
  exclusions: string;
  dutiesAndResponsibilities: string;
  personResponsibleForService: string;
  hoursOfService: string;
  serviceActivatingCost: string;
  priceListOfService: string;
  notes: string;

  serviceElementsOfMonthlyPaymentType: IServiceElement[] | null = [];
  serviceElementsOfOneTimePaymentType: IServiceElement[] | null = [];
  oldServiceElementsOfMonthlyPaymentType: IServiceElement[] | null = [];
  oldServiceElementsOfOneTimePaymentType: IServiceElement[] | null = [];

  parametersOfQualityType: IParameter[] | null = [];
  parametersOfQuantityType: IParameter[] | null = [];
  oldParametersOfQualityType: IParameter[] | null = [];
  oldParametersOfQuantityType: IParameter[] | null = [];

  paymentType: typeof PaymentType = PaymentType;
  parameterType: typeof ParameterType = ParameterType;

  serviceElementSub: Subscription;
  parameterSub: Subscription;

  parametersToDelete: IParameter[] | null = [];
  serviceElementsToDelete: IServiceElement[] | null = [];

  parametersToEdit: { index: number; parameterType: ParameterType }[] | null = [];
  serviceElementsToEdit: { index: number; paymentType: PaymentType }[] | null = [];

  formattedStartDatesMonthly: string[] = [];
  formattedEndDatesMonthly: string[] = [];
  formattedStartDatesOneTime: string[] = [];
  formattedEndDatesOneTime: string[] = [];

  editedServiceElementIndex: number;
  editedParameterIndex: number;
  action: string;

  public TypeOfPeriodMapping: typeof TypeOfPeriodMapping = TypeOfPeriodMapping;
  public typeOfPeriodOfProvisionOfService: any = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private internalServiceService: InternalServiceService,
    private serviceElementService: ServiceElementService,
    private parameterService: ParameterService,
    private dialogRef: MatDialog
  ) {}

  ngOnInit(): void {
    this.internalServiceId = +this.route.snapshot.params['id'];
    this.action = this.internalServiceService.action;

    // setting business service
    //if business service was saved when clicked Add New Service Element
    if (this.internalServiceService.isInternalServiceSaved) {
      this.internalService = this.internalServiceService.internalService;
      this.oldInternalService = this.internalServiceService.oldInternalService;

      this.serviceElementsOfMonthlyPaymentType = this.internalServiceService.serviceElementsOfMonthlyPaymentType;
      this.serviceElementsOfOneTimePaymentType = this.internalServiceService.serviceElementsOfOneTimePaymentType;

      this.oldServiceElementsOfMonthlyPaymentType = this.internalServiceService.oldServiceElementsOfMonthlyPaymentType;
      this.oldServiceElementsOfOneTimePaymentType = this.internalServiceService.oldServiceElementsOfOneTimePaymentType;

      this.parametersOfQualityType = this.internalServiceService.parametersOfQualityType;
      this.parametersOfQuantityType = this.internalServiceService.parametersOfQuantityType;

      this.oldParametersOfQualityType = this.internalServiceService.oldParametersOfQualityType;
      this.oldParametersOfQuantityType = this.internalServiceService.oldParametersOfQuantityType;

      this.formattedStartDatesMonthly = this.internalServiceService.formattedStartDatesMonthly;
      this.formattedEndDatesMonthly = this.internalServiceService.formattedEndDatesMonthly;
      this.formattedStartDatesOneTime = this.internalServiceService.formattedStartDatesOneTime;
      this.formattedEndDatesOneTime = this.internalServiceService.formattedEndDatesOneTime;

      this.parametersToDelete = this.internalServiceService.parametersToDelete;
      this.parametersToEdit = this.internalServiceService.parametersToEdit;
      this.serviceElementsToDelete = this.internalServiceService.serviceElementsToDelete;
      this.serviceElementsToEdit = this.internalServiceService.serviceElementsToEdit;

      this.internalServiceService.isInternalServiceSaved = false;
      this.isDataLoaded = true;
    }
    //if clicked Edit Business Service from Home page
    else {
      this.getBusinessService();
      this.serviceElementService.findByInternalServiceAndPaymentType(this.internalServiceId, PaymentType.MONTHLY).subscribe(resp => {
        this.oldServiceElementsOfMonthlyPaymentType = resp.body;
        this.serviceElementsOfMonthlyPaymentType = JSON.parse(JSON.stringify(this.oldServiceElementsOfMonthlyPaymentType));
        console.log(this.oldServiceElementsOfMonthlyPaymentType);
        console.log(this.serviceElementsOfMonthlyPaymentType);

        this.serviceElementsOfMonthlyPaymentType?.forEach(serviceElement => {
          this.formattedStartDatesMonthly.push(dayjs(serviceElement.startDate!).format('DD.MM.YYYY').toString());
          this.formattedEndDatesMonthly.push(dayjs(serviceElement.endDate!).format('DD.MM.YYYY').toString());
        });
      });

      this.serviceElementService.findByInternalServiceAndPaymentType(this.internalServiceId, PaymentType.DISPOSABLE).subscribe(resp => {
        this.oldServiceElementsOfOneTimePaymentType = resp.body;
        this.serviceElementsOfOneTimePaymentType = JSON.parse(JSON.stringify(this.oldServiceElementsOfOneTimePaymentType));

        this.serviceElementsOfOneTimePaymentType?.forEach(serviceElement => {
          this.formattedStartDatesOneTime.push(dayjs(serviceElement.startDate!).format('DD.MM.YYYY').toString());
          this.formattedEndDatesOneTime.push(dayjs(serviceElement.endDate!).format('DD.MM.YYYY').toString());
        });
      });

      this.parameterService.findByInternalServiceIdAndParameterType(this.internalServiceId, ParameterType.QUALITY).subscribe(resp => {
        this.oldParametersOfQualityType = resp.body;
        this.parametersOfQualityType = JSON.parse(JSON.stringify(this.oldParametersOfQualityType));
      });

      this.parameterService.findByInternalServiceIdAndParameterType(this.internalServiceId, ParameterType.QUANTITY).subscribe(resp => {
        this.oldParametersOfQuantityType = resp.body;
        this.parametersOfQuantityType = JSON.parse(JSON.stringify(this.oldParametersOfQuantityType));
      });
    }

    //receiving new service element
    if (this.serviceElementService.isServiceElementReceived) {
      this.serviceElementSub = this.serviceElementService.toReceive.subscribe(resp => {
        if (this.action === 'ADD') {
          resp.internalService = this.internalService;

          if (resp.paymentType === PaymentType.MONTHLY) {
            this.serviceElementsOfMonthlyPaymentType!.push(resp);
            this.formattedStartDatesMonthly.push(dayjs(resp.startDate).format('DD.MM.YYYY'));
            this.formattedEndDatesMonthly.push(dayjs(resp.endDate).format('DD.MM.YYYY'));
          } else if (resp.paymentType === PaymentType.DISPOSABLE) {
            this.serviceElementsOfOneTimePaymentType!.push(resp);
            this.formattedStartDatesOneTime.push(dayjs(resp.startDate).format('DD.MM.YYYY'));
            this.formattedEndDatesOneTime.push(dayjs(resp.endDate).format('DD.MM.YYYY'));
          }
        } else if (this.action === 'EDIT') {
          this.editedServiceElementIndex = this.internalServiceService.serviceElementIndex;
          resp.internalService = this.internalService;

          if (resp.paymentType === PaymentType.MONTHLY) {
            console.log(this.oldServiceElementsOfMonthlyPaymentType![this.editedServiceElementIndex]);

            //if exists in "old" list
            if (this.oldServiceElementsOfMonthlyPaymentType![this.editedServiceElementIndex]) {
              resp.id = this.oldServiceElementsOfMonthlyPaymentType![this.editedServiceElementIndex].id;
              console.log(resp);
            }

            this.serviceElementsOfMonthlyPaymentType![this.editedServiceElementIndex] = resp;
            this.formattedStartDatesMonthly[this.editedServiceElementIndex] = dayjs(resp.startDate).format('DD.MM.YYYY');
            this.formattedEndDatesMonthly[this.editedServiceElementIndex] = dayjs(resp.endDate).format('DD.MM.YYYY');

            if (
              !this.serviceElementsToEdit?.find(el => {
                return el.index === this.editedServiceElementIndex && el.paymentType === 'MONTHLY';
              }) &&
              resp.id !== undefined
            ) {
              this.serviceElementsToEdit?.push({ index: this.editedServiceElementIndex, paymentType: PaymentType.MONTHLY });
              console.log(this.serviceElementsToEdit);
            }
          } else if (resp.paymentType === PaymentType.DISPOSABLE) {
            //if exists in "old" list
            if (this.oldServiceElementsOfOneTimePaymentType![this.editedServiceElementIndex]) {
              resp.id = this.oldServiceElementsOfOneTimePaymentType![this.editedServiceElementIndex].id;
              console.log(resp);
            }

            this.serviceElementsOfOneTimePaymentType![this.editedServiceElementIndex] = resp;
            this.formattedStartDatesOneTime[this.editedServiceElementIndex] = dayjs(resp.startDate).format('DD.MM.YYYY');
            this.formattedEndDatesOneTime[this.editedServiceElementIndex] = dayjs(resp.endDate).format('DD.MM.YYYY');

            if (
              !this.serviceElementsToEdit?.find(el => {
                return el.index === this.editedServiceElementIndex && el.paymentType === 'DISPOSABLE';
              }) &&
              resp.id !== undefined
            ) {
              this.serviceElementsToEdit?.push({ index: this.editedServiceElementIndex, paymentType: PaymentType.DISPOSABLE });
              console.log(this.serviceElementsToEdit);
            }
          }
        }

        this.serviceElementService.isServiceElementReceived = false;
      });
    }

    //receiving new parameter
    this.parameterSub = this.parameterService.toReceive.subscribe(resp => {
      resp.internalService = this.internalService;

      if (this.action === 'ADD') {
        if (resp.type === ParameterType.QUALITY) {
          this.parametersOfQualityType?.push(resp);
        } else if (resp.type === ParameterType.QUANTITY) {
          this.parametersOfQuantityType?.push(resp);
        }
      } else if (this.action === 'EDIT') {
        this.editedParameterIndex = this.internalServiceService.parameterIndex;
        console.log(this.editedParameterIndex);

        if (
          resp.type === 'QUALITY' &&
          !this.parametersToEdit?.find(el => {
            return el.index === this.editedParameterIndex && el.parameterType === 'QUALITY';
          }) &&
          resp.id !== undefined
        ) {
          console.log('weszlo');
          this.parametersToEdit?.push({ index: this.editedParameterIndex, parameterType: ParameterType.QUALITY });
        } else if (
          resp.type === 'QUANTITY' &&
          !this.parametersToEdit?.find(el => {
            return el.index === this.editedParameterIndex && el.parameterType === 'QUANTITY';
          }) &&
          resp.id !== undefined
        ) {
          this.parametersToEdit?.push({ index: this.editedParameterIndex, parameterType: ParameterType.QUANTITY });
        }
        console.log(this.parametersToEdit);
      }

      //this.parameterService.isParameterReceived = false;
    });
  }

  ngOnDestroy(): void {
    if (this.serviceElementSub) {
      this.serviceElementSub.unsubscribe();
    }

    if (this.parameterSub) {
      this.parameterSub.unsubscribe();
    }
  }

  getBusinessService() {
    this.internalServiceService.find(this.internalServiceId).subscribe(businessService => {
      this.oldInternalService = businessService.body;
      this.internalService = JSON.parse(JSON.stringify(this.oldInternalService));
      this.isDataLoaded = true;
    });
  }

  onSelectSection(section: string) {
    this.sectionSelected = section;
  }

  onCancel() {
    this.router.navigate(['/']);
  }

  onEditInternalService() {
    //adding service elements to db
    this.serviceElementsOfMonthlyPaymentType!.forEach(serviceElement => {
      if (serviceElement.id === undefined) this.serviceElementService.create(serviceElement).subscribe();
    });

    this.serviceElementsOfOneTimePaymentType!.forEach(serviceElement => {
      if (serviceElement.id === undefined) this.serviceElementService.create(serviceElement).subscribe();
    });

    //adding parameters to db
    this.parametersOfQualityType!.forEach(parameter => {
      if (parameter.id === undefined) this.parameterService.create(parameter).subscribe();
    });

    this.parametersOfQuantityType!.forEach(parameter => {
      if (parameter.id === undefined) this.parameterService.create(parameter).subscribe();
    });

    //deleting parameters
    this.parametersToDelete!.forEach(parameter => {
      this.parameterService.delete(parameter.id).subscribe(() => console.log(parameter));
    });

    //deleting service elements
    this.serviceElementsToDelete!.forEach(serviceElement => {
      this.serviceElementService.delete(serviceElement.id).subscribe(() => console.log(serviceElement));
    });

    //updating parameters
    this.parametersToEdit!.forEach(parameterData => {
      if (parameterData.parameterType === 'QUALITY') {
        this.parameterService.update(this.parametersOfQualityType![parameterData.index]).subscribe();
      } else if (parameterData.parameterType === 'QUANTITY') {
        this.parameterService.update(this.parametersOfQuantityType![parameterData.index]).subscribe();
      }
    });

    //updating service elements
    this.serviceElementsToEdit!.forEach(serviceElementData => {
      if (serviceElementData.paymentType === 'MONTHLY') {
        this.serviceElementService.update(this.serviceElementsOfMonthlyPaymentType![serviceElementData.index]).subscribe();
      } else if (serviceElementData.paymentType === 'DISPOSABLE') {
        this.serviceElementService.update(this.serviceElementsOfOneTimePaymentType![serviceElementData.index]).subscribe();
      }
    });

    //updating business service
    this.internalServiceService.update(this.internalService!).subscribe();

    //go back to previous page
    this.router.navigate(['/']);
  }

  saveData() {
    this.internalServiceService.oldInternalService = this.oldInternalService;
    this.internalServiceService.internalService = this.internalService;

    this.internalServiceService.oldServiceElementsOfMonthlyPaymentType = this.oldServiceElementsOfMonthlyPaymentType;
    this.internalServiceService.oldServiceElementsOfOneTimePaymentType = this.oldServiceElementsOfOneTimePaymentType;

    this.internalServiceService.serviceElementsOfMonthlyPaymentType = this.serviceElementsOfMonthlyPaymentType;
    this.internalServiceService.serviceElementsOfOneTimePaymentType = this.serviceElementsOfOneTimePaymentType;

    this.internalServiceService.oldParametersOfQualityType = this.oldParametersOfQualityType;
    this.internalServiceService.oldParametersOfQuantityType = this.oldParametersOfQuantityType;

    this.internalServiceService.parametersOfQualityType = this.parametersOfQualityType;
    this.internalServiceService.parametersOfQuantityType = this.parametersOfQuantityType;

    this.internalServiceService.formattedStartDatesMonthly = this.formattedStartDatesMonthly;
    this.internalServiceService.formattedEndDatesMonthly = this.formattedEndDatesMonthly;
    this.internalServiceService.formattedStartDatesOneTime = this.formattedStartDatesOneTime;
    this.internalServiceService.formattedEndDatesOneTime = this.formattedEndDatesOneTime;

    this.internalServiceService.parametersToDelete = this.parametersToDelete;
    this.internalServiceService.parametersToEdit = this.parametersToEdit;
    this.internalServiceService.serviceElementsToDelete = this.serviceElementsToDelete;
    this.internalServiceService.serviceElementsToEdit = this.serviceElementsToEdit;

    this.internalServiceService.isInternalServiceSaved = true;
  }

  onAddServiceElement(paymentType: PaymentType) {
    this.saveData();
    this.action = 'ADD';
    this.internalServiceService.action = this.action;
    this.router.navigate(['/service-element', 'new'], {
      queryParams: {
        paymentType: paymentType,
        action: this.action,
      },
    });
  }

  onEditServiceElement(serviceElement: IServiceElement, index: number) {
    this.saveData();
    this.internalServiceService.serviceElementIndex = index;
    this.action = 'EDIT';
    this.internalServiceService.action = this.action;

    this.internalServiceService.sendServiceElement(serviceElement);

    this.router.navigate(['/service-element', 'new'], {
      queryParams: {
        paymentType: serviceElement.paymentType,
        action: this.action,
      },
    });
  }

  onDeleteServiceElement(serviceElement: IServiceElement, index: number) {
    if (confirm('Czy na pewno chcesz usunąć tą składową usługi?')) {
      if (serviceElement.id !== undefined) {
        this.serviceElementsToDelete?.push(serviceElement);
      }

      if (serviceElement.paymentType === PaymentType.MONTHLY) {
        this.serviceElementsOfMonthlyPaymentType?.splice(index, 1);
      } else if (serviceElement.paymentType === PaymentType.DISPOSABLE) {
        this.serviceElementsOfOneTimePaymentType?.splice(index, 1);
      }
    }
  }

  onAddParameter(parameterType: ParameterType) {
    this.action = 'ADD';

    this.dialogRef.open(ParameterUpdateComponent, {
      data: {
        parameterType: parameterType,
        action: this.action,
      },
    });
  }

  onDeleteParameter(parameter: IParameter, index: number) {
    if (confirm('Czy na pewno chcesz usunąć ten parametr?')) {
      if (parameter.id !== undefined) {
        this.parametersToDelete?.push(parameter);
      }

      if (parameter.type === ParameterType.QUALITY) {
        this.parametersOfQualityType?.splice(index, 1);
      } else if (parameter.type === ParameterType.QUANTITY) {
        this.parametersOfQuantityType?.splice(index, 1);
      }
    }
  }

  onEditParameter(parameter: IParameter, index: number) {
    this.internalServiceService.parameterIndex = index;
    this.action = 'EDIT';
    this.internalServiceService.action = this.action;

    this.dialogRef.open(ParameterUpdateComponent, {
      data: {
        parameter: parameter,
        action: this.action,
      },
    });
  }

  onCreateDocxFile() {
    let parameterRowsQuality: TableRow[] = [];
    let serviceElementRowsMonthly: TableRow[] = [];
    let parameterRowsQuantity: TableRow[] = [];
    let serviceElementRowsOneTime: TableRow[] = [];

    this.oldParametersOfQualityType!.forEach(element => {
      const newRow: TableRow = new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: element!.name ? element.name : '' })],
          }),
          new TableCell({
            children: [new Paragraph({ text: element!.value ? element.value : '' })],
          }),
        ],
      });

      parameterRowsQuality.push(newRow);
    });

    this.oldParametersOfQuantityType!.forEach(element => {
      const newRow: TableRow = new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: element!.name ? element.name : '' })],
          }),
          new TableCell({
            children: [new Paragraph({ text: element!.value ? element.value : '' })],
          }),
        ],
      });

      parameterRowsQuantity.push(newRow);
    });

    this.oldServiceElementsOfMonthlyPaymentType!.forEach(element => {
      console.log(this.oldServiceElementsOfMonthlyPaymentType);
      const newRow: TableRow = new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: (this.oldServiceElementsOfMonthlyPaymentType!.indexOf(element) + 1).toString() })],
          }),
          new TableCell({
            children: [new Paragraph({ text: element!.price ? element.price.toString() : '' })],
          }),
          new TableCell({
            children: [new Paragraph({ text: element!.description ? element.description : '' })],
          }),
          new TableCell({
            children: [new Paragraph({ text: element!.valuationNumber ? element.valuationNumber : '' })],
          }),
          new TableCell({
            children: [new Paragraph({ text: element!.paymentType ? element.paymentType : '' })],
          }),
          new TableCell({
            children: [new Paragraph({ text: element!.startDate ? element.startDate.toString() : '' })],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: element!.periodOfProvisionOfServiceInMonths ? element.periodOfProvisionOfServiceInMonths.toString() : '',
              }),
            ],
          }),
          new TableCell({
            children: [new Paragraph({ text: element!.typeOfPeriodOfProvisionOfService ? element.typeOfPeriodOfProvisionOfService : '' })],
          }),
          new TableCell({
            children: [new Paragraph({ text: element!.endDate ? element.endDate.toString() : '' })],
          }),
          new TableCell({
            children: [new Paragraph({ text: element!.status ? element.status : '' })],
          }),
        ],
      });

      serviceElementRowsMonthly.push(newRow);
    });

    this.oldServiceElementsOfOneTimePaymentType!.forEach(element => {
      const newRow: TableRow = new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: (this.oldServiceElementsOfOneTimePaymentType!.indexOf(element) + 1).toString() })],
          }),
          new TableCell({
            children: [new Paragraph({ text: element!.price ? element.price.toString() : '' })],
          }),
          new TableCell({
            children: [new Paragraph({ text: element!.description ? element.description : '' })],
          }),
          new TableCell({
            children: [new Paragraph({ text: element!.valuationNumber ? element.valuationNumber : '' })],
          }),
          new TableCell({
            children: [new Paragraph({ text: element!.paymentType ? element.paymentType : '' })],
          }),
          new TableCell({
            children: [new Paragraph({ text: element!.startDate ? element.startDate.toString() : '' })],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: element!.periodOfProvisionOfServiceInMonths ? element.periodOfProvisionOfServiceInMonths.toString() : '',
              }),
            ],
          }),
          new TableCell({
            children: [new Paragraph({ text: element!.typeOfPeriodOfProvisionOfService ? element.typeOfPeriodOfProvisionOfService : '' })],
          }),
          new TableCell({
            children: [new Paragraph({ text: element!.endDate ? element.endDate.toString() : '' })],
          }),
          new TableCell({
            children: [new Paragraph({ text: element!.status ? element.status : '' })],
          }),
        ],
      });

      serviceElementRowsOneTime.push(newRow);
    });

    const document = new Document({
      sections: [
        {
          properties: {},
          children: [
            // new Paragraph({
            //   children: [
            //     new TextRun('Klient: '),
            //     new TextRun({
            //       text: this.oldInternalService!.client! ? this.oldInternalService!.client!.name! : 'nic',
            //       bold: true,
            //     }),
            //   ],
            // }),
            new Paragraph({
              children: [
                new TextRun('Symbol usługi: '),
                new TextRun({
                  text: this.oldInternalService! ? this.oldInternalService!.symbol! : 'nic',
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun('Nazwa usługi: '),
                new TextRun({
                  text: this.oldInternalService! ? this.oldInternalService!.name! : 'nic',
                  bold: true,
                }),
              ],
            }),
            // new Paragraph({
            //   children: [
            //     new TextRun('Dział: '),
            //     new TextRun({
            //       text: this.oldInternalService!.department! ? this.oldInternalService!.department!.name! : 'nic',
            //       bold: true,
            //     }),
            //   ],
            // }),
            new Paragraph({
              children: [
                new TextRun('Właściciel: '),
                new TextRun({
                  text: this.oldInternalService!.employee!
                    ? this.oldInternalService!.employee!.name! + ' ' + this.oldInternalService!.employee!.surname
                    : 'nic',
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Opis funkcjonalny: ', break: 1 }),
                new TextRun({
                  text: this.oldInternalService!.functionalDescription! ? this.oldInternalService!.functionalDescription! : 'nic',
                  bold: true,
                  break: 1,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun('Wykluczenia: '),
                new TextRun({
                  text: this.oldInternalService!.exclusions! ? this.oldInternalService!.exclusions! : 'nic',
                  bold: true,
                  break: 1,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun('Obowiązki i odpowiedzialności stron: '),
                new TextRun({
                  text: this.oldInternalService!.dutiesAndResponsibilities ? this.oldInternalService!.dutiesAndResponsibilities : 'nic',
                  bold: true,
                  break: 1,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun('Osoba odpowiedzialna za usługę po stronie Zamawiającego: '),
                new TextRun({
                  text: this.oldInternalService!.personResponsibleForService ? this.oldInternalService!.personResponsibleForService : 'nic',
                  bold: true,
                  break: 1,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun('Godziny gwarantowanego świadczenia usługi: '),
                new TextRun({
                  text: this.oldInternalService!.hoursOfService ? this.oldInternalService!.hoursOfService : 'nic',
                  bold: true,
                  break: 1,
                }),
              ],
            }),
            new Paragraph({
              children: [new TextRun('Parametry jakościowe: ')],
            }),
            new Table({
              columnWidths: [3505, 5505],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: {
                        size: 3505,
                        type: WidthType.DXA,
                      },
                      children: [new Paragraph('Nazwa parametru')],
                    }),
                    new TableCell({
                      width: {
                        size: 5505,
                        type: WidthType.DXA,
                      },
                      children: [new Paragraph('Wartość docelowa')],
                    }),
                  ],
                }),
                ...parameterRowsQuality,
              ],
            }),
            new Paragraph({
              children: [new TextRun('Parametry pojemnościowe: ')],
            }),
            new Table({
              columnWidths: [3505, 5505],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: {
                        size: 3505,
                        type: WidthType.DXA,
                      },
                      children: [new Paragraph('Nazwa parametru')],
                    }),
                    new TableCell({
                      width: {
                        size: 5505,
                        type: WidthType.DXA,
                      },
                      children: [new Paragraph('Wartość docelowa')],
                    }),
                  ],
                }),
                ...parameterRowsQuantity,
              ],
            }),
            new Paragraph({
              children: [
                new TextRun('Koszty uruchomienia usługi: '),
                new TextRun({
                  text: this.oldInternalService!.serviceActivatingCost ? this.oldInternalService!.serviceActivatingCost : 'nic',
                  bold: true,
                  break: 1,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun('Cennik usługi: '),
                new TextRun({
                  text: this.oldInternalService!.priceListOfService ? this.oldInternalService!.priceListOfService : 'nic',
                  bold: true,
                  break: 1,
                }),
              ],
            }),
            new Paragraph({
              children: [new TextRun('Wartość miesięcznej opłaty za usługę: ')],
            }),
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: {
                        size: 50,
                        type: WidthType.DXA,
                      },
                      children: [new Paragraph('Lp.')],
                    }),
                    new TableCell({
                      width: {
                        size: 1000,
                        type: WidthType.DXA,
                      },
                      children: [new Paragraph('Kwota zł netto/m-c')],
                    }),
                    new TableCell({
                      width: {
                        size: 1000,
                        type: WidthType.DXA,
                      },
                      children: [new Paragraph('Opis usługi')],
                    }),
                    new TableCell({
                      width: {
                        size: 1000,
                        type: WidthType.DXA,
                      },
                      children: [new Paragraph('Nr wyceny')],
                    }),
                    new TableCell({
                      width: {
                        size: 1000,
                        type: WidthType.DXA,
                      },
                      children: [new Paragraph('Typ opłaty')],
                    }),
                    new TableCell({
                      width: {
                        size: 1000,
                        type: WidthType.DXA,
                      },
                      children: [new Paragraph('Data rozpoczęcia świadczenia usługi')],
                    }),
                    new TableCell({
                      width: {
                        size: 1000,
                        type: WidthType.DXA,
                      },
                      children: [new Paragraph('Okres świadczenia usługi (miesiące)')],
                    }),
                    new TableCell({
                      width: {
                        size: 1000,
                        type: WidthType.DXA,
                      },
                      children: [new Paragraph('Typ okresu swiadczenia usługi')],
                    }),
                    new TableCell({
                      width: {
                        size: 1000,
                        type: WidthType.DXA,
                      },
                      children: [new Paragraph('Data zakończenia świadczenia usługi')],
                    }),
                    new TableCell({
                      width: {
                        size: 1000,
                        type: WidthType.DXA,
                      },
                      children: [new Paragraph('Status')],
                    }),
                  ],
                }),
                ...serviceElementRowsMonthly,
              ],
            }),
            new Paragraph({
              children: [new TextRun('Inne płatności: ')],
            }),
            new Table({
              //columnWidths: [3505, 5505],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: {
                        size: 50,
                        type: WidthType.DXA,
                      },
                      children: [new Paragraph('Lp.')],
                    }),
                    new TableCell({
                      width: {
                        size: 1000,
                        type: WidthType.DXA,
                      },
                      children: [new Paragraph('Kwota zł netto')],
                    }),
                    new TableCell({
                      width: {
                        size: 1000,
                        type: WidthType.DXA,
                      },
                      children: [new Paragraph('Opis usługi')],
                    }),
                    new TableCell({
                      width: {
                        size: 1000,
                        type: WidthType.DXA,
                      },
                      children: [new Paragraph('Nr wyceny')],
                    }),
                    new TableCell({
                      width: {
                        size: 1000,
                        type: WidthType.DXA,
                      },
                      children: [new Paragraph('Typ opłaty')],
                    }),
                    new TableCell({
                      width: {
                        size: 1000,
                        type: WidthType.DXA,
                      },
                      children: [new Paragraph('Data rozpoczęcia świadczenia usługi')],
                    }),
                    new TableCell({
                      width: {
                        size: 1000,
                        type: WidthType.DXA,
                      },
                      children: [new Paragraph('Okres świadczenia usługi (miesiące)')],
                    }),
                    new TableCell({
                      width: {
                        size: 1000,
                        type: WidthType.DXA,
                      },
                      children: [new Paragraph('Typ okresu swiadczenia usługi')],
                    }),
                    new TableCell({
                      width: {
                        size: 1000,
                        type: WidthType.DXA,
                      },
                      children: [new Paragraph('Data zakończenia świadczenia usługi')],
                    }),
                    new TableCell({
                      width: {
                        size: 1000,
                        type: WidthType.DXA,
                      },
                      children: [new Paragraph('Status')],
                    }),
                  ],
                }),
                ...serviceElementRowsOneTime,
              ],
            }),
            new Paragraph({
              children: [
                new TextRun('Uwagi: '),
                new TextRun({
                  text: this.oldInternalService!.notes ? this.oldInternalService!.notes : 'nic',
                  bold: true,
                  break: 1,
                }),
              ],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(document).then(blob => {
      console.log(blob);
      saveAs(blob, this.internalService?.symbol + '.docx');
      console.log('Document created successfully');
    });
  }
}
