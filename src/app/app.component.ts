import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject, timer, interval } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

import { faPaw, faDog, faBone, faPaperPlane, faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'

import { ApiService } from './api-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'dynamoDogWalking';
  locationArray = [];
  location = '';

  faPaw = faPaw;
  faDog = faDog;
  faBone = faBone;
  faPaperPlane = faPaperPlane;
  faAngleDoubleUp = faAngleDoubleUp;

  modalRef: BsModalRef;
  destroy$: Subject<boolean>= new Subject<boolean>();
  constructor(private apiService: ApiService, private modalService: BsModalService) {}

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  callGetLocationApi() {
     this.apiService
        .getLocation()
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
        	let response = JSON.stringify(data);
        	this.locationArray = JSON.parse(response);
        }), 
        (error => {
          this.locationArray = ["Cambridgeshire"];
        })
  }

  callGetSpecificLocation() {
  	const random = Math.floor(Math.random() * this.locationArray.length);
  	return this.locationArray[random];
  }

  ngOnInit() {

  	this.callGetLocationApi();
    var subscription = timer(0,550).subscribe(x => {
    	this.location = this.callGetSpecificLocation();
    });
    interval(10000).subscribe(x => {
    	subscription.unsubscribe();
    	this.location = 'Cambridgeshire';
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}