import { Component, OnInit, TemplateRef } from '@angular/core';
import { faPaw, faDog, faBone, faPaperPlane, faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'dynamoDogWalking';
  faPaw = faPaw;
  faDog = faDog;
  faBone = faBone;
  faPaperPlane = faPaperPlane;
  faAngleDoubleUp = faAngleDoubleUp;

  modalRef: BsModalRef;
  constructor(private modalService: BsModalService) {}

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  ngOnInit(): void {
  }
}