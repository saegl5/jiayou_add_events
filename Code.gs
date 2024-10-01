// ** WARNING **
// If the script below is modified improperly, running it may cause irrevocable damage.
// The script below comes with absolutely no warranty. Use it at your own risk.

function doGet() {
  return HtmlService.createHtmlOutputFromFile("Index");
}

// Used by Index.html for default calendar name
function getDefaultName() {
  let defaultCalendarName = CalendarApp.getDefaultCalendar().getName();
  return defaultCalendarName;
}

// Used by Index.html for dropdown list of calendar names
function getCalendarNames() {
  let allCalendars = CalendarApp.getAllCalendars();

  let allCalendarNames = [];
  for (const calendar of allCalendars) {
    allCalendarNames.push(calendar.getName());
  }
  return allCalendarNames;
}

function addEvents(
  calendarName,
  query,
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
  var calendarIdRef = ""; // Initially null

  // Loop through all calendars and find the one with the matching name
  for (var i = 0; i < calendars.length; i++) {
    if (calendars[i].getName() === calendarName) {
      calendarId = String(calendars[i].getId()); // Assign the calendar ID
    }
  }

  // Repeat loop for reference calendar
  for (var j = 0; j < calendars.length; j++) {
    if (calendars[j].getName() === "Internal Calendar") {
      calendarIdRef = String(calendars[j].getId()); // Assign the calendar ID
    }
  }

  // Access the user calendar and reference calendar
  var calendar = CalendarApp.getCalendarById(calendarId);
  var calendarRef = CalendarApp.getCalendarById(calendarIdRef); // calendar is still hard-coded, but this way the ID is hidden

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
      var eventsAll = calendarRef.getEvents(from, to);
      events = [];
      for (var k = 0; k < eventsAll.length; k++) {
        var event = eventsAll[k];
        if (query.includes(event.getTitle())) {
          // may also pick up shorter titles, but it is unlikely such shorter titles may exist
          // MORE RELIABLE THAN `{ search: query }`!
          // `event.getTitle() === query` could work too, must use for updating/deleting scripts though
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

  // chain subsequent events to the first event
  var firstEvent = true;
  var eventSeries = "";

  // extract the first date from the dictionary
  var firstDateStr = Object.keys(date)[0];
  var firstDate = new Date(firstDateStr); // need to cast "firstDateStr" as a function
  var dateStartTime = new Date(
    firstDate.getFullYear(),
    firstDate.getMonth(),
    firstDate.getDate(),
    startTime[0],
    startTime[1]
  );
  var dateEndTime = new Date(
    firstDate.getFullYear(),
    firstDate.getMonth(),
    firstDate.getDate(),
    endTime[0],
    endTime[1]
  );

  // check invalid time range
  if (dateStartTime > dateEndTime) {
    return "Event start time must be before event end time"; // handle error
  }

  // Iterate over the dates with events titled query and create a new event for the series at start time
  for (var dateStr in date) {
    var eventDate = new Date(dateStr); // "eventDate" above is isolated in its own loop
    if (!dryRun) {
      // Check if description is a link
      let includesHttp = description.includes("http");
      // Create the new event
      createEvent(includesHttp);
    }

    // function nested because it relies on many parameters
    function createEvent(includesHttp) {
      if (firstEvent) {
        var eventOptions = {
          location: location,
          description: includesHttp
            ? `<a href="${description}" target="_blank" >Agenda</a>`
            : description,
          guests: guests,
        };

        if (startTime === "" && endTime === "") {
          // make all-day event
          eventSeries = calendar.createAllDayEventSeries(
            title,
            eventDate, // can also put `firstDate`
            CalendarApp.newRecurrence().addDate(eventDate),
            eventOptions
          );
        } else {
          // make regular event
          eventSeries = calendar.createEventSeries(
            title,
            dateStartTime,
            dateEndTime,
            CalendarApp.newRecurrence().addDate(eventDate),
            eventOptions
          );
        }
        firstEvent = false;
      } else {
        if (startTime === "" && endTime === "") {
          eventSeries.setRecurrence(
            CalendarApp.newRecurrence().addDate(eventDate),
            firstDate // date of first event only
          );
        } else {
          eventSeries.setRecurrence(
            CalendarApp.newRecurrence().addDate(eventDate),
            dateStartTime, // date start time of first event only
            dateEndTime // date end time of first event only
          );
        }
      }
      return null;
    }

    // Log which events were added
    Logger.log('Created "' + title + '" on ' + eventDate + "!");
  }
  return "Events created! Go to your Google Calendar...";
}
