import { Component } from '@angular/core';
import {ConnectionService} from './connection.service';
import {GlobalConstants} from './globalConstants';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(public connectionService: ConnectionService) {
    GlobalConstants.connectionEstablished = 'onLine' in navigator;
  }
}
