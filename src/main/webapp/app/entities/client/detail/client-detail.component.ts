import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IClient } from '../client.model';
import { ClientService } from '../service/client.service';

@Component({
  standalone: true,
  selector: 'jhi-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.css'],
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ClientDetailComponent implements OnInit {
  clients: IClient[] | null = null;

  constructor(protected activatedRoute: ActivatedRoute, protected clientService: ClientService) {}

  ngOnInit(): void {
    this.clientService.query().subscribe(resp => {
      this.clients = resp.body;
    });
  }
}
