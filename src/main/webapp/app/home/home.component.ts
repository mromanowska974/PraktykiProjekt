import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { BusinessServiceComponent } from 'app/entities/business-service/list/business-service.component';
import { InternalServiceComponent } from 'app/entities/internal-service/list/internal-service.component';
import { IClient, NewClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';

@Component({
  standalone: true,
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [SharedModule, RouterModule, BusinessServiceComponent, InternalServiceComponent],
})
export default class HomeComponent implements OnInit {
  clients: IClient[] | null;
  selectedClient: IClient;
  isDefaultValueSelected: boolean = false;

  constructor(private clientService: ClientService, private router: Router) {}

  ngOnInit(): void {
    this.clientService.query().subscribe(clients => {
      this.clients = clients.body;
    });
  }

  onAddNewBusinessService(client: IClient) {
    var queryString = Object.keys(client)
      .map(key => key + '=' + client[key])
      .join('&');
    this.router.navigate(['/new'], {
      queryParams: { client: queryString },
    });
  }

  onLoadAddNewInternalService() {
    this.router.navigate(['/internal-service', 'add']);
  }

  onClientSelected(client: IClient) {
    this.isDefaultValueSelected = false;
    this.selectedClient = client;
  }

  onSelectedDefaultValue() {
    this.isDefaultValueSelected = true;
  }
}
