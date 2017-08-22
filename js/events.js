/* global Vue: false, moment: false */
const now = new Date();
const calendarID = 'secularpitt@gmail.com';
const numOfResults = 10;
const API_KEY = 'AIzaSyBILdBYibAQSy_7LMncr40hmLOLgDj4XFI';

const calURL = 'https://www.googleapis.com/calendar/v3/calendars/'+ calendarID + '/events?maxResults=' + numOfResults + '&orderBy=startTime&singleEvents=true&timeMin=' + now.toISOString() + '&key=' + API_KEY;

var calendar = new Vue({
  el: '#calendar',
  data: {
    events: []
  },
  methods: {
    getCalendarEvents() {
      fetch(calURL)
        .then(blob => blob.json())
        .then(data => this.events = data.items)
        .then(() => this.events.forEach(item => {
          [item.description, ...item.bullets] = (item.description) ? item.description.split('--'): [];
          item.bullets.forEach((bullet, i, arr) => arr[i] = Autolinker.link(bullet));
        }))
        .catch((response) => console.log('Error', response));
    }
  },
  mounted() {
    this.getCalendarEvents();
  },
  filters: {
    date(value) {
      const [date, format] = (value.date) ? [value.date, 'dddd, M/D']: [value.dateTime, 'dddd, M/D @ ha'];
      return moment(date).format(format);
    },
    id(value) {
      const date = (value.date) ? value.date: value.dateTime;
      return moment(date).format('MM-DD-YYYY');
    }
  }
});
