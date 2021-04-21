import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

import { faDog, faUser, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';

import { Contact } from '../contact';
import { ApiService } from '../api-service.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})

export class ContactFormComponent implements OnDestroy {
  faDog = faDog;
  faUser = faUser;
  faPhoneAlt = faPhoneAlt;

  model = new Contact('','','','','','');
  failed = false;
  success = false;
  destroy$: Subject<boolean>= new Subject<boolean>();

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.model = new Contact('','','','','','');
    this.failed = false;
  }

  onSubmit() {
    if(this.model.token) {
      this.apiService
        .postContactForm(this.model)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data => {
          if(data = "processed") {
            this.model = new Contact('','','','','','');
            this.success = true;
          } else {
            this.failed = true;
          }
        }), 
        (error => {
          this.failed = true;
        }))
    }
  }

  resolved(captchaResponse: string) {
    // console.log('Captcha: ' + captchaResponse)
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}