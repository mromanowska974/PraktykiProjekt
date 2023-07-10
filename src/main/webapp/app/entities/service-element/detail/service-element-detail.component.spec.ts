import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ServiceElementDetailComponent } from './service-element-detail.component';

describe('ServiceElement Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceElementDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ServiceElementDetailComponent,
              resolve: { serviceElement: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(ServiceElementDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load serviceElement on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ServiceElementDetailComponent);

      // THEN
      expect(instance.serviceElement).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
