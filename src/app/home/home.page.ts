import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Network} from '@ionic-native/network/ngx';
import {GlobalConstants} from '../globalConstants';
import {AlertController} from '@ionic/angular';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {StoredRequest} from '../core/shared/storedRequest';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  randomNumbers: number[] = [];
  constructor(private httpClient: HttpClient,
              public network: Network,
              public alertController: AlertController,
              public nativeStorage: NativeStorage) {
    this.network.onConnect().subscribe(() => {
      this.nativeStorage.getItem('numberRequests').then((data) => {
        for (const item of data) {
          this.httpClient.get(item.url).subscribe((response) => {
            this.randomNumbers.push(Number(response));
          });
        }
        this.nativeStorage.remove('numberRequests');
      }, (error) => {
      });
    });
  }

  async getRandomNumber() {
    if (GlobalConstants.connectionEstablished) {
      this.httpClient.get('https://www.random.org/integers/?num=1&min=1&max=6&col=1&base=10&format=plain&rnd=new').subscribe((data) => {
          this.randomNumbers.push(Number(data));
        },
        (error) => console.log(error));
    } else {
      let requests: StoredRequest[] = [];
      this.nativeStorage.getItem('numberRequests').then((data) => {
        requests = data;
        requests.push(new StoredRequest('get', 'https://www.random.org/integers/?num=1&min=1&max=6&col=1&base=10&format=plain&rnd=new'));
        this.nativeStorage.setItem('numberRequests', requests);
        // eslint-disable-next-line @typescript-eslint/no-shadow
      }, (error) => {
        if (error.code === 2){
          requests.push(new StoredRequest('get', 'https://www.random.org/integers/?num=1&min=1&max=6&col=1&base=10&format=plain&rnd=new'));
          this.nativeStorage.setItem('numberRequests', requests);
        }
      });
      this.alertController.create({
        header: 'We saved your request',
        buttons: ['OK']
      }).then(res => {
        res.present();
      });
    }
  }
}
