import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalServiceAddExistingComponent } from './internal-service-add-existing.component';

describe('InternalServiceAddExistingComponent', () => {
  let component: InternalServiceAddExistingComponent;
  let fixture: ComponentFixture<InternalServiceAddExistingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InternalServiceAddExistingComponent],
    });
    fixture = TestBed.createComponent(InternalServiceAddExistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
