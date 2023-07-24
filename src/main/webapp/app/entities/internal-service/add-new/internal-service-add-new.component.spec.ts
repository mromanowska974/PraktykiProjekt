import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalServiceAddNewComponent } from './internal-service-add-new.component';

describe('InternalServiceAddNewComponent', () => {
  let component: InternalServiceAddNewComponent;
  let fixture: ComponentFixture<InternalServiceAddNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InternalServiceAddNewComponent],
    });
    fixture = TestBed.createComponent(InternalServiceAddNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
