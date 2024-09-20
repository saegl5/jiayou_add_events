// ** WARNING **
// If the script below is modified improperly, running it may cause irrevocable damage.
// The script below comes with absolutely no warranty. Use it at your own risk.

function doGet() {
  return HtmlService.createHtmlOutputFromFile("Index");
}

function addEvents(
  calendarName,
  query,
  calendarNameAlt,
  title,
  guests,
  location,
  description,
  start,
  end,
  startTime,
  endTime,
  dryRun
) {
  var calendars = CalendarApp.getAllCalendars(); // Get all calendars
  var calendarId = ""; // Initially null
  var calendarIdAlt = ""; // Initially null

  // Loop through all calendars and find the one with the matching name
  for (var i = 0; i < calendars.length; i++) {
    if (calendars[i].getName() === calendarName) {
      calendarId = String(calendars[i].getId()); // Assign the calendar ID
    }
  }

  // Check if loop finds no calendar
  if (calendarId === "") {
    return 'No "' + calendarName + '" calendar exists!';
  }

  // Repeat loop for alternate calendar (if one exists)
  if (calendarNameAlt !== "") {
    for (var j = 0; j < calendars.length; j++) {
      if (calendars[j].getName() === calendarNameAlt) {
        calendarIdAlt = String(calendars[j].getId()); // Assign the calendar ID
      }
    }
  }

  // Check if loop finds no calendar
  if (calendarNameAlt !== "" && calendarIdAlt === "") {
    return 'No "' + calendarNameAlt + '" calendar exists!';
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

    // Search for events with title between start and end dates
    var eventsAll = calendar.getEvents(start, end);
    var events = [];
    for (var k = 0; k < eventsAll.length; k++) {
      var event = eventsAll[k];
      if (event.getTitle() === query) {
        // MORE RELIABLE THAN `{ search: query }`!
        events.push(event);
      }
    }
  } else {
    // Set the search parameters
    var now = new Date();
    var oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(now.getFullYear() + 1);

    // Search for events with title between now and one year from now
    var eventsAll = calendar.getEvents(now, oneYearFromNow);
    var events = [];
    for (var l = 0; l < eventsAll.length; l++) {
      var event = eventsAll[l];
      if (event.getTitle() === query) {
        events.push(event);
      }
    }
  }

  // Check if query finds no events
  if (events.length === 0) {
    return 'No "' + query + '" events exist!';
  }

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

  // Track dates when events with title occur
  var date = {};

  // Loop through each event found
  events.forEach(function (event) {
    var eventDate = event.getStartTime();

    // Extract just the date part as a string
    var dateKey = eventDate.toDateString();

    // Store the date in the dictionary
    date[dateKey] = true;
  });

  var firstEvent = true; // for first event, to which subsequent events will be chained
  var eventSeries = ""; // for chaining events

  // Iterate over the dates with events titled query and create a new event for the series at start time
  for (var dateStr in date) {
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

    if (!dryRun) {
      // Check if description is a link
      var includesHttp = description.includes("http"); // "let" is fine, using "var" for flexibility
      // Create the new event
      if (calendarNameAlt !== "")
        // "!=" is okay, using "!==" for precision (same type AND same value)
        createEvent(calendarAlt, includesHttp);
      else createEvent(calendar, includesHttp);
    }

    // function nested because it relies on many parameters
    function createEvent(calendar, includesHttp) {
      if (firstEvent) {
        if (includesHttp) {
          eventSeries = calendar.createEventSeries(
            title,
            dateStartTime,
            dateEndTime,
            CalendarApp.newRecurrence().addDate(eventDate),
            {
              location: location,
              description:
                '<a href="' + description + '" target="_blank" >Agenda</a>',
              guests: guests,
            }
          );
        } else {
          eventSeries = calendar.createEventSeries(
            title,
            dateStartTime,
            dateEndTime,
            CalendarApp.newRecurrence().addDate(eventDate),
            {
              location: location,
              description: description,
              guests: guests,
            }
          );
        }
        firstEvent = false;
      } // chain subsequent event to first event
      else
        eventSeries.setRecurrence(
          CalendarApp.newRecurrence().addDate(eventDate),
          dateStartTime,
          dateEndTime
        );
      return null;
    }

    // Log which events were added
    Logger.log("Created a new event on " + dateStartTime);
  }
  return "Events created!";
}
