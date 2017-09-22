import { Component,OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { ListViewService } from '../services/list-view.service'; 
import { LevelsComponent } from './list-view-levels.component';

import { ListViewComponent } from './list-view.component';

export interface reorderInput{
    levelsCriteria : any;
}
@Component({  
    selector: 'reOrderPopup',
    templateUrl: 'list-view-levels-reorder-popup.html'
})
export class reOrderPopup extends DialogComponent<null, Object> implements OnInit,reorderInput {
  
    reportLevels = [];
    levelsCriteria : any;
    enableFooter : boolean = false;
    constructor(dialogService: DialogService,private http:ListViewService) {
    super(dialogService);    
  }

  ngOnInit(){
         var self = this;
        self.reportLevels = Object.assign([],this.levelsCriteria);
         console.log(this.levelsCriteria)     
  }


  confirm() {
    var self = this;
    this.result = {
        isReordered : true,
        reOrderedLevels : self.reportLevels
    }
   
    this.close();
  }
 
    onItemDrop(index:number,event: any) {        
        var self = this;
        self.enableFooter = true;
       let preOne = self.reportLevels[index];
        let currentOndeIndex = self.reportLevels.indexOf(event.dragData);
       self.reportLevels[index] = event.dragData;
       self.reportLevels[currentOndeIndex] = preOne;
    }

}