import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, UserService } from '@client/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {CustomValidationService, RequestHandlerService} from '@client/core';
@Component({
  selector: 'my-chat-app-reset-password',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule,MatInputModule,MatIconModule,ReactiveFormsModule,FormsModule,MatButtonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly customValidation = inject(CustomValidationService);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly destroy$: any = new Subject();
  private readonly snackBar = inject(MatSnackBar);
  private readonly requestHandler = inject(RequestHandlerService);
  private readonly router = inject(Router);
  resetForm!: FormGroup;
  matchValidator = (control : any) => {
    return this.customValidation.MatchValidator(control,"password",'confirmPassword');
  }


  constructor(){
    this.resetForm = this.formBuilder.group({
      id : [Validators.required],
      username : ['',Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(15)])],
      password : ['',Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(32)])],
      confirmPassword : ['',Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(32)])]
    },{
      validators : this.matchValidator
    });
  }

  ngOnInit(){
    this.authService.$user.pipe(takeUntil(this.destroy$)).subscribe((user:any)=>{
      this.resetForm.patchValue({
        id : user?.id,
        username : user?.username
      });
    })
  }


  get f(){
    return (this.resetForm as FormGroup)?.controls;
  }

  send(){
    if(!this.resetForm.valid){
      return;
    }
      this.userService.resetPassword(this.resetForm.getRawValue())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data:any) => {
          const {message,options} = this.requestHandler.responseHandler(data?.message,data?.success);
          this.snackBar.open(message,'Close',options);
          this.router.navigate(['/'])
        },
        error: (err:any) => {
          console.log(err);
        },
      });
  }


  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }
}
