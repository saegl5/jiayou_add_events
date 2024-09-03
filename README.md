# Add 加油 ("jiā yóu") Events

Google Apps Script for batch creating additional events on only certain days (e.g., on only "J Day's"). Modify as needed.

## Visual Example

<img src="screenshots/calendar.png" alt="screenshot of calendar" width="800"><br>Additional events on only "J Day's" were created.

## Getting Started

1. Go to [Google Apps Script](https://script.google.com/), and create a new project.
2. Copy and paste [the script](./Code.gs) into the editor.
3. Modify the calendar name. (By default, it is "JIA YOU." ***Must name it differently from the owner name, otherwise the script will not create events.***)
4. If you want to create events on an alternate calendar, modify the alternate calendar name. (***Same naming convention applies.***)
5. Modify the search query. (By default, it is "J Day." Specifically, `myQuery = "J Day";`)
6. Modify the events' title, location, description, start time, and end time. (By default, events are titled "New Meeting," located at "Location," described as "Agenda," start at 10am, and end at 11am.)
7. Save and run the script. (Requires authorization. ***Note also that creating calendar events is subject to a [use limit](https://support.google.com/a/answer/2905486?hl=en).***)

### Web App

To deploy the project as a web app, please consult the [development branch](https://github.com/saegl5/jiayou_add_events/tree/development).

<hr>
Made with &heartsuit; in Visual Studio Code