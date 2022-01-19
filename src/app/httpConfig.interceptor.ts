import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { EMPTY } from 'rxjs';
import {Network} from '@ionic-native/network/ngx';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {StoredRequest} from './core/shared/storedRequest';
import {GlobalConstants} from './globalConstants';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

  constructor(public nativeStorage: NativeStorage) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!GlobalConstants.connectionEstablished){
     let requests: StoredRequest[] = [];
      this.nativeStorage.getItem('requests').then((data) => {
        requests = data;
        requests.push(new StoredRequest(request.method, request.url));
        this.nativeStorage.setItem('requests', requests);
        // eslint-disable-next-line @typescript-eslint/no-shadow
      }, (error) => {
        if (error.code === 2){
          requests.push(new StoredRequest(request.method, request.url));
          this.nativeStorage.setItem('requests', requests);
        }
      });
      return EMPTY;
    }
    return next.handle(request);
  }
}
