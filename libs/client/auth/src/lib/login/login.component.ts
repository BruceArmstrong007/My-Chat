import { RequestHandlerService } from '@client/core';
import { Router } from '@angular/router';
import { AuthService } from '@client/core';
import { ChangeDetectionStrategy, Component, inject, DestroyRef, WritableSignal, signal } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'my-chat-app-login',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  formBuilder = inject(FormBuilder);
  requestHandler = inject(RequestHandlerService);
  hide : WritableSignal<boolean> = signal(true);
  loginForm: FormGroup = this.formBuilder.group({
    username : ['',Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(15)])],
    password : ['',Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(32)])]
  });
    router = inject(Router);
    authService = inject(AuthService);
    destroyRef = inject(DestroyRef);


  send(){
    if(!this.loginForm.valid){
      return;
    }
    const formValue = this.loginForm.getRawValue();

    this.authService
      .login({ username: formValue.username, password: formValue.password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response:any) => {
          if(response.data.id){
            this.router.navigateByUrl('/user');
            return;
          }
        },
        error: (err:any) => {
          console.log(err);
        },
      });
  }

  get f(){
    return (this.loginForm as FormGroup).controls;
  }

  toggleVisibility(){
    this.hide.update((value: boolean)=> !value);
  }

}
