import { Component, ElementRef, Inject, OnInit, QueryList, ViewChild } from '@angular/core';
import { Orange3dButtonDirective } from 'app/directives/orange3d-button/orange3d-button.directive';
import { IDepartment } from '../department.model';
import { DepartmentService } from '../service/department.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IServiceElementVerificationInfo } from 'app/entities/service-element-verification-info/service-element-verification-info.model';

@Component({
  standalone: true,
  selector: 'jhi-department-add-component',
  templateUrl: './department-add.component.html',
  styleUrls: ['./department-add.component.scss'],
  imports: [Orange3dButtonDirective, CommonModule, FormsModule],
})
export class DepartmentAddComponent implements OnInit {
  departments: IDepartment[] = [];
  isLeadingDepartmentSelected: boolean;
  leadingDepartmentIndex: number;
  checkedDepartmentsIndexes: number[] = [];
  leadingDepartment: IDepartment = {} as IDepartment;
  previousElement: IDepartment;
  selectedDepartments: IDepartment[] = [];
  isSaveBtnClicked: boolean = false;

  verificationInfoElementsToEdit: IServiceElementVerificationInfo[] = [];
  verificationInfoElementToDelete: IServiceElementVerificationInfo[] = [];

  constructor(
    private departmentService: DepartmentService,
    private dialogRef: MatDialogRef<DepartmentAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.departmentService.query().subscribe(result => {
      this.departments = result.body!;

      let departments: IDepartment[] = [];
      let leadingDepartment: IDepartment = {} as IDepartment;
      this.data.verificationInfo.forEach(element => {
        departments.push(element.department!);

        if (element.isDepartmentLeading) leadingDepartment = element.department!;
      });

      if (departments.length !== 0) {
        departments.forEach(element => {
          if (element.id === leadingDepartment.id) {
            this.leadingDepartment = leadingDepartment;
            this.previousElement = this.leadingDepartment;

            const foundEl = this.departments.find(el => el.id === element.id);

            this.leadingDepartmentIndex = this.departments.indexOf(foundEl!);
            this.isLeadingDepartmentSelected = true;
          }

          if (departments.find(el => el.id === element.id)) {
            const foundEl = this.departments.find(el => el.id === element.id);
            this.checkedDepartmentsIndexes.push(this.departments.indexOf(foundEl!));
          }
        });

        departments.forEach(element => {
          if (!this.selectedDepartments.find(el => el.id === element.id)) this.selectedDepartments.push(element);
        });
      }
    });
  }

  onRadioItemClick(elementIndex: number) {
    this.verificationInfoElementsToEdit = [];
    this.isLeadingDepartmentSelected = true;
    this.leadingDepartment = this.departments[elementIndex];

    if (!this.selectedDepartments.find(el => el.id === this.leadingDepartment.id)) {
      this.selectedDepartments.push(this.leadingDepartment);
    }
    this.leadingDepartmentIndex = elementIndex;

    const currentLDToCheck = this.data.verificationInfo.find(el => el.department.id === this.leadingDepartment.id);
    const previousLDtToCheck = this.data.verificationInfo.find(el => el.department.id === this.previousElement.id);
    console.log(currentLDToCheck);
    console.log(previousLDtToCheck);

    //if current VI element exists in db
    if (currentLDToCheck && currentLDToCheck.id !== undefined) {
      console.log(currentLDToCheck.id);
      currentLDToCheck.isDepartmentLeading = true;
      this.verificationInfoElementsToEdit.push(currentLDToCheck);
    }
    //if previous VI element exists in db
    if (previousLDtToCheck && previousLDtToCheck.id !== undefined) {
      console.log(previousLDtToCheck.id);
      previousLDtToCheck.isDepartmentLeading = false;
      this.verificationInfoElementsToEdit.push(previousLDtToCheck);
    }

    this.previousElement = this.leadingDepartment;
  }

  onCheckboxItemClick(element: HTMLInputElement, department: IDepartment, index: number) {
    const elementToCheck = this.data.verificationInfo.find(el => el.department.id === this.leadingDepartment.id);
    console.log(elementToCheck);

    //if VI element exists in db
    if (elementToCheck && elementToCheck.id !== undefined) {
      console.log(elementToCheck.id);
    }
    //if VI element doesn't exist in db
    else {
      console.log('nie ma id');
    }

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
      console.log(this.selectedDepartments);
      console.log(this.leadingDepartment);
      console.log(this.verificationInfoElementsToEdit);

      this.dialogRef.close({
        selectedDepartments: this.selectedDepartments,
        leadingDepartment: this.leadingDepartment,
        verificationInfoElementsToEdit: this.verificationInfoElementsToEdit,
        verificationInfoElementToDelete: [],
      });
    } else {
      this.isSaveBtnClicked = true;
    }
  }
}
