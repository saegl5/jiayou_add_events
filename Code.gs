// ** WARNING **
// If the script below is modified improperly, running it may cause irrevocable damage.
// The script below comes with absolutely no warranty. Use it at your own risk.

function doGet() {
  return HtmlService.createHtmlOutputFromFile("Index");
}

function addEvents(
  calendarName,
  calendarNameAlt,
  query,
  title,
  location,
  description,
  start,
  end,
  startTime,
  endTime
) {
  var calendars = CalendarApp.getAllCalendars(); // Get all calendars

  // Loop through all calendars and find the one with the matching name
  for (var i = 0; i < calendars.length; i++) {
    if (calendars[i].getName() === calendarName) {
      Logger.log(
        'Calendar ID for "' + calendarName + '": ' + calendars[i].getId()
      );
      var calendarId = String(calendars[i].getId()); // Assign the calendar ID
    }
  }

  // Repeat loop for alternate calendar (if one exists)
  if (calendarNameAlt !== "") {
    for (var j = 0; j < calendars.length; j++) {
      if (calendars[j].getName() === calendarNameAlt) {
        Logger.log(
          'Calendar ID for "' + calendarNameAlt + '": ' + calendars[j].getId()
        );
        var calendarIdAlt = String(calendars[j].getId()); // Assign the calendar ID
      }
    }
  }

  // Access the calendar
  var calendar = CalendarApp.getCalendarById(calendarId);
  if (calendarNameAlt !== "") {
    var calendarAlt = CalendarApp.getCalendarById(calendarIdAlt);
  }

  // Check for null dates
  if (start !== "" && end !== "") {
    // Set the search parameters
    start = new Date(start);
    end = new Date(end); // excluded from search
    end.setDate(end.getDate() + 1); // include end date in search

    // Search for events with title "J Day" between start and end dates
    var events = calendar.getEvents(start, end, { search: query });
  } else {
    // Set the search parameters
    var now = new Date();
    var oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(now.getFullYear() + 1);

    // Search for events with title "J Day" between now and one year from now
    var events = calendar.getEvents(now, oneYearFromNow, { search: query });
  }

  // Track dates when events with title "J Day" occur
  var datesWithJ = {};

  // Loop through each event found
  events.forEach(function (event) {
    var eventDate = event.getStartTime();

    // Extract just the date part (YYYY-MM-DD) as a string
    var dateKey = eventDate.toDateString();

    // Store the date in the dictionary
    datesWithJ[dateKey] = true;
  });

  // Check if times are null
  if (startTime === "" && endTime === "") {
    startTime = "00:00";
    endTime = "24:00";
  }

  // Split strings into lists of hours and minutes
  startTime = startTime.split(":");
  startTime[0] = parseInt(startTime[0]);
  startTime[1] = parseInt(startTime[1]);

  endTime = endTime.split(":");
  endTime[0] = parseInt(endTime[0]);
  endTime[1] = parseInt(endTime[1]);

  // Iterate over the dates with events titled "J Day" and create a new event at 10 am
  for (var dateStr in datesWithJ) {
    var eventDate = new Date(dateStr); // Cast "eventDate" as a function
    var dateStartTime = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate(),
      startTime[0],
      startTime[1]
    );
    var dateEndTime = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate(),
      endTime[0],
      endTime[1]
    );

    // Create the new event
    if (calendarNameAlt !== "") {
      calendarAlt.createEvent(title, dateStartTime, dateEndTime, {
        location: location,
        description: description,
      });
    } else {
      calendar.createEvent(title, dateStartTime, dateEndTime, {
        location: location,
        description: description,
      });
    }
    Logger.log("Created a new event on " + dateStartTime);
  }
  return "Events created!";
}
