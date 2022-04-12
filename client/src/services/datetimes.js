import moment from 'moment';

class DateTimesService {

    formatDate(string){
        if(string){
            return moment(new Date(string)).format("DD/MM/YYYY HH:mm");
        }else { 
            return moment(new Date()).format("DD/MM/YYYY HH:mm");
        }
    }
}

export default new DateTimesService();