import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ServiceElementVerificationInfoService } from '../service/service-element-verification-info.service';

import { ServiceElementVerificationInfoComponent } from './service-element-verification-info.component';

describe('ServiceElementVerificationInfo Management Component', () => {
  let comp: ServiceElementVerificationInfoComponent;
  let fixture: ComponentFixture<ServiceElementVerificationInfoComponent>;
  let service: ServiceElementVerificationInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'service-element-verification-info', component: ServiceElementVerificationInfoComponent }]),
        HttpClientTestingModule,
        ServiceElementVerificationInfoComponent,
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
      .overrideTemplate(ServiceElementVerificationInfoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ServiceElementVerificationInfoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ServiceElementVerificationInfoService);

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
    expect(comp.serviceElementVerificationInfos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to serviceElementVerificationInfoService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getServiceElementVerificationInfoIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getServiceElementVerificationInfoIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
