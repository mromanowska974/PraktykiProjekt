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
import { BusinessService } from 'app/entities/business-service/business-service.model';

@Component({
  standalone: true,
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [SharedModule, RouterModule, BusinessServiceComponent, InternalServiceComponent],
})
export default class HomeComponent implements OnInit {
  clients: IClient[] | null;
  selectedClient: IClient | null;
  isDefaultValueSelected: boolean = true;
  isAddingButtonClicked: boolean = false;
  selectedBusinessService?: BusinessService | null;

  constructor(private clientService: ClientService, private router: Router) {}

  ngOnInit(): void {
    this.clientService.query().subscribe(clients => {
      this.clients = clients.body;
    });
  }

  onAddNewBusinessService(client?: IClient) {
    if (client) {
      var queryString = Object.keys(client)
        .map(key => key + '=' + client[key])
        .join('&');
      this.router.navigate(['/new'], {
        queryParams: { client: queryString },
      });
    } else {
      this.isAddingButtonClicked = true;
      console.log('domyslna wartosc');
    }
  }

  onLoadAddNewInternalService() {
    this.router.navigate(['/internal-service', 'add', this.selectedBusinessService!.id]);
  }

  onClientSelected(client: IClient) {
    this.isDefaultValueSelected = false;
    this.isAddingButtonClicked = false;
    this.selectedClient = client;
  }

  onSelectedDefaultValue() {
    this.isDefaultValueSelected = true;
    this.isAddingButtonClicked = false;
    this.selectedClient = null;
  }

  onBusinessServiceSelected(event: BusinessService) {
    this.selectedBusinessService = event;
  }
}
