import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessServiceEditComponent } from './business-service-edit.component';

describe('BusinessServiceEditComponent', () => {
  let component: BusinessServiceEditComponent;
  let fixture: ComponentFixture<BusinessServiceEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessServiceEditComponent],
    });
    fixture = TestBed.createComponent(BusinessServiceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
