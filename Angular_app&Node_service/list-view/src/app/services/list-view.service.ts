import { Injectable } from '@angular/core';
import { Http,Headers,Response,RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ListViewService {
    //50758
    //25059
    //50897
    //16256
    reportId : string;
    reportData              : string;
    levelsData              : string;
    contactsList            : string; 
    participantListing      : string; 
    sendrequest             : string; 
    filterAutocompleteValues: string; 
    vip2SessionId           : string = 'f59f712c-ce25-4ea6-9bc7-089a25fa3f5e';
    private _currentCriteria: any = {};
    private reportLevels   : any = [];
   // baseUrl = 'vip2-api.envoyworld.com';
    //baseUrl = 'api.envoyworld.com';
    baseUrl = '127.0.0.1:8082'
    private headers = new Headers({
        'Content-Type': 'text/plain',
        'session_id': this.vip2SessionId
    });
     private nodeHeaders = new Headers({
        'Content-Type': 'text/plain'
    });


    constructor(private http: Http) {}

    setUrls(reportId : string){
    // this.reportData               = `https://${this.baseUrl}/3/fusionrequestreport/${reportId}`;
    // this.levelsData               = `https://${this.baseUrl}/3/prospectreport/${reportId}/uniquecount`;
    // this.contactsList             = `https://${this.baseUrl}/3/prospectreport/${reportId}/connnectionandcontactlisting`;
    // this.participantListing       = `https://${this.baseUrl}/3/prospectreport/${reportId}/participantlisting`;
    // this.sendrequest              = "https://${this.baseUrl}/1/contactdiscussionrequest/"; 
    // this.filterAutocompleteValues = `https://${this.baseUrl}/1/prospectreport/${reportId}`;
 
    this.reportData               = `http://${this.baseUrl}/fusionrequestreport/${reportId}`;
    this.levelsData               = `http://${this.baseUrl}/uniquecount/${reportId}`;
    this.contactsList             = `http://${this.baseUrl}/connnectionandcontactlisting/${reportId}`;
    this.participantListing       = `https://${this.baseUrl}/3/prospectreport/${reportId}/participantlisting`;
    this.sendrequest              = "https://${this.baseUrl}/1/contactdiscussionrequest/"; 
    this.filterAutocompleteValues = `https://${this.baseUrl}/1/prospectreport/${reportId}`;
    }

   

    //  makeNodeApicall(){
    //      //console.log(inp_data)
    //  let headers      = new Headers({'Content-Type': 'application/json'}); 
    //  let options      = new RequestOptions({ headers: headers });
    //      return this.http.get('http://127.0.0.1:8082/fusionrequestreport/12345',options)
    //         .map((res:Response) => res.json())
    //        // .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    // }

    getReportLevels() {       
        // return this.http.get(this.reportData, {
        //     headers: this.headers
        // }).map((res: Response) => res.json());
        console.log('this.reportData',this.reportData)
        let headers      = new Headers({'Content-Type': 'application/json'}); 
        let options      = new RequestOptions({ headers: headers });
         return this.http.get( this.reportData ,options)
            .map((res:Response) => res.json())
    }

    getLevelData(requiredDara) {        
     let headers      = new Headers({'Content-Type': 'application/json'}); 
     let options      = new RequestOptions({ headers: headers });
       return this.http.post(this.levelsData,{params: requiredDara}, options).map((res: Response) => res.json())
    }

    getContactsList(requiredDara) {
        // return this.http.post(this.contactsList, requiredDara, {
        //     headers: this.headers
        // }).map((res: Response) => res.json())
        let headers      = new Headers({'Content-Type': 'application/json'}); 
        let options      = new RequestOptions({ headers: headers });
         return this.http.post(this.contactsList,{params: requiredDara}, options).map((res: Response) => res.json())
    }

    serviceParticepantListing(contactInfo) {

        return this.http.post(this.participantListing, contactInfo, {
            headers: this.headers
        }).map((res: Response) => res.json())

    }
    /**
     * 
     * @param contactInfo 
     */
    serviceSendDiscussionRequest(contactInfo : any) {
        contactInfo.prospect_report_id = this.reportId;
        return this.http.post(this.sendrequest, contactInfo, {
            headers: this.headers
        }).map((res: Response) => res.json())
    }

    getFilterData(criteria, input) {
       
          criteria = criteria == 'title_group' ? 'titlegroup' : criteria;
        return this.http.get(this.filterAutocompleteValues + `/${criteria}?search=${input}&index=0&limit=20`, {
            headers: this.headers
        })
        

    }

    
}









































// prodct_sessionId = 'ae4d506e-8789-4bef-a2f7-16f91c06e057'

//  reportData = "https://api.envoyworld.com/3/fusionrequestreport/11302";
//  LevelsData = "https://api.envoyworld.com/3/prospectreport/11302/uniquecount";
//  contactsList = "https://api.envoyworld.com/3/prospectreport/11302/connnectionandcontactlisting";