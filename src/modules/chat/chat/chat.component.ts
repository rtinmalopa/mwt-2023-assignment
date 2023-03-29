import { Component } from '@angular/core';
import { MessageService } from 'src/services/message.service';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  nick = '';

  constructor(private chatService: ChatService, private messageService: MessageService){}

  onConnect() {
    this.chatService.connect().subscribe(isConnected => {
      if(isConnected) {
        this.chatService.sendNickName(this.nick);
      } else {
        this.messageService.errorMessage("Server not available");
      }
    });
  }
}
