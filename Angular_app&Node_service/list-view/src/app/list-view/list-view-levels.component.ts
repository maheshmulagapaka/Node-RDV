import { Component,OnInit,Output,Input,EventEmitter, } from '@angular/core';
import * as _ from 'underscore';
import __ from "lodash";
import { ListViewService } from '../services/list-view.service'; 

import { Observable } from 'rxjs/Observable';

import {Router} from '@angular/router'

import { Http,Headers,Response } from '@angular/http';

import { ContactsComponent } from '../shared/contacts.component';
import { SharedMethods } from '../shared/shared-methods.component';

import { reOrderPopup } from './list-view-levels-reorder-popup.component';
import { SendMessageToParticipant } from '../shared/send-message-to-participant.component';
import { DialogService } from "ng2-bootstrap-modal";


@Component({
    selector: 'list-view-levels',
    templateUrl: './list-view-levels.html'
})
export class LevelsComponent implements OnInit {

    @Output() onSelect = new EventEmitter();

    @Input() testingReportId : string;

    constructor(private listViewService: ListViewService,
        private contactsBlockObj: ContactsComponent,
        private dialogService: DialogService,
        private sharedMethodObj : SharedMethods,
        private router: Router) {}


    levelsloadingIcon: boolean = true;
    reportLevels: Array < string > = [];
    reportTitle: string;
    request_id: string;
    titleSearchType: boolean;
    participantList: Array < any > = [];
    filterCriteria: any = [];
    participants: any = [];
    filterData: any = {};
    firstLevelData: any = {};
    secondLevelData: any = {};
    thirdLevelData: any = {};
    fourthLevelData: any = {};
    firstHierarchy: Array < any >= [];
    secondLevelPropagation : boolean = false;
    thirdLevelPropagation: boolean = false;
    fourthLevelPropagation: boolean = false;
    fifthLevelPropagation: boolean = false;
    noData: boolean = false;
    previouslyClickedFirstLevelPanel: any = {}
    loggedInId = "20d4b17b5152e9692782726ab1e12d71";
    filterBlock: boolean = false;
    firstFilter = [];
    secondFilter = [];
    thirdFilter = [];
    fourthFilter = [];
    participantsData = []
    currentFilterName: string = "";
    /*the following variables used for loading more levels data initially when the accordian clicked the the corresponding variable 
    will be updated with the total value which will be retured by service call by the corresponding level value and index values 
    loading more panels the api will be called. if the variable value and index value become equal th service call wont be made.*/
    firstLevelDataCount : number;
    secondLevelDataCount : number;
    thirdLevelDataCount : number;
    fourthLevelDataCount : number;

    ngOnInit() {
        var self = this;
        var reportLevelData = [];
        var data

     
        self.listViewService.getReportLevels().subscribe(result => {
            if(result.message == 'unauthorized user')
                {
                    alert("unautherized user");
                    this.router.navigateByUrl('/');

                }
                data = result.result[0];
                //By looping through the search_parameters of result we'll get the report levels.reportLevelData will be having the report levels
                _.each(data.search_parameter.level, (ele) => {
                    reportLevelData.push(ele)
                })
                reportLevelData.push("participant");

                self.reportTitle = data.name;
                self.request_id = data.fusion_request_id;
                //the following variable is used in isParticipant method to get the id of the participant which is sent to the isParticipant method.
                self.participantList = data.recipients;                
                self.participantList.push({
                    'first_name': data.first_name,
                    'last_name': data.last_name,
                    'user_id': data.user_id
                });

                
                self.filterCriteria = Object.assign([], reportLevelData);
                let titleSearchType = data.search_parameter.custom_title;

                /*there are two possible title in reportLevels which can be title or title_group 
                by thet itleSearchType value we can find weather it is title or title_group
                then accordingly filterCriteria value will be set(title/title_group)*/
                _.map(self.filterCriteria, function(val, key) {
                    if (val == "title") {
                        self.filterCriteria[key] = titleSearchType == false ? "title_group" : val;
                    }
                });

                /*setting the report levels data in service so that the data will be accessed from various places 
                such as levels-reorder-popup */
                 self.reportLevels = reportLevelData;
               self.accordionSelected("", "", "", "")
            }, err =>{
                 this.router.navigateByUrl('/page-not-found');
            }
           
        )
         
    }

