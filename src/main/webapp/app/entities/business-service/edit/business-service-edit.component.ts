import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessService, IBusinessService } from '../business-service.model';
import { BusinessServiceService } from '../service/business-service.service';
import { IServiceElement } from 'app/entities/service-element/service-element.model';
import { PaymentType } from 'app/entities/enumerations/payment-type.model';
import { ServiceElementService } from 'app/entities/service-element/service/service-element.service';
import { Subscription } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ParameterComponent } from 'app/entities/parameter/list/parameter.component';
import { ParameterUpdateComponent } from 'app/entities/parameter/update/parameter-update.component';
import { ParameterType } from 'app/entities/enumerations/parameter-type.model';
import { IParameter } from 'app/entities/parameter/parameter.model';
import { ParameterService } from 'app/entities/parameter/service/parameter.service';
import dayjs from 'dayjs';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';
import { saveAs } from 'file-saver';
import { TypeOfPeriodMapping } from 'app/entities/enumerations/type-of-period-of-provision-of-service.model';
import { Orange3dButtonDirective } from 'app/directives/orange3d-button/orange3d-button.directive';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'jhi-business-service-edit',
  templateUrl: './business-service-edit.component.html',
  styleUrls: ['./business-service-edit.component.scss'],
  imports: [Orange3dButtonDirective, FormsModule, CommonModule],
})
export class BusinessServiceEditComponent implements OnInit, OnDestroy {
  sectionSelected: string = 'C';

  businessServiceId: number;
  businessService: BusinessService | null = new BusinessService();
  oldBusinessService: BusinessService | null = new BusinessService();
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

  formattedStartDatesMonthly: string[] = [];
  formattedEndDatesMonthly: string[] = [];
  formattedStartDatesOneTime: string[] = [];
  formattedEndDatesOneTime: string[] = [];

  editedServiceElementIndex: number;
  action: string;

