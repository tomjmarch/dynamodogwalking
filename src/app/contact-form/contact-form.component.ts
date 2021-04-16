import { Component } from '@angular/core';

import { Contact } from '../contact';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})

export class ContactFormComponent {

  model = new Contact('','','',0,'');

  submitted = false;

  onSubmit() {
  
    this.submitted = true;
    }

  resolved(captchaResponse: string) {
  console.log('Resolved: ' + captchaResponse)
  }

}