    accordionSelected(firstLevel, secondLevel, thirdLevel, fourthLevel) {
        var self = this;
        var filterInfo = Object.keys(this.filterData).length == 0 ? {} : this.filterData; //this is to get the current filter's data and appended in every level.
        var levelValues = [];
        if (firstLevel == "" && secondLevel == "" && thirdLevel == "" && fourthLevel == "") {
            self.firstHierarchy = []
            let data = {
                "level": {
                    "1": {
                        "field": this.reportLevels[0]
                    }
                },
                "filter": filterInfo,
                "index": 0,
                "limit": 20
            }
            self.firstLevelData.data = data;
           
            self.firstLevelData.levelValues = [];
            self.getLevelsList(self.firstLevelData.data, self.firstLevelData.levelValues, '', '');
            //this calls the parent method whil calls the get contacts method in contacts block.
            let dataToRetriveContacts : any = {};
            //dataToRetriveContacts.is_own_connection is used in contacts.component while showing up the 'send request image'.
            dataToRetriveContacts.data = data;dataToRetriveContacts.is_own_connection = undefined;
            self.onSelect.emit(dataToRetriveContacts);

        } else if (firstLevel != "" && secondLevel == "") { //on first level selection
            /*the following functionality is to avoid the propagtion.on click of 3,4 accordions the cilc function is
            being propagated the following functionality will avoid that propagation*/
            
            self.secondLevelPropagation = true;
            let x = self.thirdLevelPropagation && "thirdLevel";
            let y = self.fourthLevelPropagation && "fourthLevel";
            let z = self.fifthLevelPropagation && "fifthLevel";
            if (x == "thirdLevel" || y == "fourthLevel" || z == "fifthLevel") {
                self.thirdLevelPropagation = false;
                self.fourthLevelPropagation = false;
                self.fifthLevelPropagation = false;
                return;
            }

            let data = {
                "level": {
                    "1": {
                        "field": this.reportLevels[0],
                        //if the value is participant, we need to send id of the participant so by calling the isParticipant which is imported into this component we are getting the id.
                        "value": this.reportLevels[0] == "participant" ? self.sharedMethodObj.isParticpant(self.participantList,firstLevel.name) : firstLevel.name
                    },
                    "2": {
                        "field": this.reportLevels[1]
                    }
                },
                "filter": filterInfo,
                "index": 0,
                "limit": 20
            }
            levelValues.push(firstLevel.name);
            //make an object named headerInfo with above values to make service call.
            self.secondLevelData.data = data;
            //this sets te current criteria value in listView service and will be used by the contacts view block;
            self.secondLevelData.levelValues = levelValues;
            self.getLevelsList(self.secondLevelData.data, self.secondLevelData.levelValues, '', '');
            let dataToRetriveContacts : any = {}
            dataToRetriveContacts.data = data;dataToRetriveContacts.is_own_connection = firstLevel.is_own_connection;
            self.onSelect.emit(dataToRetriveContacts);
           
        } else if (firstLevel != "" && secondLevel != "" && thirdLevel == "") { //on second level selection
            if (self.fourthLevelPropagation || self.fifthLevelPropagation) {
                return;
            }
            self.thirdLevelPropagation = true;
            let data = {
                "level": {
                    "1": {
                        "field": self.reportLevels[0],
                        "value": self.reportLevels[0] == "participant" ? self.sharedMethodObj.isParticpant(self.participantList,firstLevel.name) : firstLevel.name

                    },
                    "2": {
                        "field": self.reportLevels[1],
                        "value": self.reportLevels[1] == "participant" ? self.sharedMethodObj.isParticpant(self.participantList,secondLevel.name) : secondLevel.name

                    }
                },
                "filter": filterInfo,
                "index": 0,
                "limit": 20
            };
            if (self.reportLevels.length != 2) {
                data.level[3] = {
                    "field": self.reportLevels[2]
                }
                levelValues.push(firstLevel.name);
                levelValues.push(secondLevel.name);
              
            }
            self.getLevelsList(data, levelValues, '', secondLevel);
            self.thirdLevelData.data = data;
           
            self.thirdLevelData.levelValues = levelValues;
            let dataToRetriveContacts : any = {}
            dataToRetriveContacts.data = data;dataToRetriveContacts.is_own_connection = secondLevel.is_own_connection;
            self.onSelect.emit(dataToRetriveContacts);
        } else if (firstLevel != "" && secondLevel != "" && thirdLevel != "" && fourthLevel == "") {
            if (self.fifthLevelPropagation) return;
            self.fourthLevelPropagation = true;

            let data = {
                "level": {
                    "1": {
                        "field": self.reportLevels[0],
                        //it tha value is participant value we need to send id of the participant so by calling th isParticipant we are getting the id.
                        "value": self.reportLevels[0] == "participant" ? self.sharedMethodObj.isParticpant(self.participantList,firstLevel.name) : firstLevel.name
                    },
                    "2": {
                        "field": self.reportLevels[1],
                        "value": self.reportLevels[1] == "participant" ? self.sharedMethodObj.isParticpant(self.participantList,secondLevel.name) : secondLevel.name
                    },
                    "3": {
                        "field": self.reportLevels[2],
                        "value": self.reportLevels[2] == "participant" ? self.sharedMethodObj.isParticpant(self.participantList,thirdLevel.name) : thirdLevel.name
                    }
                },
                "filter": filterInfo,
                "index": 0,
                "limit": 20
            };
            if (self.reportLevels.length != 3) {
                data.level[4] = {
                    "field": self.reportLevels[3]
                }
                levelValues.push(firstLevel.name);
                levelValues.push(secondLevel.name);
                levelValues.push(thirdLevel.name);
                self.getLevelsList(data, levelValues, '', thirdLevel);
            }

            self.fourthLevelData.data = data;
           
            self.fourthLevelData.levelValues = levelValues;
            let dataToRetriveContacts : any = {}
            dataToRetriveContacts.data = data;dataToRetriveContacts.is_own_connection = thirdLevel.is_own_connection;
            self.onSelect.emit(dataToRetriveContacts);
        } else {
            self.fifthLevelPropagation = true;
            let data = {
                "level": {
                    "1": {
                        "field": self.reportLevels[0],
                        "value": self.reportLevels[0] == "participant" ? self.sharedMethodObj.isParticpant(self.participantList,firstLevel.name) : firstLevel.name
                    },
                    "2": {
                        "field": self.reportLevels[1],
                        "value": self.reportLevels[1] == "participant" ? self.sharedMethodObj.isParticpant(self.participantList,secondLevel.name) : secondLevel.name
                    },
                    "3": {
                        "field": self.reportLevels[2],
                        "value": self.reportLevels[2] == "participant" ? self.sharedMethodObj.isParticpant(self.participantList,thirdLevel.name) : thirdLevel.name
                    },
                    "4": {
                        "field": self.reportLevels[3],
                        "value": self.reportLevels[3] == "participant" ? self.sharedMethodObj.isParticpant(self.participantList,fourthLevel.name) : fourthLevel.name
                    }
                },
                "filter": filterInfo,
                "index": 0,
                "limit": 20
            };
           
            let dataToRetriveContacts : any = {}
            dataToRetriveContacts.data = data;dataToRetriveContacts.is_own_connection = fourthLevel.is_own_connection;
            self.onSelect.emit(dataToRetriveContacts);
        }

    }

