// TEMP FILE OF WORKING MODULE
// NEED TO INTEGRATE

// eventSeries = JIA
// freq = 1-3
// eventIndex = 0-12

var events = [];
for (e = 0; e < 50; e++) {
  events.push("\"" + e + "\""); // in all, say
}

var firstEvent = true;
var eventSeries = ["J", "I", "A", "Y", "O", "U"]; // JIAYOU
var freq = 3; // 1-3
var eventIndex = 0; // 1-3
var count = 0; // <--- new

function myFunction() {

  for (var _ in events) { // for each event <--- don't increment more!!!!
    // if (eventIndex % eventSeries.length === 0)
    //   eventIndex = eventIndex + eventSeries.length*(freq-1);

    if (eventIndex % freq === freq-1) { // may need adjusted

      if (eventIndex >= eventSeries.length + eventSeries.length*(freq-1)) // + eventSeries.length*(freq-1)) <-- notice >
        firstEvent = false;
      if (firstEvent) {
        // eventSeries[eventIndex - eventSeries.length*(freq-1)] = events[eventIndex];
        eventSeries[count] = events[eventIndex];
        count++;
      }
      else {
        // eventSeries[eventIndex % eventSeries.length] = eventSeries[eventIndex % eventSeries.length].concat(", " + events[eventIndex]);
        eventSeries[count % eventSeries.length] = eventSeries[count % eventSeries.length].concat(", " + events[eventIndex]);
        count++;
      }
    }
    eventIndex++;

  }

  for (i = 0; i < eventSeries.length; i++) {
    Logger.log("eventSeries[" + i + "] = [" + eventSeries[i] + "]");
  }

}

// OUTPUT

// 1:27:22 AM	Notice	Execution started
// 1:27:22 AM	Info	eventSeries[0] = ["2", "20", "38"]
// 1:27:22 AM	Info	eventSeries[1] = ["5", "23", "41"]
// 1:27:22 AM	Info	eventSeries[2] = ["8", "26", "44"]
// 1:27:22 AM	Info	eventSeries[3] = ["11", "29", "47"]
// 1:27:22 AM	Info	eventSeries[4] = ["14", "32"]
// 1:27:22 AM	Info	eventSeries[5] = ["17", "35"]
// 1:27:22 AM	Notice	Execution completed