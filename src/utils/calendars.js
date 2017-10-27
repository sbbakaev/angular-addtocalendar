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
    googleCalendarUrl += '&text=' + data.title;
    googleCalendarUrl += '&dates=' + data.startDate + '/' + data.endDate;
    googleCalendarUrl += '&details=' + data.description;
    googleCalendarUrl += data.location ? '&location=' + data.location : '';

    let rruleStr = '';
    rruleStr += data.freq != undefined? 'FREQ='+data.freq+';' : '';
    rruleStr += data.interval != undefined? 'INTERVAL='+data.interval+';' : '';
    rruleStr += data.count != undefined && data.count != 0? 'COUNT='+data.count+';' : '';
    rruleStr += data.untilDate != undefined? 'UNTIL='+data.untilDate : '';
    if(data.freq){
        googleCalendarUrl += '&recur=RRULE:'+rruleStr;
    }

    return googleCalendarUrl;
  }

  static getIcsCalendar(data) {
    let rruleStr = '';
    rruleStr += data.freq != undefined? 'FREQ='+data.freq+';' : '';
    rruleStr += data.interval != undefined? 'INTERVAL='+data.interval+';' : '';
    rruleStr += data.count != undefined && data.count != 0? 'COUNT='+data.count+';' : ''
    rruleStr += data.untilDate != undefined? 'UNTIL='+data.untilDate : '';
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
      'DESCRIPTION:' + Utils.formatIcsText(data.description, 62),
      'DTSTART:' + data.startDate,
      'DTEND:' + data.endDate,
      'LOCATION:' + Utils.formatIcsText(data.location, 64),
      'SUMMARY:' + Utils.formatIcsText(data.title, 66),
      'TRANSP:TRANSPARENT',
      'END:VEVENT',
      'END:VCALENDAR',
      'UID:' + Utils.getUid(),
      'DTSTAMP:' + Utils.getTimeCreated(),
      'PRODID:angular-addtocalendar',
      rruleStr
    ].join('\n');
  }
}
