import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CumulativeEditPageComponent } from './cumulative-edit-page.component';

describe('CumulativeEditPageComponent', () => {
  let component: CumulativeEditPageComponent;
  let fixture: ComponentFixture<CumulativeEditPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CumulativeEditPageComponent],
    });
    fixture = TestBed.createComponent(CumulativeEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
