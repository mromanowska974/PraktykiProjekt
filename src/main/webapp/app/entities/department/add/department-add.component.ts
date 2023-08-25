import { Component, ElementRef, OnInit, QueryList, ViewChild } from '@angular/core';
import { Orange3dButtonDirective } from 'app/directives/orange3d-button/orange3d-button.directive';
import { IDepartment } from '../department.model';
import { DepartmentService } from '../service/department.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'jhi-department-add-component',
  templateUrl: './department-add.component.html',
  styleUrls: ['./department-add.component.scss'],
  imports: [Orange3dButtonDirective, CommonModule, FormsModule],
})
export class DepartmentAddComponent implements OnInit {
  departments: IDepartment[] = [];
  isLeadingDepartmentSelected: boolean = false;
  leadingDepartmentIndex: number;
  checkedDepartmentsIndexes: number[] = [];
  leadingDepartment: IDepartment = {} as IDepartment;
  previousElement: IDepartment;
  selectedDepartments: IDepartment[] = [];
  isSaveBtnClicked: boolean = false;

  constructor(private departmentService: DepartmentService, private dialogRef: MatDialogRef<DepartmentAddComponent>) {}

  ngOnInit(): void {
    this.departmentService.query().subscribe(resp => {
      this.departments = resp.body!;

      this.departmentService.dataToReceive.subscribe(res => {
        if (res.departments.length !== 0) {
          this.departments.forEach(element => {
            if (JSON.stringify(element) === JSON.stringify(res.leadingDepartment)) {
              this.leadingDepartment = res.leadingDepartment;
              this.previousElement = this.leadingDepartment;
              this.leadingDepartmentIndex = this.departments.indexOf(element);
              this.isLeadingDepartmentSelected = true;
            }

            if (res.departments.find(el => JSON.stringify(el) === JSON.stringify(element))) {
              this.checkedDepartmentsIndexes.push(this.departments.indexOf(element));
            }
          });

          res.departments.forEach(element => {
            if (!this.selectedDepartments.find(el => JSON.stringify(el) === JSON.stringify(element)))
              this.selectedDepartments.push(element);
            console.log(element);
          });
        }
      });
    });
  }

  onRadioItemClick(elementIndex: number) {
    this.isLeadingDepartmentSelected = true;
    this.leadingDepartment = this.departments[elementIndex];
    if (!this.selectedDepartments.find(el => JSON.stringify(el) === JSON.stringify(this.leadingDepartment))) {
      this.selectedDepartments.push(this.leadingDepartment);
      console.log(this.selectedDepartments);
    }
    this.leadingDepartmentIndex = elementIndex;

    this.previousElement = this.leadingDepartment;
  }

  onCheckboxItemClick(element: HTMLInputElement, department: IDepartment, index: number) {
    if (element.checked) {
      if (!this.selectedDepartments.find(el => JSON.stringify(el) === JSON.stringify(department))) {
        this.selectedDepartments.push(department);
      }
    } else {
      let uncheckedEl = this.selectedDepartments.find(el => JSON.stringify(el) === JSON.stringify(department));
      if (uncheckedEl) {
        this.selectedDepartments.splice(this.selectedDepartments.indexOf(uncheckedEl), 1);
        if (index === this.leadingDepartmentIndex) this.isLeadingDepartmentSelected = false;
      }
    }
  }

  onSave() {
    if (this.isLeadingDepartmentSelected) {
      this.departmentService.sendData(this.selectedDepartments, this.leadingDepartment);
      this.dialogRef.close();
    } else {
      this.isSaveBtnClicked = true;
    }
  }
}
