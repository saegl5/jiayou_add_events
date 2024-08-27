// Modify the search query, event title, description, start time, and end time as desired

var myQuery = "J Day"; // Query ignores any extra spacing
var myTitle = "New Meeting";
var myLocation = "Location";
var myDescription = "Agenda";
var myStartTime = [10, 0]; // Means 10:00, use 24-hour time format
var myEndTime = [11, 0]; // Means 11:00, use 24-hour time format



// ** WARNING **
// If the script below is modified improperly, running it may cause irrevocable damage.
// The script below comes with absolutely no warranty. Use it at your own risk.

function createEvents() {
  var calendarName = "JIA YOU";
  var calendars = CalendarApp.getAllCalendars();  // Get all calendars
  
  // Loop through all calendars and find the one with the matching name
  for (var i = 0; i < calendars.length; i++) {
    if (calendars[i].getName() === calendarName) {
      Logger.log('Calendar ID for "' + calendarName + '": ' + calendars[i].getId());
      var calendarID = String(calendars[i].getId());  // Assign the calendar ID
    }
  }

  // Access the calendar
  var calendar = CalendarApp.getCalendarById(calendarID);

  // Set the search parameters
  var query = myQuery;
  var now = new Date();
  var oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(now.getFullYear() + 1);
  
  // Search for events with title "J Day" between now and one year from now
  var events = calendar.getEvents(now, oneYearFromNow, {search: query});
  
  // Track dates when events with title "J Day" occur
  var datesWithJ = {};

  // Loop through each event found
  events.forEach(function(event) {
    var eventDate = event.getStartTime();
    
    // Extract just the date part (YYYY-MM-DD) as a string
    var dateKey = eventDate.toDateString();
    
    // Store the date in the dictionary
    datesWithJ[dateKey] = true;
  });

  // Iterate over the dates with events titled "J Day" and create a new event at 10 am
  for (var dateStr in datesWithJ) {
    var eventDate = new Date(dateStr);
    var startTime = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), myStartTime[0], myStartTime[1]);
    var endTime = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), myEndTime[0], myEndTime[1]);

    // Create the new event
    calendar.createEvent(myTitle, startTime, endTime, {location: myLocation, description: myDescription});
    Logger.log("Created a new event on " + startTime);
  }
}