import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ExternalCompanyDetailComponent } from './external-company-detail.component';

describe('ExternalCompany Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalCompanyDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ExternalCompanyDetailComponent,
              resolve: { externalCompany: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(ExternalCompanyDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load externalCompany on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ExternalCompanyDetailComponent);

      // THEN
      expect(instance.externalCompany).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
