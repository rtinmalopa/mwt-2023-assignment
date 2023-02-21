import { Component } from '@angular/core';
import { User } from 'src/entities/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  users: User[] = [
    new User('Alica','alica@alica.sk'),
    new User('Bob', 'bobik@kubik.sk', 1, new Date(),'tajne'),
    {name:'Cyril', email:'cylinder@post.sk', password:'cyriloveHeslo',
     toString: () => 'name: Cyril' }];
}
