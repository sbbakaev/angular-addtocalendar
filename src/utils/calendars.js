import Utils from './utils';

export default class Calendars {

  static getYahooCalendarUrl(data) {
    var yahooCalendarUrl = 'http://calendar.yahoo.com/?v=60&view=d&type=20';
    var duration = Utils.getHoursDuration(data.startDate, data.endDate);

    yahooCalendarUrl += '&TITLE=' + data.title;
    yahooCalendarUrl += '&ST=' + data.startDate + '&DUR=' + duration;
    yahooCalendarUrl += '&DESC=' + data.description;
    yahooCalendarUrl += '&in_loc=' + data.location;

    return yahooCalendarUrl;
  }

  static getMicrosoftCalendarUrl(data) {
    var microsoftCalendarUrl = 'http://calendar.live.com/calendar/calendar.aspx?rru=addevent';
    microsoftCalendarUrl += '&summary=' + data.title;
    microsoftCalendarUrl += '&dtstart=' + data.startDate + '&dtend=' + data.endDate;
    microsoftCalendarUrl += '&description=' + data.description;
    microsoftCalendarUrl += '&location=' + data.location;

    return microsoftCalendarUrl;
  }

  static getGoogleCalendarUrl(data) {
    var googleCalendarUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
    if(data.endDate == 'Invalid date'){
        var epochMs = moment.utc(moment(data.startDate , "YYYYMMDDTHHmmss").add(1, 'hours')).valueOf();
        data.endDate = moment(epochMs).format('YYYYMMDDTHHmmss');
    }
    googleCalendarUrl += '&text=' + data.title;
    googleCalendarUrl += '&dates=' + data.startDate + '/' + data.endDate;
    googleCalendarUrl += '&details=' + data.description;
    googleCalendarUrl += data.location ? '&location=' + data.location : '';

    let rruleStr = '';
    rruleStr += data.freq != undefined? 'FREQ='+data.freq+';' : '';
    rruleStr += data.interval != undefined && data.interval? 'INTERVAL='+data.interval+';' : '';
    rruleStr += data.count != undefined && data.count != 0? 'COUNT='+data.count+';' : '';
    rruleStr += data.untilDate != undefined && data.count == 0? 'UNTIL='+data.untilDate : '';
    if(data.freq){
        googleCalendarUrl += '&recur=RRULE:'+rruleStr;
    }

    return googleCalendarUrl;
  }

  static getIcsCalendar(data) {
    if(data.endDate == 'Invalid date'){
        var epochMs = moment.utc(moment(data.startDate , "YYYYMMDDTHHmmss").add(1, 'hours')).valueOf();
        data.endDate = moment(epochMs).format('YYYYMMDDTHHmmss');
    }
    let rruleStr = '';
    rruleStr += data.freq != undefined? 'FREQ='+data.freq+';' : '';
    rruleStr += data.interval != undefined && data.interval? 'INTERVAL='+data.interval+';' : '';
    rruleStr += data.count != undefined && data.count != 0? 'COUNT='+data.count+';' : ''
    rruleStr += data.untilDate != undefined && data.count == 0 ? 'UNTIL='+data.untilDate : '';
    if(data.freq){
        rruleStr = 'RRULE:'+rruleStr;
    } else {
        rruleStr = '';
    }
    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      'CLASS:PUBLIC',
      'DESCRIPTION:' + Utils.formatIcsText(data.description, 600),
      'DTSTART:' + data.startDate,
      'DTEND:' + data.endDate,
      'LOCATION:' + Utils.formatIcsText(data.location, 80),
      'SUMMARY:' + Utils.formatIcsText(data.title, 80),
      'TRANSP:TRANSPARENT',
      rruleStr,
      'END:VEVENT',
      'END:VCALENDAR',
      'UID:' + Utils.getUid(),
      'DTSTAMP:' + Utils.getTimeCreated(),
      'PRODID:angular-addtocalendar'
    ].join('\n');
  }
}
