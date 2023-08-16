import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IClient } from '../client.model';
import { ClientService } from '../service/client.service';
import { ClientUpdateComponent } from '../update/client-update.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'jhi-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.css'],
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ClientDetailComponent implements OnInit {
  clients: IClient[] | null = null;

  constructor(protected activatedRoute: ActivatedRoute, protected clientService: ClientService, protected dialog: MatDialog) {}

  ngOnInit(): void {
    this.clientService.query().subscribe(resp => {
      this.clients = resp.body;
    });
  }
  onEdit() {
    this.dialog.open(ClientUpdateComponent, {
      data: {
        action: 'EDIT',
      },
    });
  }

  onDelete(client: IClient) {
    if (confirm('Czy na pewno chcesz usunąć wybranego pracownika?')) {
      this.clientService.delete(client.id).subscribe(() => {
        window.location.reload();
      });
    }
  }
}
