// Modify the calendar name, search query, event title, location, description, start time, and end time as desired
// Add any alternate calendar name as desired too

var myCalendarName = "JIA YOU"; // Must name it differently from the owner name
var myCalendarNameAlt = ""; // Input name to create events on an alternate calendar, same naming convention applies
var myQuery = "J Day"; // Query ignores any extra spacing
var myTitle = "New Meeting";
var myLocation = "Location";
var myDescription = "Agenda";
var myStartTime = "10:00"; // Use 24-hour time format
var myEndTime = "11:00"; // Use 24-hour time format



// ** WARNING **
// If the script below is modified improperly, running it may cause irrevocable damage.
// The script below comes with absolutely no warranty. Use it at your own risk.

function addEvents() {
  var calendarName = myCalendarName;
  var calendarNameAlt = myCalendarNameAlt;
  var calendars = CalendarApp.getAllCalendars();  // Get all calendars
  
  // Loop through all calendars and find the one with the matching name
  for (var i = 0; i < calendars.length; i++) {
    if (calendars[i].getName() === calendarName) {
      Logger.log("Calendar ID for \"" + calendarName + "\": " + calendars[i].getId());
      var calendarId = String(calendars[i].getId());  // Assign the calendar ID
    }
  }

  // Repeat loop for alternate calendar (if one exists)
  if (calendarNameAlt !== "") {
    for (var j = 0; j < calendars.length; j++) {
      if (calendars[j].getName() === calendarNameAlt) {
        Logger.log("Calendar ID for \"" + calendarNameAlt + "\": " + calendars[j].getId());
        var calendarIdAlt = String(calendars[j].getId());  // Assign the calendar ID
      }
    }
  }

  // Access the calendar
  var calendar = CalendarApp.getCalendarById(calendarId);
  if (calendarNameAlt !== "") {
    var calendarAlt = CalendarApp.getCalendarById(calendarIdAlt);
  }

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

  // Check if times are null
  if (myStartTime === "" && myEndTime === "") {
    myStartTime = "00:00";
    myEndTime = "24:00";
  }

  // Split strings into lists of hours and minutes
  myStartTime = myStartTime.split(':');
  myStartTime[0] = parseInt(myStartTime[0]);
  myStartTime[1] = parseInt(myStartTime[1]);

  myEndTime = myEndTime.split(':');
  myEndTime[0] = parseInt(myEndTime[0]);
  myEndTime[1] = parseInt(myEndTime[1]);  

  // Iterate over the dates with events titled "J Day" and create a new event at 10 am
  for (var dateStr in datesWithJ) {
    var eventDate = new Date(dateStr);
    var startTime = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), myStartTime[0], myStartTime[1]);
    var endTime = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), myEndTime[0], myEndTime[1]);

    // Create the new event
    if (calendarNameAlt !== "") {
      calendarAlt.createEvent(myTitle, startTime, endTime, {location: myLocation, description: myDescription});
    }
    else {
      calendar.createEvent(myTitle, startTime, endTime, {location: myLocation, description: myDescription});
    }
    Logger.log("Created a new event on " + startTime);
  }
}