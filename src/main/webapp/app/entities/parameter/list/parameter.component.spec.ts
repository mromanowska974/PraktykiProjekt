import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ParameterService } from '../service/parameter.service';

import { ParameterComponent } from './parameter.component';

describe('Parameter Management Component', () => {
  let comp: ParameterComponent;
  let fixture: ComponentFixture<ParameterComponent>;
  let service: ParameterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'parameter', component: ParameterComponent }]),
        HttpClientTestingModule,
        ParameterComponent,
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
      .overrideTemplate(ParameterComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParameterComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ParameterService);

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
    expect(comp.parameters?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to parameterService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getParameterIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getParameterIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
