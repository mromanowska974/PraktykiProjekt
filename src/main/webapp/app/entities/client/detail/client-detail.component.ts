import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IClient } from '../client.model';
import { ClientService } from '../service/client.service';
import { ClientUpdateComponent } from '../update/client-update.component';
import { MatDialog } from '@angular/material/dialog';
import { BusinessService } from 'app/entities/business-service/business-service.model';
import { BusinessServiceService } from 'app/entities/business-service/service/business-service.service';

@Component({
  standalone: true,
  selector: 'jhi-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.css'],
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ClientDetailComponent implements OnInit {
  clients: IClient[] | null = null;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected clientService: ClientService,
    protected dialog: MatDialog,
    protected businessServiceService: BusinessServiceService
  ) {}

  ngOnInit(): void {
    this.clientService.query().subscribe(resp => {
      this.clients = resp.body;
    });
  }
  onEdit(client: IClient) {
    this.dialog.open(ClientUpdateComponent, {
      data: {
        action: 'EDIT',
        client: client,
      },
    });
  }

  onDelete(client: IClient) {
    if (confirm('Czy na pewno chcesz usunąć wybraną spółkę?')) {
      this.businessServiceService.findByClient(client.id).subscribe(resp => {
        if (resp.body?.length === 0) {
          this.clientService.delete(client.id).subscribe(() => {
            window.location.reload();
          });
        } else {
          confirm('Nie można usunąć wybranej spółki, ponieważ jest powiązana z co najmniej jedną Usługą Biznesową.');
        }
      });
    }
  }
}
