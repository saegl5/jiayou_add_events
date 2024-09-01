# Add 加油 ("jiā yóu") Events

Google Apps Script for batch creating additional events on only certain letter days (e.g., on only "J Day's"). Modify as needed, and back up your calendars before you run the script. These events are not recurring events, so without a batch script one would need to add these events manually.

## Visual Example

<img src="screenshots/calendarForm.png" alt="screenshot of calendar form" width="800"><br>Form for creating additional "JIA YOU" events.

<img src="screenshots/calendar.png" alt="screenshot of calendar" width="800"><br>Additional events on only "J Day's" were created.

## Getting Started <-- NEEDS EDITED

1. Go to [Google Apps Script](https://script.google.com/), and create a new project.
2. Copy and paste [the script](./Code.gs) into the editor.
3. Modify the calendar name. (By default, it is "JIA YOU." ***Must name it differently from the owner name, otherwise the script will not create events.***)
4. If you want to create events on an alternate calendar, name an alternate calendar. (***Same naming convention applies.***)
5. Modify the search query. (By default, it is "J Day." Specifically, `myQuery = "J Day";`)
6. Modify the events' title, location, description, start time, and end time. (By default, events are titled "New Meeting," located at "Location," described as "Agenda," start at 10 AM, and end at 11 AM.)
7. Confine the date range by inputting a start date and end date.
8. Save and run the script. (Requires authorization. ***Note also that creating calendar events is subject to a [use limit](https://support.google.com/a/answer/2905486?hl=en).***)

<hr>
Made with &heartsuit; in Visual Studio Code