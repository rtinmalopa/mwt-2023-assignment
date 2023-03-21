import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/services/users.service';
import { map, Observable, of, catchError, EMPTY, Subscriber, tap } from 'rxjs';
import { Group } from 'src/entities/group';


@Component({
  selector: 'app-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.css']
})
export class GroupsListComponent implements OnInit{
  
  groups$?: Observable<Group[]>;

  constructor(private usersService: UsersService){}
  
  ngOnInit(): void {
    this.groups$ = this.usersService.getGroups();
  }
}
