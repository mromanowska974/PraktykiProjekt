import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { InternalServiceDetailComponent } from './internal-service-detail.component';

describe('InternalService Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternalServiceDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: InternalServiceDetailComponent,
              resolve: { internalService: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(InternalServiceDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load internalService on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', InternalServiceDetailComponent);

      // THEN
      expect(instance.internalService).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
