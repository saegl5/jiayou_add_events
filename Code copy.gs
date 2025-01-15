// TEMP FILE OF WORKING MODULE
// NEED TO INTEGRATE

function myFunction() {

  var frequency = 3;
  var eventSeries = ["J", "I", "A"];
  var eventIndex = 0;
  var indexKeep = 0;
  var firstEvent = true;
  var events = [];

  for (e = 0; e < 49; e++) {
    events.push(eventSeries[e % eventSeries.length] + e); // in all, say
  }
  Logger.log(events);

  var firstDate = [];
  var firstIndexKeep = eventSeries.length*(frequency-1); // not working on multiple days for frequency 2+
  for (var n = 0; n < eventSeries.length; n++) {
    firstDate[n] = events[firstIndexKeep];
    Logger.log("start[" + n + "], = " + events[firstIndexKeep]);
    firstIndexKeep++;
    // firstIndexKeep = firstIndexKeep + frequency;
  }

  // go back, maybe just jump like 01 -> 23

  // JIAYOU*JI*AYOUJIAYOUJIAYOU

  for (var _ in events) { // 7 3, 9 4, 11 5, 13 6->16

    // function nested because it relies on many parameters
      if (eventIndex % frequency === frequency-1) {
        if (eventIndex >= eventSeries.length + eventSeries.length*(frequency-1))
          // could also use query.length
          firstEvent = false;
        if (firstEvent) {
            // make regular event
            eventSeries[indexKeep] = firstDate[indexKeep];
          // can't set firstEvent = false yet
          // Logger.log("start[" + indexKeep + "], eventSeries[" + indexKeep + "] = " + eventSeries[indexKeep]);
        } // chain subsequent event to first event
        else {
            if (events[indexKeep + (Math.floor((indexKeep+eventSeries.length)/eventSeries.length))*eventSeries.length*(frequency-1)] === undefined) {
              // skip
            }
            else {
              eventSeries[indexKeep % eventSeries.length] = eventSeries[indexKeep % eventSeries.length].concat(", " + events[indexKeep + (Math.floor((indexKeep+eventSeries.length)/eventSeries.length))*eventSeries.length*(frequency-1)]);
            }
        }
        indexKeep++;
      }

    // Log which events were added
    eventIndex++;
  }

    Logger.log("eventSeries[" + 0 + "] = " + eventSeries[0]);
    Logger.log("eventSeries[" + 1 + "] = " + eventSeries[1]);
    Logger.log("eventSeries[" + 2 + "] = " + eventSeries[2]);
}

// OUTPUT

// 1:21:30 AM	Notice	Execution started
// 1:21:30 AM	Info	eventSeries[0] = J6, J15, J24, J33, J42
// 1:21:30 AM	Info	eventSeries[1] = I7, I16, I25, I34, I43
// 1:21:30 AM	Info	eventSeries[2] = A8, A17, A26, A35, A44
// 1:21:30 AM	Notice	Execution completed