// TEMP FILE OF WORKING MODULE
// NEED TO INTEGRATE

function myFunction() {

  var frequency = 2; // provided by user

  var eventIndex = 0;
  var date = ["Tue Jan 21 2025", "Tue Feb 04 2025", "Wed Feb 12 2025", "Thu Feb 27 2025", "Fri Mar 07 2025", "Wed Mar 19 2025", "Mon Mar 31 2025", "Tue Apr 08 2025", "Wed Apr 23 2025", "Thu May 01 2025", "Fri May 09 2025", "Mon May 19 2025", "Wed May 28 2025", "Thu Jun 05 2025"]; // date is app is a dictionary, so this is essentially Object.keys(date)
  var firstEvent = true;
  var eventSeries = ["eventSeriesJ", "eventSeriesI", "eventSeriesA"];
  var indexKeep = eventSeries.length*(frequency-1); // start
  var firstDate = [];
  var firstDateIndex = eventSeries.length*(frequency-1);
  for (var n = 0; n < eventSeries.length; n++) {
    firstDate[n] = date[firstDateIndex]; // using strings and arrays for simplicity
    firstDateIndex++;
  }

  for (var datestr in date) {
    var eventDate = date[datestr]; // again, using strings and arrays for simplicity
      if (eventIndex === indexKeep) {
        indexKeep++;
        if (indexKeep % eventSeries.length === 0) // <--- wait every eventSeries.length
          indexKeep = indexKeep + eventSeries.length*(frequency-1);
        if (eventIndex >= eventSeries.length + eventSeries.length*(frequency-1)) {
          firstEvent = false;
        }
        if (firstEvent) {
          eventSeries[eventIndex % eventSeries.length] = firstDate[eventIndex % eventSeries.length];
        }
        else {
          eventSeries[eventIndex % eventSeries.length] = eventSeries[eventIndex % eventSeries.length].concat(", " + eventDate); // similar to chaining events
        }
      }

    // Log which events were added
    eventIndex++;
  }

  for (var i in eventSeries) {
    Logger.log("eventSeries[" + i + "] = " + eventSeries[i]);
  }
}