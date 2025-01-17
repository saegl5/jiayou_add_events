// TEMP FILE OF WORKING MODULE
// NEED TO INTEGRATE

function myFunction() {

  var frequency = 3;
  var eventSeries = ["J", "I", "A"];
  var eventIndex = 0;
  var indexKeep = eventSeries.length*(frequency-1); // start
  var firstEvent = true;
  var events = [];

  for (e = 0; e < 49; e++) {
    events.push(eventSeries[e % eventSeries.length] + e); // in all, say
  }
  Logger.log(events);

  var firstDate = [];
  var firstIndexKeep = eventSeries.length*(frequency-1);
  for (var n = 0; n < eventSeries.length; n++) {
    firstDate[n] = events[firstIndexKeep];
    firstIndexKeep++;
  }
  Logger.log(firstDate);

  for (var _ in events) { // 7 3, 9 4, 11 5, 13 6->16

      if (eventIndex === indexKeep) {
        indexKeep++;
        if (indexKeep % eventSeries.length === 0) { // <--- wait every eventSeries.length
          indexKeep = indexKeep + eventSeries.length*(frequency-1);
        }
        if (eventIndex >= eventSeries.length + eventSeries.length*(frequency-1)) {
          firstEvent = false;
        }
        if (firstEvent) {
          eventSeries[eventIndex % eventSeries.length] = firstDate[eventIndex % eventSeries.length]; // <-- changed
        }
        else {
          eventSeries[eventIndex % eventSeries.length] = eventSeries[eventIndex % eventSeries.length].concat(", " + events[eventIndex]);
        }
      }

    // Log which events were added
    eventIndex++;
  }

    Logger.log("eventSeries[" + 0 + "] = " + eventSeries[0]);
    Logger.log("eventSeries[" + 1 + "] = " + eventSeries[1]);
    Logger.log("eventSeries[" + 2 + "] = " + eventSeries[2]);
}