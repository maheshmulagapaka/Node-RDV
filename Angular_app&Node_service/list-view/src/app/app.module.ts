import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TagInputModule } from 'ngx-chips';
import { AccordionModule } from "ngx-accordion";
import { Ng2DragDropModule } from 'ng2-drag-drop';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//routing
import { RouterModule, Routes } from '@angular/router';

//declarations
import { ListViewComponent } from './list-view/list-view.component';
import { LevelsComponent } from './list-view/list-view-levels.component';
import { SharedMethods } from './shared/shared-methods.component';
import { ContactsComponent } from './shared/contacts.component';
import { FilterComponent } from  './shared/filters.Component';
import { LandingPageComponent } from  './landing-page';
import { CommunicateComponent } from  './communication/communicate.component';
import { PageNotFoundComponent } from './shared/page-not-found.component';


//providers
import{ ListViewService } from './services/list-view.service';

//entry component
import { reOrderPopup } from './list-view/list-view-levels-reorder-popup.component';
import { participantListPopup } from './shared/participant-list-popup.component';
import { SendMessageToParticipant } from './shared/send-message-to-participant.component';

TagInputModule.withDefaults({
    tagInput: {
        placeholder: '',       
    } 
});


const appRoutes: Routes = [
{path : 'list-view/:id' , component : ListViewComponent},
{path : 'communicate' , component : CommunicateComponent},
{path: '', redirectTo: '/communicate', pathMatch: 'full' },
{ path: 'page-not-found', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    reOrderPopup,
    FilterComponent,
    LevelsComponent,    
    ListViewComponent,
    ContactsComponent,
    LandingPageComponent,
    participantListPopup,
    CommunicateComponent,
    PageNotFoundComponent,
    SendMessageToParticipant, 
       
  ],
  imports: [
    HttpModule,
    FormsModule,
    BrowserModule,
    TagInputModule,
    AccordionModule,
    InfiniteScrollModule,   
    BootstrapModalModule,
    BrowserAnimationsModule,
     RouterModule.forRoot(
      appRoutes,
    //  { enableTracing: true } // <-- debugging purposes only
    ),
    Ng2DragDropModule.forRoot(),    
   
  ],
  providers: [
    ListViewComponent,
    ListViewService,
    LevelsComponent,
    ContactsComponent,
    SharedMethods,   
    ],

  bootstrap: [LandingPageComponent],

  entryComponents: [
    reOrderPopup,
    participantListPopup,
    SendMessageToParticipant
  ]
})
export class AppModule { }
