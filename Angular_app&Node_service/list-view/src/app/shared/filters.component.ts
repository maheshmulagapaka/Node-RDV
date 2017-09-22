import {  Component,OnInit,Output,EventEmitter,Input,OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as _ from 'underscore';
import { ListViewService } from '../services/list-view.service'; 
import { SharedMethods } from '../shared/shared-methods.component';


@Component({
    selector : 'filters',
    templateUrl : './filters.html'
})
export class FilterComponent implements OnChanges {

    @Input() filterCriteria : any;
    @Input() participantList : any;

    @Output() onFilterUpdate = new EventEmitter;
    @Output() onCloseFilter = new EventEmitter;

    filterData: any = {};
    filterBlock: boolean = false;
    firstFilter = [];
    secondFilter = [];
    thirdFilter = [];
    fourthFilter = [];
    participantsData = [];
    participants = [];
    currentFilterName: string = "";

    constructor(private listViewService : ListViewService,private sharedMethodsObj : SharedMethods){console.log("called...")};

    ngOnChanges(){
         var self = this;
        // self.participants is an array which contains the participant names and will be used in participant filter search. 
         _.each(self.participantList, function(participant : any) {
                    var name = participant.first_name + participant.last_name;
                    self.participants.push(name);
                });
    };

    closeFilter() {
        this.onCloseFilter.emit();
    };

    showFilterData(name) {
        this.currentFilterName = name;
    };
    /*this method makes an api call for the currently focused filter and returns the list of tha matched input items with the input value*/
    requestAutocompleteItems = (text: string): Observable < Response > => {
        var self = this;
        //it doesnt allow to service call untill the input length is grater than 1.
        text = text.length < 2 ? " " : text
        return self.listViewService.getFilterData(self.currentFilterName, text).map(data => data.json().result.map(item => item[self.currentFilterName]));
    };
    /**
     * onchange of the participant filter field.. this method will be called.
     * returns the participantsData,this variable only gets values when the input text 
     * in the participant filter field is grater than 1 character.otherwise the array becomes empty.
     * @param value this gives the text entered in the field.
     */
    showParticipantFilterData(value){
         this.participantsData = [];
        if(value.length>=1)
            this.participantsData = Object.assign([],this.participants);
    }
      /*after selecting filter values on apply this function will be called
        this sends the data from filter and corresponding criteria to the setFilterObject
        there the data will be appended to the corresponding filter*/
    applyFilter = function() {
        var self = this;
        self.secondLevelPropagation = false;
        self.filterData = {};
        if (self.firstFilter.length > 0) {
            self.setFilterObject(self.filterCriteria[0], this.firstFilter)
        }
        if (self.secondFilter.length > 0) {
            self.setFilterObject(self.filterCriteria[1], this.secondFilter)
        }
        if (self.thirdFilter.length > 0) {
            self.setFilterObject(self.filterCriteria[2], this.thirdFilter)
        }
        if (self.fourthFilter.length > 0) {
            self.setFilterObject(self.filterCriteria[3], this.fourthFilter)
        }
        self.filterBlock = false;
        this.onFilterUpdate.emit(self.filterData)
    };
    //here the filter values will be applyed to the corresponding filter level
    setFilterObject(levelName, filtersData) {

        var self = this;
        self.filterData[levelName] = [];
        if (levelName == 'participant') {
            _.each(filtersData, function(name : any) {
                self.filterData[levelName].push(self.sharedMethodsObj.isParticpant(self.participantList,name.value));
            })
        } else {
            _.each(filtersData, function(name: any) {
                self.filterData[levelName].push(name.value);
            })
        }
    };
    /**
     * when all tags are removed from the filter this method will call the resetFilter method and reaset all values
     */
    tagRemoved(){
        if(this.firstFilter.length ==0 && this.secondFilter.length ==0 && this.thirdFilter.length ==0 && this.fourthFilter.length ==0)
            this. resetFilter();
    };

    /**
     * it resets all the values and calls init method to get the initial stage of the page.
     */
    resetFilter() {
        var self = this;
        self.filterBlock = false;
        self.filterData = {};
        self.firstFilter = [];
        self.secondFilter = [];
        self.thirdFilter = [];
        self.fourthFilter = [];
       this.onFilterUpdate.emit(self.filterData);
    };

}