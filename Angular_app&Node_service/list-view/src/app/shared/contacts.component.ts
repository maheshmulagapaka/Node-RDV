import { Component,Input } from '@angular/core'
import { ListViewService } from  '../services/list-view.service';
import * as _ from 'underscore';
import { participantListPopup } from './participant-list-popup.component';
import { DialogService } from "ng2-bootstrap-modal";
import * as $ from 'jquery';




@Component({
selector :  'contacts',
templateUrl : 'contacts.html'  
})
export  class  ContactsComponent {

    constructor(private http : ListViewService,
         private dialogService:DialogService){}

    contactsLoadingIcon : boolean = true;
    sortBynameAsc : boolean = true;
    sortBycountAsc : boolean = true;
    currentCriteria : any = {};
    contactList : any = [];
    isSendReqEnabled : boolean = false;
    numberOfContacts : number;
    sortByValue = 'name';
    orderbyValue = 'asc';
    loggedInId = "20d4b17b5152e9692782726ab1e12d71"
    is_own_connection

    srtByName : any = {
        ascActiv : true,
        ascDeact : false,
        descActiv : false,
        descDeact : false
    }
     srtByCount : any = {
        ascActiv : false,
        ascDeact : true,
        descActiv : false,
        descDeact : false
    }

    //this method will be called from the parent when a level panel is selected in liast-view-levels.
    callGetContactsList(criteria){   
       
        let self = this;
        this.contactsLoadingIcon = true; 
      
        //self.currentCriteria =Object.assign({}, this.http.currentCriteria);
        /*gets the current criteria from the levels component in list-view and based on that criteria contact will be retrived*/
        self.currentCriteria =Object.assign({},criteria.data);
        self.is_own_connection = criteria.is_own_connection;
        self.currentCriteria.order ='asc';
        self.currentCriteria.sort_by = 'name';
        self.getContactsList('');
    }
    /**
     * this gets the contacts by sending the current criteria which is sent to the callGetContactsList method
     * if the call is from loadMoreContacts method it wont empty the contactList array if the call is from the callGetContactsList Method the contactList
     * will become empty and the new contact data will be added to the array.
     */
	getContactsList(val){   
        let self = this;
        var check = false;
        if(val != 'loadMore')
            self.contactList = [];
        self.isSendReqEnabled = false;
        self.http.getContactsList(this.currentCriteria).subscribe(result =>{
                this.contactsLoadingIcon = false; 
                self.numberOfContacts = result.total;          
                _.each(result.result,function(ele){
                       self.contactList.push(ele)
                })  
        })              
            _.each( self.currentCriteria.level, function(element : any) {
                if (element.field == "participant" && element.hasOwnProperty('value')) {
                    //if participant field found with value and the current selected one is not the report created person the chek will be true.
                     self.isSendReqEnabled = element.value == self.loggedInId ? false : true //if isSendReqEnabled is true then the sendRequest icon will be appeared in contacts list.     
                    //  if(element.value != self.loggedInId &&  self.is_own_connection == 1){
                    //      self.isSendReqEnabled =  true;
                    //  }
                }
            })
               
    }
    //loads more contacts list.
    loadMoreContacts(){
        // var self = this;
        // self.currentCriteria.index += 20;
        // self.getContactsList('loadMore');
    }    
    /**
     * @param contactId,which should be sent to the service call
     * @param index,by this the contact will be updated which has that index value after service response.
     */
    sendDiscussionRequest(contactId,index){
        var self = this;
          self.contactList[index].request_sent = null;

          var participntId = "";
            //gets the current participant id by looping through the currentCriteria.
            _.each(self.currentCriteria.level, function(elem : any) {
                if (elem.field == "participant") {
                    participntId = elem.value;
                }
            })

            var requestData = {
                "contact_id": contactId,
                "participant_id": participntId,
                "prospect_report_id": ''
            }
           self.http.serviceSendDiscussionRequest(requestData).subscribe(result =>{
                if(result.code == 201)  //if the request send successfully the corresponding contact will be updated.
                     self.contactList[index].request_sent = 1;
           })
    }

