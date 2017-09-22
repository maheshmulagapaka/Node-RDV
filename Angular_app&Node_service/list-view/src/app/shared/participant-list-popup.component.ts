import { Component,OnInit } from '@angular/core';
import * as _ from 'underscore';
import { Http,Headers,Response } from '@angular/http';
import { ListViewService } from '../services/list-view.service'; 
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";

/**
 * This interface contains the senderId and data:which is an object containing
 *  current criteria of levels ehich needs to be send for service call.
 */
 export interface participantCriteria{
     senderId : string ,
     data : object
 }

@Component({  
    selector: 'participantListPopup',
    templateUrl: 'participant-list-popup.html'
})
export class participantListPopup extends DialogComponent<null, boolean> implements participantCriteria,OnInit{ 
  senderId: string;
  data : object;
  contactHolders : Array<any> = [];
  constructor(dialogService: DialogService,private listViewService: ListViewService) {
    super(dialogService);   
  }
  ngOnInit(){
    var self = this
       this.listViewService.serviceParticepantListing(this.data).subscribe(result =>{               
                _.each(result.result,(ele : any) => {
                  console.log(ele)
                     self.contactHolders.push(ele)
                })
            })            
  }

  confirm() {
    this.close();
  }

}