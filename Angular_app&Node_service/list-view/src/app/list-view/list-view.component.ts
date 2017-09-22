import { Component,ViewChild } from '@angular/core';
import { ContactsComponent } from '../shared/contacts.component';
import { Router,ActivatedRoute } from '@angular/router';
import { ListViewService } from '../services/list-view.service';

@Component({
  templateUrl: './list-view.component.html',
  styleUrls: ['../../assets/stylesheets/envoy.css','../../assets/stylesheets/insights_view_report_contacts.css','../../assets/stylesheets/myworld.css']
})
export class ListViewComponent {

  constructor(
    public route: ActivatedRoute  ,
    public listViewService :  ListViewService 
  ){}
    private sub: any;
   // private mode: string

    ngOnInit() {
    // get URL parameters

    this.sub = this.route
        .params
        .subscribe(params => {
            this.listViewService.setUrls(params['id'])
    });
     
}
  /**
   * this is to view the child component(ContactsComponent) and access the contactComponent methods.
   */
  @ViewChild (ContactsComponent)  contactsViewComponentObj :  ContactsComponent;
  retriveContacts(currentCriteria){
    this.contactsViewComponentObj.callGetContactsList(currentCriteria);
  }
}
