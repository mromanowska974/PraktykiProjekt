import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ServiceElementService } from '../service/service-element.service';

import { ServiceElementComponent } from './service-element.component';

describe('ServiceElement Management Component', () => {
  let comp: ServiceElementComponent;
  let fixture: ComponentFixture<ServiceElementComponent>;
  let service: ServiceElementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'service-element', component: ServiceElementComponent }]),
        HttpClientTestingModule,
        ServiceElementComponent,
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
      .overrideTemplate(ServiceElementComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ServiceElementComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ServiceElementService);

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
    expect(comp.serviceElements?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to serviceElementService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getServiceElementIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getServiceElementIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
