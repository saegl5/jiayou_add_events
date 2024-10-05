// ** WARNING **
// If the script below is modified improperly, running it may cause irrevocable damage.
// The script below comes with absolutely no warranty. Use it at your own risk.

function doGet() {
  return HtmlService.createHtmlOutputFromFile("Index");
}

// Used by Index.html for username, dropdown list of calendar names and default calendar name
function getCalendarNamesAndDefault() {
  let userName = Session.getActiveUser().getEmail();
  let allCalendars = CalendarApp.getAllCalendars();
  let allCalendarNames = [];
  for (const calendar of allCalendars) {
    allCalendarNames.push(calendar.getName());
  }
  let defaultCalendarName = CalendarApp.getDefaultCalendar().getName();
  return {
    username: userName,
    calendars: allCalendarNames,
    default: defaultCalendarName,
  };
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

  // handle exception
  if (query.length === 0) return "Select a letter day!";

  // Loop through all calendars and find the one with the matching name
  for (var i = 0; i < calendars.length; i++) {
    if (calendars[i].getName() === calendarName) {
      calendarId = String(calendars[i].getId()); // Assign the calendar ID
    }
  }

  // Find reference calendar
  var found = false;
  for (var j = 0; j < calendars.length; j++) {
    if (found === false) {
      var now = new Date();
      var oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(now.getFullYear() + 1); // sooner, if calendar cuts off
      var eventFind = calendars[j].getEvents(now, oneYearFromNow);
      for (var k = 0; k < eventFind.length; k++) {
        var event = eventFind[k];
        if (query.includes(event.getTitle())) {
          calendarIdRef = String(calendars[j].getId()); // Assign the calendar ID
          found = true;
          break;
        }
      }
    }
  }

  // check if reference calendar doesn't exist
  if (calendarIdRef === "") {
    return "JIA YOU calendar does not exist!"; // handle error
  }

  // Access the user calendar and reference calendar
  var calendar = CalendarApp.getCalendarById(calendarId);
  var calendarRef = CalendarApp.getCalendarById(calendarIdRef); // calendar is still hard-coded, but this way the ID is hidden

  // handle additional exceptions
  if (start.includes(",") || end.includes(",")) {
    return "Use accepted date formats!"; // for consistency
  }
  if (
    startTime.includes("am") ||
    startTime.includes("pm") ||
    !startTime.includes(":") ||
    !startTime.includes(" ") ||
    endTime.includes("am") ||
    endTime.includes("pm") ||
    !endTime.includes(":") ||
    !endTime.includes(" ")
  ) {
    return "Use accepted time formats!";
  } // for consistency

  const regex = /^\d{4}-(\d{2})-(\d{2})$/; // regular expression for identifying a ISO-formatted date (YYYY-MM-DD)

  // Check for null dates
  if (start !== "" && end !== "") {
    // Set the search parameters
    // but test if dates are ISO-formatted first
    if (regex.test(start) === true) {
      start = new Date(start);
      start = adjustTime(start);
    } else start = new Date(start);
    if (regex.test(end) === true) {
      end = new Date(end); // excluded from search
      end = adjustTime(end);
      end.setDate(end.getDate() + 1); // include end date in search
    } else {
      end = new Date(end); // excluded from search
      end.setDate(end.getDate() + 1); // include end date in search
    }
    // Search for events with title between start and end dates
    search(start, end);
  } else if (start === "" && end !== "") {
    // Set the search parameters
    var now = new Date();
    // test if date is ISO-formatted first
    if (regex.test(end) === true) {
      end = new Date(end); // excluded from search
      end = adjustTime(end);
      end.setDate(end.getDate() + 1); // include end date in search
    } else {
      end = new Date(end); // excluded from search
      end.setDate(end.getDate() + 1); // include end date in search
    }
    // Search for events with title between now and end date
    search(now, end);
  } else if (start !== "" && end === "") {
    // Set the search parameters
    // but test if date is ISO-formatted first
    if (regex.test(start) === true) {
      start = new Date(start);
      start = adjustTime(start);
    } else start = new Date(start);
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
      for (var l = 0; l < eventsAll.length; l++) {
        var event = eventsAll[l];
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
    // Parse the time, and convert 12-hour time to 24-hour time if AM/PM utilized
    startTime = parseTime(startTime);

    endTime = [];
    endTime[0] = startTime[0] + 1; // simply add 1 hour
    endTime[1] = startTime[1];
  } else if (startTime === "" && endTime !== "") {
    // Parse the time, and convert 12-hour time to 24-hour time if AM/PM utilized
    endTime = parseTime(endTime);

    startTime = [];
    startTime[0] = endTime[0] - 1; // simply subtract 1 hour
    startTime[1] = endTime[1];
  } else {
    // Parse the time, and convert 12-hour time to 24-hour time if AM/PM utilized
    startTime = parseTime(startTime);
    endTime = parseTime(endTime);
  }

  // Track dates when events with title occur
  var date = {};

  // Event counter
  var eventIndex = 0;

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
  // get letter days from query
  var eventSeries = [];
  for (var m = 0; m < query.length; m++) {
    if (query[m].includes("J")) eventSeries[m] = "eventSeriesJ";
    else if (query[m].includes("I")) eventSeries[m] = "eventSeriesI";
    else if (query[m].includes("A")) eventSeries[m] = "eventSeriesA";
    else if (query[m].includes("Y")) eventSeries[m] = "eventSeriesY";
    else if (query[m].includes("O")) eventSeries[m] = "eventSeriesO";
    else if (query[m].includes("U")) eventSeries[m] = "eventSeriesU";
  }
  // breaking up the series like this helps mitigate issue #4
  // https://github.com/saegl5/jiayou_add_events/issues/4

  // extract the first date from the dictionary
  var firstDate = []; // may have multiple first dates
  var dateStartTime = []; // subsequently, may have multiple dateStartTimes
  var dateEndTime = []; // subsequently, may have multiple dateEndTimes

  // not all letter days may be used, but it is still easy to pair up firstDate with the letter
  for (var n = 0; n < eventSeries.length; n++) {
    firstDate[n] = new Date(Object.keys(date)[n]); // need to cast key as a function
    dateStartTime[n] = new Date(
      firstDate[n].getFullYear(),
      firstDate[n].getMonth(),
      firstDate[n].getDate(),
      startTime[0],
      startTime[1]
    );
    dateEndTime[n] = new Date(
      firstDate[n].getFullYear(),
      firstDate[n].getMonth(),
      firstDate[n].getDate(),
      endTime[0],
      endTime[1]
    );
  }

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
      createEvent(includesHttp); // split up events, all of which have the same event details, into separate series
    }

    // function nested because it relies on many parameters
    function createEvent(includesHttp) {
      if (eventIndex === eventSeries.length)
        // could also use query.length
        firstEvent = false;
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
          eventSeries[eventIndex] = calendar.createAllDayEventSeries(
            title,
            firstDate[eventIndex], // can also put `firstDate`
            CalendarApp.newRecurrence().addDate(eventDate),
            eventOptions
          );
        } else {
          // make regular event
          eventSeries[eventIndex] = calendar.createEventSeries(
            title,
            dateStartTime[eventIndex],
            dateEndTime[eventIndex],
            CalendarApp.newRecurrence().addDate(eventDate),
            eventOptions
          );
        }
        // can't set firstEvent = false yet
      } // chain subsequent event to first event
      else {
        if (startTime === "" && endTime === "") {
          eventSeries[eventIndex % eventSeries.length].setRecurrence(
            CalendarApp.newRecurrence().addDate(eventDate),
            firstDate[eventIndex % eventSeries.length] // date of first event only
          );
        } else {
          eventSeries[eventIndex % eventSeries.length].setRecurrence(
            CalendarApp.newRecurrence().addDate(eventDate),
            dateStartTime[eventIndex % eventSeries.length], // date start time of first event only
            dateEndTime[eventIndex % eventSeries.length] // date end time of first event only
          );
        }
      }

      return null;
    }

    // Log which events were added
    Logger.log('Created "' + title + '" on ' + eventDate + "!");
    eventIndex++;
  }

  return "Events created! Go to your Google Calendar...";
}

// Function to adjust time for ISO-formatted date
function adjustTime(isoDate) {
  // Dates formatted as YYYY-MM-DD use Coordinated Universal Time, whereas dates formatted differently use local time
  // So, we will have to adjust ISO dates' time
  let timezoneOffset = isoDate.getTimezoneOffset(); // in minutes, varies depending on local time zone and daylight saving time (if observed)
  let adjustedTime = isoDate.getTime() + timezoneOffset * 60 * 1000; // milliseconds since January 1, 1970 00:00:00 + timezoneOffset in milliseconds
  let adjustedDate = new Date(adjustedTime);

  return adjustedDate;
}

// Function to parse the time and to convert 12-hour time to 24-hour time if AM/PM utilized
function parseTime(time) {
  let [timePart, modifier] = time.split(" "); // modifier ignored if missing
  time = timePart.split(":");

  // Split strings into lists of hours and minutes
  time[0] = parseInt(time[0]);
  time[1] = parseInt(time[1]);

  if (modifier === "AM" && time[0] === 12) time[0] = time[0] - 12;
  else if (modifier === "PM" && time[0] !== 12) time[0] = time[0] + 12;

  return time;
}
