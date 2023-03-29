import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MessageService } from 'src/services/message.service';
import { ChatMessage, ChatService } from '../chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnDestroy {
  nick = '';
  messages: ChatMessage[] = [];
  messageToSend = '';
  connected = false;
  connectSubscription?: Subscription;
  @ViewChild('messageInput') messageInput? : ElementRef;

  constructor(private chatService: ChatService, private messageService: MessageService){}

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }
  
  onConnect() {
    this.connectSubscription = 
      this.chatService.connect().subscribe(isConnected => {
        if(isConnected) {
          this.connected = true;
          this.chatService.listenGreetings().subscribe(greeting =>{
            this.messages = [...this.messages, {name: 'SERVER', message: greeting}];
          });
          this.chatService.listenMessages().subscribe(msg =>{
            this.messages = [...this.messages, msg];
          });
          this.chatService.sendNickName(this.nick);
          setTimeout(()=>this.messageInput?.nativeElement.focus(),0);
        } else {
          this.messageService.errorMessage("Server not available");
        }
      });
  }

  onSend() {
    this.chatService.sendMessage(this.messageToSend);
    this.messageToSend = '';
    this.messageInput?.nativeElement.focus();
  }

  onDisconnect() {
    this.connectSubscription?.unsubscribe();
    this.connected = false;
  }
}
