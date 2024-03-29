import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentAddComponent } from './department-add.component';

describe('DepartmentAddComponentComponent', () => {
  let component: DepartmentAddComponent;
  let fixture: ComponentFixture<DepartmentAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DepartmentAddComponent],
    });
    fixture = TestBed.createComponent(DepartmentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