    getLevelsList(data, levelValues, loadMore, sectionLoading) {
        var self = this;

console.log(data,'data from getLevelslist')
       // self.listViewService.getLevelData(data)
        //it gets the level data which are panels by sending the level,filter,index,limit values. 
        self.listViewService.getLevelData(data).subscribe(result => {
            if (result.result.length == 0) {
                self.firstHierarchy = [];
                self.noData = true;
                return;
            }
            /*this following function gets the individual count(property) value and if it is grater than 10K
            except first 2 numbers the rest will be replaced with 'K+' string */
            self.noData = false;
            _.each(result.result, function(element: any) {
                if (element.count.toString().length >= 5) {
                    element.count = element.count.toString().slice(0, 2) + 'K+';
                }
            })
            self.appendLevelsData(result.result,result.total, levelValues, loadMore);

        }, error => {
            alert('Error in getLevelsList')
        })
    };
        /*it is to append the response data of service call to the selected level scope variable.
         *levelValues are the values which are currently selected ..meaning, if MSI company is selected that will be in this levelValues and based on that value currently retrived data which is in RESULT will be pushed into the array. 
         */
    appendLevelsData(result,levelDataCount, levelValues, loadMoreCall) {
        var self = this;
        self.levelsloadingIcon = false;
        if (levelValues.length == 0) {
            /*after clicking on the second level the second level value is getting appended to the first level panels when 
            there are two levels the following condition is to prevent that */
            if(self.secondLevelPropagation){
                     self.secondLevelPropagation = false;
                      return;
                }                       
            self.firstLevelDataCount = levelDataCount;
            _.each(result, function(element: any) {
                element.isClicked = false;
                self.firstHierarchy.push(element);
            })
        } else if (levelValues.length == 1) {
            self.secondLevelDataCount = levelDataCount;
            let index = _.findIndex(self.firstHierarchy, (item) => item.name == levelValues[0]);
            if (loadMoreCall == "")
                /*loadMoreCall data will be sent if the call of this function from loadMoreLevels(scrolling Function) otherewise 
                if the call is from accordion selected this line will clear the existing data in particular level.*/
                self.firstHierarchy[index][levelValues[0]] = [];

            _.each(result, function(element: any) {
                element.isClicked = false;
                self.firstHierarchy[index][levelValues[0]].push(element);
            })

        } else if (levelValues.length == 2) {
            self.thirdLevelDataCount = levelDataCount;
            let index = _.findIndex(self.firstHierarchy, (item) => item.name == levelValues[0]);
            let secondIndex = _.findIndex(self.firstHierarchy[index][levelValues[0]], (item : any) => item.name == levelValues[1]);
            if (loadMoreCall == "")
                self.firstHierarchy[index][levelValues[0]][secondIndex][levelValues[1]] = [];

            _.each(result, function(element: any) {
                element.isClicked = false;
                self.firstHierarchy[index][levelValues[0]][secondIndex][levelValues[1]].push(element);
            })

        } else if (levelValues.length == 3) {
            self.fourthLevelDataCount = levelDataCount;
            let index = _.findIndex(self.firstHierarchy, (item) => item.name == levelValues[0]);
            let secondIndex = _.findIndex(self.firstHierarchy[index][levelValues[0]], (item : any) => item.name == levelValues[1]);
            let thirdIndex = _.findIndex(self.firstHierarchy[index][levelValues[0]][secondIndex][levelValues[1]], (item : any) => item.name == levelValues[2]);

            if (loadMoreCall == "")
                self.firstHierarchy[index][levelValues[0]][secondIndex][levelValues[1]][thirdIndex][levelValues[2]] = [];

            self.firstHierarchy[index][levelValues[0]][secondIndex][levelValues[1]][thirdIndex][levelValues[2]] = __.concat(self.firstHierarchy[index][levelValues[0]][secondIndex][levelValues[1]][thirdIndex][levelValues[2]],result)

        }
    };

