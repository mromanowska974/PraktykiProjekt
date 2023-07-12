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
  //account: Account | null = null;
  // private readonly destroy$ = new Subject<void>();
  constructor(private clientService: ClientService, private router: Router) {}

  ngOnInit(): void {
    this.clientService.query().subscribe(clients => {
      this.clients = clients.body;
    });
  }
  // login(): void {
  //   this.router.navigate(['/login']);
  // }
  // ngOnDestroy(): void {
  //   this.destroy$.next();
  //   this.destroy$.complete();
  // }

  onAddNewBusinessService(client: String) {
    this.router.navigate(['/new'], {
      queryParams: { client: client },
    });
  }
}
