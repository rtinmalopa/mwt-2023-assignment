import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Group } from 'src/entities/group';

@Component({
  selector: 'app-group-edit-child',
  templateUrl: './group-edit-child.component.html',
  styleUrls: ['./group-edit-child.component.css']
})
export class GroupEditChildComponent implements OnChanges{
  @Input('editingGroup') group?: Group;
  @Output() save = new EventEmitter<Group>();
  name = '';
  permString = '';

  ngOnChanges(changes: SimpleChanges): void {
    this.name = this.group?.name || '';
    this.permString = this.group?.permissions.join(', ') || '';
  }
  onSubmit(){
    const perms = this.permString.split(',').map(p => p.trim()).filter(p => p !== '');
    const g = new Group(this.name, perms, this.group?.id);
    this.save.emit(g);
  }
}