    //this method will be called when the individual level is scrolled to load rest of the data.
    loadMoreLevelPanels(levelNum) {
       
        // var self = this;
        // if (levelNum == 1) {
            
        //     self.firstLevelData.data.index += 20;
        //     //if the index value of the first level become more than total data count of the first level then this will be stoped here.
        //      if( self.firstLevelData.data.index > self.firstLevelDataCount)
        //         return;
        //     self.getLevelsList(self.firstLevelData.data, self.firstLevelData.levelValues, '', ''); //dont need to send loadMore unlike other levels because we'll never clear first level data.
        // } else if (levelNum == 2) {
        //     self.secondLevelData.data.index += 20;
        //     if( self.secondLevelData.data.index > self.secondLevelDataCount)
        //         return;
        //      self.getLevelsList(self.secondLevelData.data, self.secondLevelData.levelValues, "loadMore", '');

        // } else if (levelNum == 3) {

        //     self.thirdLevelData.data.index += 20;
        //      if( self.thirdLevelData.data.index > self.thirdLevelDataCount)
        //         return;
        //     self.getLevelsList(self.thirdLevelData.data, self.thirdLevelData.levelValues, "loadMore", '');
        // } else if (levelNum == 4) {
        //     self.fourthLevelData.data.index += 20;
        //      if( self.fourthLevelData.data.index > self.fourthLevelDataCount)
        //         return;
        //     self.getLevelsList(self.fourthLevelData.data, self.fourthLevelData.levelValues, "loadMore", '');
        // }
    };
    /*on call of this method a popup will be opened and  the popup returns th isreordered boolian value 
    based on that the initial method will be called again*/
    showLevelsReorderingPopup() {
        var self = this;
        self.dialogService.addDialog(reOrderPopup,{
            levelsCriteria : self.reportLevels
        }).subscribe((response : any) => {
            if (response.isReordered) {
                self.firstHierarchy = [];
                self.secondLevelPropagation = false;
                self.reportLevels = response.reOrderedLevels;
              self.accordionSelected("", "", "", "")
            }
        })
    }
    //The following two methods are for the accordion arrow functionality
      
    toggleArrows(val) {
        val.isClicked = !val.isClicked;
    }
    toggleArrowsofFirstLevel(firstlevel) {

        if (this.previouslyClickedFirstLevelPanel == firstlevel) {
            firstlevel.isClicked = false;
            this.previouslyClickedFirstLevelPanel = {};
            return;
        }
        this.previouslyClickedFirstLevelPanel.isClicked = false
        this.previouslyClickedFirstLevelPanel = firstlevel;
        firstlevel.isClicked = true;
    }
    /**
     * This method will be called when the filter objecte is updated in the filter component which is the child component of this component.
     * @param filterObj this is the updated filter object.
     */
     updateFilter(filterObj){
        var self = this;
        self.filterData = filterObj;
        self.filterBlock = false;
        self.secondLevelPropagation = false;
       self.accordionSelected("", "", "", "");
    }

    sendMsgToParticipant(levelValue) {      
        this.dialogService.addDialog(SendMessageToParticipant,{
            reportTitle : this.reportTitle,
            participant : levelValue.name
        })
    }
}