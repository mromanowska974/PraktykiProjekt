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
  leadingDepartment: IDepartment = {} as IDepartment;
  previousElement: IDepartment;
  selectedDepartments: IDepartment[] = [];
  isSaveBtnClicked: boolean = false;

  constructor(private departmentService: DepartmentService, private dialogRef: MatDialogRef<DepartmentAddComponent>) {}

  ngOnInit(): void {
    this.departmentService.query().subscribe(resp => {
      this.departments = resp.body!;
    });
  }

  onRadioItemClick(elementIndex: number) {
    this.isLeadingDepartmentSelected = true;
    if (!this.selectedDepartments.find(el => el === this.leadingDepartment)) {
      this.selectedDepartments.push(this.leadingDepartment);
    }
    this.leadingDepartmentIndex = elementIndex;
    if (this.previousElement) this.selectedDepartments.splice(this.selectedDepartments.indexOf(this.previousElement), 1);

    this.previousElement = this.leadingDepartment;
  }

  onCheckboxItemClick(el: HTMLInputElement, department: IDepartment) {
    if (el.checked) {
      this.selectedDepartments.push(department);
    } else {
      this.selectedDepartments.splice(this.selectedDepartments.indexOf(department), 1);
    }
  }

  onSave() {
    if (this.isLeadingDepartmentSelected) {
      this.departmentService.sendDepartmentList(this.selectedDepartments);
      this.departmentService.sendLeadingDepartment(this.leadingDepartment);
      this.dialogRef.close();
    } else {
      this.isSaveBtnClicked = true;
    }
  }
}
