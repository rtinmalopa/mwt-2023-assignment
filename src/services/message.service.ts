import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  defaultDuration = 3000;

  constructor(private snackBar: MatSnackBar) { }

  successMessage(msg: string, duration = this.defaultDuration) {
    this.snackBar.open(msg, 'SUCCESS', {duration, panelClass: "successSnackBar"});
  }

  errorMessage(msg: string, duration = this.defaultDuration) {
    this.snackBar.open(msg, 'ERROR', {duration, panelClass: "errorSnackBar"});
  }
}
