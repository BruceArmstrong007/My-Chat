import { AuthService, RequestHandlerService } from '@client/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject, DestroyRef, signal, WritableSignal } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { CustomValidationService } from '@client/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


type hide = 'hide' | 'confirmHide';
@Component({
  selector: 'my-chat-app-register',
  standalone: true,
  imports: [NgIf,NgClass,MatFormFieldModule,MatInputModule,MatIconModule,ReactiveFormsModule,FormsModule,MatButtonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class RegisterComponent {
  registerForm: FormGroup;
  requestHandler = inject(RequestHandlerService);
  formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly customValidation = inject(CustomValidationService);
  private readonly destroyRef = inject(DestroyRef);
  destroy$ : any = new Subject();
  hide : WritableSignal<boolean> = signal(true);
  confirmHide : WritableSignal<boolean> = signal(true);
  matchValidator = (control : any) => {
    return this.customValidation.MatchValidator(control,"password",'confirmPassword');
  }

  constructor(){
   this.registerForm = this.formBuilder.group({
      username : ['',Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(15)])],
      password : ['',Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(32)])],
      confirmPassword : ['',Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(32)])]
    },{
      validators : this.matchValidator
    });

    this.destroyRef.onDestroy(()=>{
      this.destroy$.unsubscribe();
    });
  }

  send(){
    if(!this.registerForm.valid){
      return;
    }
    this.authService.register(this.registerForm.getRawValue())
    .pipe(takeUntilDestroyed(this.destroy$))
    .subscribe(() => {
        this.router.navigateByUrl('/login');
    });
  }

  get f(){
    return (this.registerForm as FormGroup).controls;
  }

  toggleVisibility(value : hide){
    switch(value){
      case 'hide':
        this.hide.update((value:boolean) => !value);
        break;
      case 'confirmHide':
        this.confirmHide.update((value:boolean) => !value);
        break;
      default:
    }

  }
}
