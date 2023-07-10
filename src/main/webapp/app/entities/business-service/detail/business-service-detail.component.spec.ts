import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BusinessServiceDetailComponent } from './business-service-detail.component';

describe('BusinessService Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessServiceDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: BusinessServiceDetailComponent,
              resolve: { businessService: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(BusinessServiceDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load businessService on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', BusinessServiceDetailComponent);

      // THEN
      expect(instance.businessService).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
