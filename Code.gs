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
    var calendarDefault = CalendarApp.getDefaultCalendar();
    return (
      'No "' +
      calendarName +
      '" calendar! But "' +
      calendarDefault.getName() +
      '" exists.'
    ); // handle null
  }

  // Repeat loop for alternate calendar (if one exists)
  if (calendarNameAlt !== "") {
    for (var j = 0; j < calendars.length; j++) {
      if (calendars[j].getName() === calendarNameAlt) {
        calendarIdAlt = String(calendars[j].getId()); // Assign the calendar ID
      }
    }
  }

  // Check if loop finds no alt calendar, next

  // Access the calendar
  var calendar = CalendarApp.getCalendarById(calendarId);
  if (calendarNameAlt !== "" && calendarIdAlt !== "") {
    var calendarAlt = CalendarApp.getCalendarById(calendarIdAlt);
  } else if (calendarNameAlt !== "" && calendarIdAlt === "") {
    // create the alternate calendar
    if (!dryRun) {
      var calendarAlt = CalendarApp.createCalendar(calendarNameAlt); // built-in function

      // Set its time zone the same as calendar's
      calendarAlt.setTimeZone(calendar.getTimeZone());
    }
  }

  // handle exceptions
  if (start.includes(",") || end.includes(",")) {
    return "Use accepted date formats!"; // for consistency
  }

  // Check for null dates
  if (start !== "" && end !== "") {
    // Set the search parameters
    start = new Date(start);
    end = new Date(end); // excluded from search
    end.setDate(end.getDate() + 1); // include end date in search
    // Search for events with title between start and end dates
    search(start, end);
  } else if (start === "" && end !== "") {
    // Set the search parameters
    var now = new Date();
    end = new Date(end); // excluded from search
    end.setDate(end.getDate() + 1); // include end date in search
    // Search for events with title between now and end date
    search(now, end);
  } else if (start !== "" && end === "") {
    // Set the search parameters
    start = new Date(start);
    var oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(start.getFullYear() + 1); // sooner, if calendar cuts off
    // Search for events with title between start and one year from start
    search(start, oneYearFromNow);
  } else {
    // Set the search parameters
    var now = new Date();
    var oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(now.getFullYear() + 1); // sooner, if calendar cuts off
    // Search for events with title between now and one year from now
    search(now, oneYearFromNow);
  }

  // consolidated into nested function
  var events;
  function search(from, to) {
    if (from > to) {
      events = null;
    } else {
      var eventsAll = calendar.getEvents(from, to);
      events = [];
      for (var k = 0; k < eventsAll.length; k++) {
        var event = eventsAll[k];
        if (event.getTitle() === query) {
          // MORE RELIABLE THAN `{ search: query }`!
          events.push(event);
        }
      }
    }
    return null;
  }

  // check invalid date range
  if (events === null) {
    return "Event start time must be before event end time"; // handle error
  }

  // Check if query finds no events
  if (events.length === 0) {
    return 'No "' + query + '" events exist!';
  }

  // Check if times are null
  if (startTime === "" && endTime === "") {
    // make all-day event, later
  } else if (startTime !== "" && endTime === "") {
    // Split strings into lists of hours and minutes
    startTime = startTime.split(":");
    startTime[0] = parseInt(startTime[0]);
    startTime[1] = parseInt(startTime[1]);

    endTime = [];
    endTime[0] = startTime[0] + 1; // simply add 1 hour
    endTime[1] = startTime[1];
  } else if (startTime === "" && endTime !== "") {
    // Split strings into lists of hours and minutes
    endTime = endTime.split(":");
    endTime[0] = parseInt(endTime[0]);
    endTime[1] = parseInt(endTime[1]);

    startTime = [];
    startTime[0] = endTime[0] - 1; // simply subtract 1 hour
    startTime[1] = endTime[1];
  } else {
    // Split strings into lists of hours and minutes
    startTime = startTime.split(":");
    startTime[0] = parseInt(startTime[0]);
    startTime[1] = parseInt(startTime[1]);

    endTime = endTime.split(":");
    endTime[0] = parseInt(endTime[0]);
    endTime[1] = parseInt(endTime[1]);
  }

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

    // check invalid time range
    if (dateStartTime > dateEndTime) {
      return "Event start time must be before event end time"; // handle error
    }

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
          if (startTime === "" && endTime === "") {
            // make all-day event
            eventSeries = calendar.createAllDayEventSeries(
              title,
              eventDate,
              CalendarApp.newRecurrence().addDate(eventDate),
              {
                location: location,
                description:
                  '<a href="' + description + '" target="_blank" >Agenda</a>',
                guests: guests,
              }
            );
          } else {
            // make regular event
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
          }
        } else {
          if (startTime === "" && endTime === "") {
            // make all-day event
            eventSeries = calendar.createAllDayEventSeries(
              title,
              eventDate,
              CalendarApp.newRecurrence().addDate(eventDate),
              {
                location: location,
                description: description,
                guests: guests,
              }
            );
          } else {
            // make regular event
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
    Logger.log('Created "' + title + '" on ' + dateStartTime + "!");
  }
  return "Events created! Go to your Google Calendar...";
}
