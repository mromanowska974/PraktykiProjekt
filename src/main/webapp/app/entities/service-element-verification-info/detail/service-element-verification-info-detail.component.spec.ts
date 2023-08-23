import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ServiceElementVerificationInfoDetailComponent } from './service-element-verification-info-detail.component';

describe('ServiceElementVerificationInfo Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceElementVerificationInfoDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ServiceElementVerificationInfoDetailComponent,
              resolve: { serviceElementVerificationInfo: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(ServiceElementVerificationInfoDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load serviceElementVerificationInfo on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ServiceElementVerificationInfoDetailComponent);

      // THEN
      expect(instance.serviceElementVerificationInfo).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
