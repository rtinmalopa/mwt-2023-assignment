import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { User } from 'src/entities/user';
import { UsersService } from 'src/services/users.service';
import * as zxcvbn from 'zxcvbn';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  hide = true;
  usersService = inject(UsersService);
  passwordMessage = '';

  passwordValidator = (control: AbstractControl): ValidationErrors | null => {
    const pass = control.value;
    const result = zxcvbn(pass); 
    this.passwordMessage = "Password strength: " + result.score + "/4, crackable in: " + 
                result.crack_times_display.offline_slow_hashing_1e4_per_second;
    return result.score < 3 ? {'weakPassword': this.passwordMessage} : null;
  }

  registerForm = new FormGroup({
    name: new FormControl<string>('',{nonNullable: true,
                                      validators: [Validators.required,
                                                   Validators.minLength(3)]}),
    email: new FormControl('',[Validators.required, 
                               Validators.email,
                               Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$")]),
    password: new FormControl('', this.passwordValidator),
    password2: new FormControl('')
  });



  onSubmit(){
    const user = new User(this.name.value, 
                          this.email.value,
                          undefined,
                          undefined,
                          this.password.value);
    this.usersService.register(user).subscribe();
  }

  printError(fc:FormControl) {
    return JSON.stringify(fc.errors);
  }

  get name(): FormControl<string> {
    return this.registerForm.get('name') as FormControl<string>
  }
  get email(): FormControl<string> {
    return this.registerForm.get('email') as FormControl<string>
  }
  get password(): FormControl<string> {
    return this.registerForm.get('password') as FormControl<string>
  }
  get password2(): FormControl<string> {
    return this.registerForm.get('password2') as FormControl<string>
  }
}
