import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { LoginSignupService } from '../../shared/services/login-signup.service';
import { User } from '../../core/models/object-model';

@Component({
  selector: 'app-signin-signup',
  templateUrl: './signin-signup.component.html',
  styleUrls: ['./signin-signup.component.scss']
})
export class SigninSignupComponent implements OnInit {

  regForm: Boolean = false;
  signUpform: FormGroup;
  signInform: FormGroup;
  signUpsubmitted = false;
  href: String = '';
  user_data;
  user_dto: User;
  user_reg_data;
    existing_email: any = {}
    signInFormValue: any = {};
    existing: Boolean;
    subexist: Boolean;
  constructor(private formBuilder: FormBuilder, private router: Router, private logsign_service: LoginSignupService) { }

  ngOnInit() {
    this.href = this.router.url;
    if (this.href == '/sign-up') {
      this.regForm = true;
    } else if (this.href == '/sign-in') {
      this.regForm = false;
    }
      this.existing = false;
    this.signUpform = this.formBuilder.group({
      name: ['', Validators.required],
      mobNumber: ['', Validators.required],
      age: ['', Validators.required],
      dob: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      addLine1: ['', Validators.required],
        addLine2: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      language: ['English'],
      gender: ['', Validators.required],
      aboutYou: ['', Validators.required],
      uploadPhoto: [''],
      agreetc: ['', Validators.required],
      role: ['buyer'],

    })

    this.signInform = this.formBuilder.group({

    })
  }

  get rf() { return this.signUpform.controls; }

    onSubmitSignUp() {

        this.signUpsubmitted = true;
        if (this.signUpform.invalid) {
            alert("feiyld");
        } else {
           this.user_reg_data = this.signUpform.value;
           this.clickreg(this.user_reg_data.email);
        }
        
       
    }
    submitvalidate() {
        console.log(this.signUpform.value)



        this.user_dto = {
            aboutYou: this.user_reg_data.aboutYou,
            // addLine1: this.user_reg_data.addLine1,
            // addLine2: this.user_reg_data.addLine2,
            age: this.user_reg_data.age,
            agreetc: this.user_reg_data.agreetc,
            // city: this.user_reg_data.city,
            dob: this.user_reg_data.dob,
            email: this.user_reg_data.email,
            gender: this.user_reg_data.gender,
            address: {
                id: 0,
                addLine1: this.user_reg_data.addLine1,
                addLine2: this.user_reg_data.addLine2,
                city: this.user_reg_data.city,
                state: this.user_reg_data.state,
                zipCode: this.user_reg_data.zipCode,
            },
            language: this.user_reg_data.language,
            mobNumber: this.user_reg_data.mobNumber,
            name: this.user_reg_data.name,
            password: this.user_reg_data.password,
            // state: this.user_reg_data.state,
            uploadPhoto: this.user_reg_data.uploadPhoto,
            // zipCode: this.user_reg_data.zipCode,
            role: this.user_reg_data.role
        }
        this.logsign_service.userRegister(this.user_dto).subscribe(data => {
            // console.log(data);
            alert("Success");
            this.router.navigateByUrl('/sign-in');
        }, err => {
            alert("Some Error Occured");
        })
    }
    submitinvalidate() {
        alert("Email already exist");
    }

    onSubmitSignIn() {

    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.signInFormValue));
    this.logsign_service.authLogin(this.signInFormValue.userEmail, this.signInFormValue.userPassword).subscribe(data => {
      this.user_data = data;
      if (this.user_data.length == 1) {
        // alert("Validate")
        if (this.user_data[0].role == "seller") {
          sessionStorage.setItem("user_session_id", this.user_data[0].id);
          sessionStorage.setItem("role", this.user_data[0].role);
            sessionStorage.setItem("user_session_name", this.user_data[0].name);
          this.router.navigateByUrl('/seller-dashboard');
        } else if (this.user_data[0].role == "buyer") {
          sessionStorage.setItem("user_session_id", this.user_data[0].id);
            sessionStorage.setItem("role", this.user_data[0].role);
            sessionStorage.setItem("user_session_name", this.user_data[0].name);
          this.router.navigateByUrl('/buyer-dashboard');
          } else if (this.user_data[0].role == "admin") {
              sessionStorage.setItem("user_session_id", this.user_data[0].id);
            sessionStorage.setItem("role", this.user_data[0].role);
            sessionStorage.setItem("user_session_name", this.user_data[0].name);
              this.router.navigateByUrl('/admin-dashboard');
          } else {
          alert("Invalid-user-role")
        }
      } else {
        alert("Invalid")
      }
      console.log(this.user_data);

    }, error => {
      console.log("My error", error);
    })
    }
    getRegisteredEmail(email) {
         this.user_reg_data = this.signUpform.value;
        this.subexist = true;
        this.logsign_service.verifyemailRegister(email).subscribe(data => {
            this.existing_email = data;
            for (let dta in this.existing_email) {
                this.subexist = false;
                
            }
            if (this.subexist == false) {
                this.submitinvalidate();
            } else {
                this.submitvalidate();
            }
        }, error => {
            console.log("My error", error);
        })
        
       
    }
    clickreg(email) {

        this.getRegisteredEmail(email);
      
       
    }
}