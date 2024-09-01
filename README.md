# Add 加油 ("jiā yóu") Events

Google Apps Script for batch creating additional events on only certain letter days (e.g., on only "J Day's"). Modify as needed, and back up your calendars before you run the script. These events are not recurring events, so without a batch script one would need to add these events manually.

## Visual Example

<img src="screenshots/calendarForm.png" alt="screenshot of calendar form" width="800"><br>Form for creating additional "JIA YOU" events.

<img src="screenshots/calendar.png" alt="screenshot of calendar" width="800"><br>Additional events on only "J Day's" were created.

## Getting Started

1. Go to [Google Apps Script](https://script.google.com/), and create a new project.
2. Copy and paste [the script](./Code.gs) into the editor, and save the file.
3. Create an HTML file, and name it "Index."
4. Copy and paste [the markup text](./Index.html) into the editor, and save the file.
5. Deploy the project as a Web app, and open the assigned URL.
6. Modify the calendar name, search query, events' title, location, description, start time, and end time. (***Must name the calendar differently from the owner name, otherwise the script will not create events.***)
7. Name an alternate calendar to create events on the alternate calendar. (***Same naming convention applies.***)
8. Press submit. (Requires authorization. ***Note also that creating calendar events is subject to a [use limit](https://support.google.com/a/answer/2905486?hl=en).***)

<hr>
Made with &heartsuit; in Visual Studio Code