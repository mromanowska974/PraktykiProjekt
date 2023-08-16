import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClientFormService, ClientFormGroup } from './client-form.service';
import { IClient } from '../client.model';
import { ClientService } from '../service/client.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'jhi-client-update',
  templateUrl: './client-update.component.html',
  styleUrls: ['./client-update.component.css'],
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ClientUpdateComponent implements OnInit {
  client: IClient | null = {} as IClient;
  isNameEntered: boolean = false;
  isSaveBtnClicked: boolean = false;

  constructor(
    protected clientService: ClientService,
    protected clientFormService: ClientFormService,
    protected activatedRoute: ActivatedRoute,
    protected dialogRef: MatDialogRef<ClientUpdateComponent>
  ) {}

  ngOnInit(): void {}

  onSave() {
    this.isNameEntered = this.client!.name !== undefined && this.client!.name!.length > 0 ? true : false;

    if (this.isNameEntered) {
      this.clientService.create(this.client!).subscribe(() => {
        this.dialogRef.close();
        window.location.reload();
      });
    } else {
      this.isSaveBtnClicked = true;
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
