import {Injectable} from '@angular/core';
import {Network} from '@ionic-native/network/ngx';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import {GlobalConstants} from './globalConstants';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {HttpClient} from '@angular/common/http';
import {ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  constructor(public network: Network,
              public dialog: Dialogs,
              public nativeStorage: NativeStorage,
              public httpClient: HttpClient,
              public toastController: ToastController) {
    this.network.onDisconnect().subscribe(() => {
      GlobalConstants.connectionEstablished = false;
      this.toastController.create({
        message: 'Network Disconnected',
        duration: 3000,
        position: 'top',
        cssClass: "text-center"
      }).then((obj) => obj.present());
    });
    this.network.onConnect().subscribe(() => {
      if (!GlobalConstants.connectionEstablished) {
        GlobalConstants.connectionEstablished = true;
        this.toastController.create({
          message: 'Network Connected',
          duration: 3000,
          position: 'top',
          cssClass: "text-center"
        }).then((obj) => obj.present());
        this.nativeStorage.getItem('requests').then((data) => {
          /*
          for (const item of data) {
            this.httpClient.get<Ip>(item.url).subscribe(async (response) => {
            });
          }
           */
          this.nativeStorage.remove('requests');
        }, (error) => {
        });
      }
    });
  }
}
