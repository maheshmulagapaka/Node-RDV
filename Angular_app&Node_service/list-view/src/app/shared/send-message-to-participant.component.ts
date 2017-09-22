import { Component,OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";


@Component({  
    selector: 'sendMessageToParticipant',
    templateUrl: 'send-message-to-participant.html'
})
export class SendMessageToParticipant extends DialogComponent<null, boolean>{
  
  constructor(dialogService: DialogService) {
    super(dialogService);
    
  }
  confirm() {
    this.close();
  }

}