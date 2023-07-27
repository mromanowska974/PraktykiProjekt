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
import { MatDialog } from '@angular/material/dialog';
import { InternalServiceAddExistingComponent } from 'app/entities/internal-service/add-existing/internal-service-add-existing.component';
import { ClickedButtonFrom } from 'app/entities/enumerations/clicked-button-from.model';

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
  isAddingBSButtonClicked: boolean = false;
  isAddingISButtonClicked: boolean = false;
  selectedBusinessService?: BusinessService | null;

  constructor(private clientService: ClientService, private router: Router, private dialogRef: MatDialog) {}

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
      this.isAddingBSButtonClicked = true;
    }
  }

  onLoadAddNewInternalService() {
    if (this.selectedBusinessService) {
      this.router.navigate(['/internal-service', 'add', this.selectedBusinessService!.id]);
    } else {
      console.log('nie ma ub');
      this.isAddingISButtonClicked = true;
    }
  }

  onAddExistingInternalService() {
    if (this.selectedBusinessService) {
      //this.router.navigate(['/internal-service', 'add', this.selectedBusinessService!.id]);
      this.dialogRef.open(InternalServiceAddExistingComponent, {
        data: {
          clickedButtonFrom: ClickedButtonFrom.HOME_PAGE,
          businessService: this.selectedBusinessService,
        },
      });
    } else {
      console.log('nie ma ub');
      this.isAddingISButtonClicked = true;
    }
  }

  onClientSelected(client: IClient) {
    this.isDefaultValueSelected = false;
    this.isAddingBSButtonClicked = false;
    this.isAddingISButtonClicked = false;
    this.selectedClient = client;
    this.selectedBusinessService = undefined;
  }

  onSelectedDefaultValue() {
    this.isDefaultValueSelected = true;
    this.isAddingBSButtonClicked = false;
    this.selectedClient = null;
  }

  onBusinessServiceSelected(event: BusinessService) {
    this.selectedBusinessService = event;
  }
}