  public TypeOfPeriodMapping: typeof TypeOfPeriodMapping = TypeOfPeriodMapping;
  public typeOfPeriodOfProvisionOfService: any = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private businessServiceService: BusinessServiceService,
    private serviceElementService: ServiceElementService,
    private parameterService: ParameterService,
    private dialogRef: MatDialog
  ) {}

  ngOnInit(): void {
    this.businessServiceId = +this.route.snapshot.params['id'];
    this.action = this.businessServiceService.action;

    // setting business service
    //if business service was saved when clicked Add New Service Element
    if (this.businessServiceService.isBusinessServiceSaved) {
      this.businessService = this.businessServiceService.businessService;
      this.oldBusinessService = this.businessServiceService.oldBusinessService;

      this.serviceElementsOfMonthlyPaymentType = this.businessServiceService.serviceElementsOfMonthlyPaymentType;
      this.serviceElementsOfOneTimePaymentType = this.businessServiceService.serviceElementsOfOneTimePaymentType;

      this.oldServiceElementsOfMonthlyPaymentType = this.businessServiceService.oldServiceElementsOfMonthlyPaymentType;
      this.oldServiceElementsOfOneTimePaymentType = this.businessServiceService.oldServiceElementsOfOneTimePaymentType;

      this.parametersOfQualityType = this.businessServiceService.parametersOfQualityType;
      this.parametersOfQuantityType = this.businessServiceService.parametersOfQuantityType;

      this.oldParametersOfQualityType = this.businessServiceService.oldParametersOfQualityType;
      this.oldParametersOfQuantityType = this.businessServiceService.oldParametersOfQuantityType;

      this.formattedStartDatesMonthly = this.businessServiceService.formattedStartDatesMonthly;
      this.formattedEndDatesMonthly = this.businessServiceService.formattedEndDatesMonthly;
      this.formattedStartDatesOneTime = this.businessServiceService.formattedStartDatesOneTime;
      this.formattedEndDatesOneTime = this.businessServiceService.formattedEndDatesOneTime;

      this.businessServiceService.isBusinessServiceSaved = false;
      this.isDataLoaded = true;
    }
    //if clicked Edit Business Service from Home page
    else {
      this.getBusinessService();
      this.serviceElementService.findByBusinessServiceAndPaymentType(this.businessServiceId, PaymentType.MONTHLY).subscribe(resp => {
        this.oldServiceElementsOfMonthlyPaymentType = resp.body;
        this.serviceElementsOfMonthlyPaymentType = JSON.parse(JSON.stringify(this.oldServiceElementsOfMonthlyPaymentType));
        console.log(this.oldServiceElementsOfMonthlyPaymentType);
        console.log(this.serviceElementsOfMonthlyPaymentType);

        this.serviceElementsOfMonthlyPaymentType?.forEach(serviceElement => {
          this.formattedStartDatesMonthly.push(dayjs(serviceElement.startDate!).format('DD.MM.YYYY').toString());
          this.formattedEndDatesMonthly.push(dayjs(serviceElement.endDate!).format('DD.MM.YYYY').toString());
        });
      });

      this.serviceElementService.findByBusinessServiceAndPaymentType(this.businessServiceId, PaymentType.DISPOSABLE).subscribe(resp => {
        this.oldServiceElementsOfOneTimePaymentType = resp.body;
        this.serviceElementsOfOneTimePaymentType = JSON.parse(JSON.stringify(this.oldServiceElementsOfOneTimePaymentType));

        this.serviceElementsOfOneTimePaymentType?.forEach(serviceElement => {
          this.formattedStartDatesOneTime.push(dayjs(serviceElement.startDate!).format('DD.MM.YYYY').toString());
          this.formattedEndDatesOneTime.push(dayjs(serviceElement.endDate!).format('DD.MM.YYYY').toString());
        });
      });

      this.parameterService.findByBusinessServiceIdAndParameterType(this.businessServiceId, ParameterType.QUALITY).subscribe(resp => {
        this.oldParametersOfQualityType = resp.body;
        this.parametersOfQualityType = JSON.parse(JSON.stringify(this.oldParametersOfQualityType));
      });

      this.parameterService.findByBusinessServiceIdAndParameterType(this.businessServiceId, ParameterType.QUANTITY).subscribe(resp => {
        this.oldParametersOfQuantityType = resp.body;
        this.parametersOfQuantityType = JSON.parse(JSON.stringify(this.oldParametersOfQuantityType));
      });
    }

    //receiving new service element
    if (this.serviceElementService.isServiceElementReceived) {
      this.serviceElementSub = this.serviceElementService.toReceive.subscribe(resp => {
        if (this.action === 'ADD') {
          resp.businessService = this.businessService;

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
          this.editedServiceElementIndex = this.businessServiceService.serviceElementIndex;
          if (resp.paymentType === PaymentType.MONTHLY) {
            this.serviceElementsOfMonthlyPaymentType![this.editedServiceElementIndex] = resp;
            this.formattedStartDatesMonthly[this.editedServiceElementIndex] = dayjs(resp.startDate).format('DD.MM.YYYY');
            this.formattedEndDatesMonthly[this.editedServiceElementIndex] = dayjs(resp.endDate).format('DD.MM.YYYY');
            console.log(this.editedServiceElementIndex);
            console.log(this.serviceElementsOfMonthlyPaymentType![this.editedServiceElementIndex]);
          } else if (resp.paymentType === PaymentType.DISPOSABLE) {
            this.serviceElementsOfOneTimePaymentType![this.editedServiceElementIndex] = resp;
            this.formattedStartDatesOneTime[this.editedServiceElementIndex] = dayjs(resp.startDate).format('DD.MM.YYYY');
            this.formattedEndDatesOneTime[this.editedServiceElementIndex] = dayjs(resp.endDate).format('DD.MM.YYYY');
          }
        }

        this.serviceElementService.isServiceElementReceived = false;
      });
    }

    //receiving new parameter
    this.parameterSub = this.parameterService.toReceive.subscribe(resp => {
      resp.businessService = this.businessService;

      if (resp.type === ParameterType.QUALITY) {
        this.parametersOfQualityType?.push(resp);
      } else if (resp.type === ParameterType.QUANTITY) {
        this.parametersOfQuantityType?.push(resp);
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
    this.businessServiceService.find(this.businessServiceId).subscribe(businessService => {
      this.oldBusinessService = businessService.body;
      this.businessService = JSON.parse(JSON.stringify(this.oldBusinessService));
      this.isDataLoaded = true;
    });
  }

  onSelectSection(section: string) {
    this.sectionSelected = section;
  }

  onCancel() {
    this.router.navigate(['/']);
  }

  onEditBusinessService() {
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

    //updating business service
    this.businessServiceService.update(this.businessService!).subscribe();

    //go back to previous page
    this.router.navigate(['/']);
  }

  saveData() {
    this.businessServiceService.oldBusinessService = this.oldBusinessService;
    this.businessServiceService.businessService = this.businessService;

    this.businessServiceService.oldServiceElementsOfMonthlyPaymentType = this.oldServiceElementsOfMonthlyPaymentType;
    this.businessServiceService.oldServiceElementsOfOneTimePaymentType = this.oldServiceElementsOfOneTimePaymentType;

    this.businessServiceService.serviceElementsOfMonthlyPaymentType = this.serviceElementsOfMonthlyPaymentType;
    this.businessServiceService.serviceElementsOfOneTimePaymentType = this.serviceElementsOfOneTimePaymentType;

    this.businessServiceService.oldParametersOfQualityType = this.oldParametersOfQualityType;
    this.businessServiceService.oldParametersOfQuantityType = this.oldParametersOfQuantityType;

    this.businessServiceService.parametersOfQualityType = this.parametersOfQualityType;
    this.businessServiceService.parametersOfQuantityType = this.parametersOfQuantityType;

    this.businessServiceService.formattedStartDatesMonthly = this.formattedStartDatesMonthly;
    this.businessServiceService.formattedEndDatesMonthly = this.formattedEndDatesMonthly;
    this.businessServiceService.formattedStartDatesOneTime = this.formattedStartDatesOneTime;
    this.businessServiceService.formattedEndDatesOneTime = this.formattedEndDatesOneTime;

    this.businessServiceService.isBusinessServiceSaved = true;
  }

  onAddServiceElement(paymentType: PaymentType) {
    this.saveData();
    this.action = 'ADD';
    this.businessServiceService.action = this.action;
    this.router.navigate(['/service-element', 'new'], {
      queryParams: {
        paymentType: paymentType,
        action: this.action,
      },
    });
  }

  onEditServiceElement(serviceElement: IServiceElement, index: number) {
    this.saveData();
    this.businessServiceService.serviceElementIndex = index;
    this.action = 'EDIT';
    this.businessServiceService.action = this.action;

    this.businessServiceService.sendServiceElement(serviceElement);

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
    this.dialogRef.open(ParameterUpdateComponent, {
      data: {
        parameterType: parameterType,
        action: 'ADD',
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

  onEditParameter(parameter: IParameter) {
    this.dialogRef.open(ParameterUpdateComponent, {
      data: {
        parameter: parameter,
        action: 'EDIT',
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
            new Paragraph({
              children: [
                new TextRun('Klient: '),
                new TextRun({
                  text: this.oldBusinessService!.client! ? this.oldBusinessService!.client!.name! : 'nic',
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun('Symbol usługi: '),
                new TextRun({
                  text: this.oldBusinessService! ? this.oldBusinessService!.symbol! : 'nic',
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun('Nazwa usługi: '),
                new TextRun({
                  text: this.oldBusinessService! ? this.oldBusinessService!.name! : 'nic',
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun('Dział: '),
                new TextRun({
                  text: this.oldBusinessService!.department! ? this.oldBusinessService!.department!.name! : 'nic',
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun('Właściciel: '),
                new TextRun({
                  text: this.oldBusinessService!.employee!
                    ? this.oldBusinessService!.employee!.name! + ' ' + this.oldBusinessService!.employee!.surname
                    : 'nic',
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Opis funkcjonalny: ', break: 1 }),
                new TextRun({
                  text: this.oldBusinessService!.functionalDescription! ? this.oldBusinessService!.functionalDescription! : 'nic',
                  bold: true,
                  break: 1,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun('Wykluczenia: '),
                new TextRun({
                  text: this.oldBusinessService!.exclusions! ? this.oldBusinessService!.exclusions! : 'nic',
                  bold: true,
                  break: 1,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun('Obowiązki i odpowiedzialności stron: '),
                new TextRun({
                  text: this.oldBusinessService!.dutiesAndResponsibilities ? this.oldBusinessService!.dutiesAndResponsibilities : 'nic',
                  bold: true,
                  break: 1,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun('Osoba odpowiedzialna za usługę po stronie Zamawiającego: '),
                new TextRun({
                  text: this.oldBusinessService!.personResponsibleForService ? this.oldBusinessService!.personResponsibleForService : 'nic',
                  bold: true,
                  break: 1,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun('Godziny gwarantowanego świadczenia usługi: '),
                new TextRun({
                  text: this.oldBusinessService!.hoursOfService ? this.oldBusinessService!.hoursOfService : 'nic',
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
                  text: this.oldBusinessService!.serviceActivatingCost ? this.oldBusinessService!.serviceActivatingCost : 'nic',
                  bold: true,
                  break: 1,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun('Cennik usługi: '),
                new TextRun({
                  text: this.oldBusinessService!.priceListOfService ? this.oldBusinessService!.priceListOfService : 'nic',
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
                  text: this.oldBusinessService!.notes ? this.oldBusinessService!.notes : 'nic',
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
      saveAs(blob, this.businessService?.symbol + '.docx');
      console.log('Document created successfully');
    });
  }
}
