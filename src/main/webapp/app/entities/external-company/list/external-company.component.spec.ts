import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ExternalCompanyService } from '../service/external-company.service';

import { ExternalCompanyComponent } from './external-company.component';

describe('ExternalCompany Management Component', () => {
  let comp: ExternalCompanyComponent;
  let fixture: ComponentFixture<ExternalCompanyComponent>;
  let service: ExternalCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'external-company', component: ExternalCompanyComponent }]),
        HttpClientTestingModule,
        ExternalCompanyComponent,
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
      .overrideTemplate(ExternalCompanyComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExternalCompanyComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ExternalCompanyService);

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
    expect(comp.externalCompanies?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to externalCompanyService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getExternalCompanyIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getExternalCompanyIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
