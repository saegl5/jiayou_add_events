// Add 加油 ("jiā yóu") Events
// Modify the following search parameters and event settings, then press |> Run

// Search parameters
var myCalendarName = "JIA YOU"; // Must name it differently from the owner name
var myQuery = "J Day"; // Letter day on which you want to create an event, query ignores any extra spacing

// Event settings
var myCalendarNameAlt = ""; // Input name to create events on an alternate calendar on the same letter day, same naming convention applies
var myTitle = "New Meeting";
var myGuests = ""; // comma-separated list of email addresses
var myLocation = "Location";
var myDescription = "Agenda"; // string or URL, if URL then text to display will be "Agenda"
var myStart = ""; // Confine date range
var myEnd = ""; // Confine date range
// Accepted date formats: Mmm DD YYYY, MM/DD/YYYY, DD Mmm YYYY
// Why not accept YYYY/MM/DD ? Because it defaults to Coordinated Universal Time
var myStartTime = "10:00";
var myEndTime = "11:00";
// Accepted time format: 24-hour
var myDryRun = false; // test script before running it in production





// -----------------------------------------------------------------------------------
// ** WARNING **
// If the script below is modified improperly, running it may cause irrevocable damage.
// The script below comes with absolutely no warranty. Use it at your own risk.

function addEvents() {
  var calendarName = myCalendarName;
  var calendarNameAlt = myCalendarNameAlt;
  var calendars = CalendarApp.getAllCalendars(); // Get all calendars
  var calendarId = ""; // Initially null
  var calendarIdAlt = ""; // Initially null

  // Loop through all calendars and find the one with the matching name
  for (var i = 0; i < calendars.length; i++) {
    if (calendars[i].getName() === calendarName) {
      // Logger.log(
      //   'Calendar ID for "' + calendarName + '": ' + calendars[i].getId()
      // );
      calendarId = String(calendars[i].getId()); // Assign the calendar ID
    }
  }

  // Check if loop finds no calendar
  if (calendarId === "") {
    return "No \"" + calendarName + "\" calendar exists!";
  }

  // Repeat loop for alternate calendar (if one exists)
  if (calendarNameAlt !== "") {
    for (var j = 0; j < calendars.length; j++) {
      if (calendars[j].getName() === calendarNameAlt) {
        // Logger.log(
        //   'Calendar ID for "' + calendarNameAlt + '": ' + calendars[j].getId()
        // );
        calendarIdAlt = String(calendars[j].getId()); // Assign the calendar ID
      }
    }
  }

  // Check if loop finds no calendar
  if (calendarNameAlt !== "" && calendarIdAlt === "") {
    return "No \"" + calendarNameAlt + "\" calendar exists!";
  }

  // Access the calendar
  var calendar = CalendarApp.getCalendarById(calendarId);
  if (calendarNameAlt !== "") {
    var calendarAlt = CalendarApp.getCalendarById(calendarIdAlt);
  }

  // Check for null dates
  if (myStart !== "" && myEnd !== "") {
    // Set the search parameters
    var query = myQuery;
    myStart = new Date(myStart);
    myEnd = new Date(myEnd); // excluded from search
    myEnd.setDate(myEnd.getDate() + 1); // include end date in search

    // Search for events with title "J Day" between start and end dates
    var events = calendar.getEvents(myStart, myEnd, { search: query });
  } else {
    // Set the search parameters
    var query = myQuery;
    var now = new Date();
    var oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(now.getFullYear() + 1);

    // Search for events with title "J Day" between now and one year from now
    var events = calendar.getEvents(now, oneYearFromNow, { search: query });
  }

  // Check if query finds no events
  if (events.length === 0) {
    return "No \"" + query + "\" events exist!";
  }

  // Check if times are null
  if (myStartTime === "" && myEndTime === "") {
    myStartTime = "00:00";
    myEndTime = "24:00";
  }

  // Split strings into lists of hours and minutes
  myStartTime = myStartTime.split(":");
  myStartTime[0] = parseInt(myStartTime[0]);
  myStartTime[1] = parseInt(myStartTime[1]);

  myEndTime = myEndTime.split(":");
  myEndTime[0] = parseInt(myEndTime[0]);
  myEndTime[1] = parseInt(myEndTime[1]);

  // Track dates when events with title "J Day" occur
  var datesWithJ = {};

  // Loop through each event found
  events.forEach(function(event) {
    var eventDate = event.getStartTime();

    // Extract just the date part as a string
    var dateKey = eventDate.toDateString();

    // Store the date in the dictionary
    datesWithJ[dateKey] = true;
  });

  // Iterate over the dates with events titled "J Day" and create a new event at 10:00 AM
  for (var dateStr in datesWithJ) {
    var eventDate = new Date(dateStr); // Cast "eventDate" as a function
    var dateStartTime = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate(),
      myStartTime[0],
      myStartTime[1]
    );
    var dateEndTime = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate(),
      myEndTime[0],
      myEndTime[1]
    );

    if (!myDryRun) {

      // Check if description is a link
      if (myDescription.includes("http")) {
          // Create the new event
        if (calendarNameAlt !== "") {
          calendarAlt.createEvent(myTitle, dateStartTime, dateEndTime, {
            location: myLocation,
            description: '<a href="' + (myDescription) + '" target="_blank" >Agenda</a>',
            guests: myGuests,
          });
        } else {
          calendar.createEvent(myTitle, dateStartTime, dateEndTime, {
            location: myLocation,
            description: '<a href="' + (myDescription) + '" target="_blank" >Agenda</a>',
            guests: myGuests,
          });
        }
      } else {
        // Create the new event
        if (calendarNameAlt !== "") {
          calendarAlt.createEvent(myTitle, dateStartTime, dateEndTime, {
            location: myLocation,
            description: myDescription,
            guests: myGuests,
          });
        } else {
          calendar.createEvent(myTitle, dateStartTime, dateEndTime, {
            location: myLocation,
            description: myDescription,
            guests: myGuests,
          });
        }
      }

    }

    // Log which events were added
    Logger.log("Created a new event on " + dateStartTime);
  }
  return "Events created!";
}
