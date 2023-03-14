import { Component, inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';
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
                                                   Validators.minLength(3)],
                                      asyncValidators: this.userConflictsValidator('name')}),
    email: new FormControl('',[Validators.required, 
                               Validators.email,
                               Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$")],
                              this.userConflictsValidator('email')),
    password: new FormControl('', this.passwordValidator),
    password2: new FormControl('')
  }, this.passwordsMatchValidator);

  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const passwordModel = control.get('password');
    const password2Model = control.get('password2');
    if (passwordModel?.value === password2Model?.value) {
      password2Model?.setErrors(null);
      return null;
    } else {
      const error = {'differentPasswords': 'Passwords do not match'};
      password2Model?.setErrors(error);
      return error;
    }
  }

  userConflictsValidator(field: 'name'|'email'): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const name = field === 'name' ? control.value : '';
      const email= field === 'email' ? control.value : '';
      const user = new User(name, email);
      return this.usersService.userConflicts(user).pipe(
        map( arrayConflicts => {
          if (arrayConflicts.length === 0) return null;
          return { serverConflict: field + ' already present on server'}
        })
      )
    }
  }

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
