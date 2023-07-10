import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { InternalServiceService } from '../service/internal-service.service';

import { InternalServiceComponent } from './internal-service.component';

describe('InternalService Management Component', () => {
  let comp: InternalServiceComponent;
  let fixture: ComponentFixture<InternalServiceComponent>;
  let service: InternalServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'internal-service', component: InternalServiceComponent }]),
        HttpClientTestingModule,
        InternalServiceComponent,
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
      .overrideTemplate(InternalServiceComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InternalServiceComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(InternalServiceService);

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
    expect(comp.internalServices?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to internalServiceService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getInternalServiceIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getInternalServiceIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
