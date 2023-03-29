import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Client, over } from 'stompjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  url = environment.websocket_url;
  socket?: WebSocket;
  stompClient?: Client;

  constructor() { }

  connect(): Observable<boolean> {
    return new Observable(subscriber => {
      this.socket = new WebSocket(this.url);
      this.stompClient = over(this.socket);
      this.stompClient.connect({},frame => subscriber.next(true), 
                                  error => subscriber.next(false));
    });
  }

  sendNickName(nick: string) {
//    this.stompClient?.send('/app/hello', {}, JSON.stringify({name: nick}));
//    this.stompClient?.send('/app/hello', {}, `{"name": "${nick}"}`);
    this.stompClient?.send('/app/hello', {}, '{"name": "' + nick + '"}');
  }
}
