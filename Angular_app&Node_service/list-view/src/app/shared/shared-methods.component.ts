import * as _ from 'underscore';

export class SharedMethods{
        isParticpant(participantList,name) {
        var self = this;
        let idParticipant;
        _.each(participantList, function(participant : any) {
            if ((participant.first_name + participant.last_name).replace(/\s/g, '') == name.replace(/\s/g, '')) {

                idParticipant = participant.user_id;
            }
        })
        return idParticipant;
    };
}