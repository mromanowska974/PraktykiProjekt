import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ParameterDetailComponent } from './parameter-detail.component';

describe('Parameter Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParameterDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ParameterDetailComponent,
              resolve: { parameter: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(ParameterDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load parameter on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ParameterDetailComponent);

      // THEN
      expect(instance.parameter).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
