import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BusinessServiceService } from '../service/business-service.service';

import { BusinessServiceComponent } from './business-service.component';

describe('BusinessService Management Component', () => {
  let comp: BusinessServiceComponent;
  let fixture: ComponentFixture<BusinessServiceComponent>;
  let service: BusinessServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'business-service', component: BusinessServiceComponent }]),
        HttpClientTestingModule,
        BusinessServiceComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(BusinessServiceComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BusinessServiceComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BusinessServiceService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.businessServices?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to businessServiceService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getBusinessServiceIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getBusinessServiceIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