    participantListing(contactId){        
        var self = this;
        var contactHolders = [];
        var senderId = self.loggedInId;
        var data = Object.assign({},self.currentCriteria)
         data.contact_id = contactId;
            delete data.index;
            delete data.limit;
            delete data.order;
            delete data.sort_by;           
            /*opening the popup by sending the senderId and current criteria of levels to it
            senderId will be used to check if matches the contact name will be showed up with the name 'Me' */
        self.dialogService.addDialog(participantListPopup,{
            senderId,data
        })
    }
    /**
     * The following two are the sorting methods
     */
    sortByName(){
        var self = this;
        self.contactsLoadingIcon = true;
        self.contactList = [];
        var currentlyActiveSortByCountClass = $("#sortbycount").attr('class')
        self.currentCriteria.sort_by = 'name';
   
         if( $("#sortbyname").hasClass('sortByNameAscActive')){
            self.srtByName.ascActiv = false;
             self.srtByName.descActiv = true;
             self.currentCriteria.order = 'desc';
         }else if($("#sortbyname").hasClass('sortByNameDescActive')){
           
             self.srtByName.ascActiv = true;
             self.srtByName.descActiv = false;
              self.currentCriteria.order = 'asc';
         }else if($("#sortbyname").hasClass('sortByNameAscDeactive')){
             self.srtByName.ascDeact = false;
             self.srtByName.ascActiv = true;
              if(currentlyActiveSortByCountClass == 'sortByCountAscActive'){
              self.srtByCount.ascDeact = true; self.srtByCount.ascActiv = false;
             }else{
                self.srtByCount.descActiv = false; self.srtByCount.descDeact = true;
        }
         }else if($("#sortbyname").hasClass('sortByNameDescDective')){
             self.srtByName.descDeact = false;
             self.srtByName.descActiv = true;
             if(currentlyActiveSortByCountClass == 'sortByCountAscActive'){
              self.srtByCount.ascDeact = true; self.srtByCount.ascActiv = false;
             }else{
            self.srtByCount.descActiv = false; self.srtByCount.descDeact = true;
        }           
         }
         self.getContactsList('');  
    }

    sortByCount(){        
        var self = this;
         self.contactsLoadingIcon = true;
         self.contactList = [];
          self.currentCriteria.sort_by = 'count';
          var currentlyActiveSortByNameClass = $("#sortbyname").attr('class')
         if( $("#sortbycount").hasClass('sortByCountAscActive')){
            self.srtByCount.ascActiv = false;
            self.srtByCount.descActiv = true;
            self.currentCriteria.order = 'desc';
         }else if($("#sortbycount").hasClass('sortByCountDescActive')){
             self.srtByCount.ascActiv = true;
             self.srtByCount.descActiv = false;
              self.currentCriteria.order = 'asc';
         }else if($("#sortbycount").hasClass('sortByCountAscDeactive')){
             self.srtByCount.ascDeact = false;
             self.srtByCount.ascActiv = true;

             if(currentlyActiveSortByNameClass == 'sortByNameAscActive'){
              self.srtByName.ascDeact = true; self.srtByName.ascActiv = false;
             }else{
            self.srtByName.descActiv = false; self.srtByName.descDeact = true;
        }
         }else if($("#sortbycount").hasClass('sortByCountDescDective')){
             self.srtByCount.descDeact = false;
             self.srtByCount.descActiv = true;
              if(currentlyActiveSortByNameClass == 'sortByNameAscActive'){
              self.srtByName.ascDeact = true; self.srtByName.ascActiv = false;
             }else{
            self.srtByName.descActiv = false; self.srtByName.descDeact = true;
         }}
         self.getContactsList('');  
    }

}


