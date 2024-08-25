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
  var query = "J Day"; // Query ignores any extra spacing
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
    var startTime = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), 10, 0, 0); // **MODIFY**
    var endTime = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), 11, 0, 0); // **MODIFY**

    // Create the new event
    calendar.createEvent("New Meeting", startTime, endTime, {description: 'Agenda'}); // **MODIFY**
    Logger.log("Created a new event on " + startTime);
  }
}