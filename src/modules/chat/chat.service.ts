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
  nick = '';

  constructor() { }

  connect(): Observable<boolean> {
    return new Observable(subscriber => {
      this.socket = new WebSocket(this.url);
      this.stompClient = over(this.socket);
      this.stompClient.connect({},frame => subscriber.next(true), 
                                  error => subscriber.next(false));
      return () => { // spusti sa ked nastane unsubscribe
        this.disconnect();
      }
    });
  }

  disconnect() {
    this.stompClient?.disconnect(()=>{});
  }

  sendNickName(nick: string) {
//    this.stompClient?.send('/app/hello', {}, JSON.stringify({name: nick}));
//    this.stompClient?.send('/app/hello', {}, `{"name": "${nick}"}`);
    this.stompClient?.send('/app/hello', {}, '{"name": "' + nick + '"}');
    this.nick = nick;
  }

  sendMessage(message: string) {
    this.stompClient?.send('/app/message', {}, JSON.stringify({name: this.nick, message}));
  }

  listenGreetings(): Observable<string> {
    return new Observable(subscriber => {
      this.stompClient?.subscribe('/topic/greetings', 
        resp =>subscriber.next(JSON.parse(resp.body).content)
      );
    });
  }

  listenMessages(): Observable<ChatMessage> {
    return new Observable(subscriber => {
      this.stompClient?.subscribe('/topic/messages', 
        resp =>subscriber.next(JSON.parse(resp.body))
      );
    });
  }
}

export interface ChatMessage {
  name: string;
  message: string;
}