# Add 加油 ("jiā yóu") Events

Google Web app for creating recurring events on only certain letter days (e.g., on only "J Day's"). Modify as needed, and back up your calendars before you run the app. Without an app script, one would need to add these events manually.

## Visual Example

<img src="screenshots/calendarForm.png" alt="screenshot of calendar form" width="500"><br>Form for creating additional "JIA YOU" events.

<img src="screenshots/calendar.png" alt="screenshot of calendar" width="800"><br>Additional events on only "J Day's" were created.

## Prerequisites

1. Access to [Google Apps Script](https://script.google.com/)
2. 加油 ("jiā yóu") calendar must already exist. If it doesn't, consult the [Web app for creating the calendar](https://github.com/saegl5/jiayou_create_calendar).

## Getting Started

1. Go to [Google Apps Script](https://script.google.com/), and create a new project.
2. Copy and paste [the script](./Code.gs) into the editor, and save the file.
3. Run the script to acquire authorization.
4. Create an HTML file, and name it "Index."
5. Copy and paste [the markup text](./Index.html) into the editor, and save the file.
6. Deploy the project as a Web app, and open the assigned URL.
7. Modify the calendar name, search query, events' title, guests, location, description, start time, and end time. (**_Must name the calendar differently from the owner name, otherwise the app will not create events._** If you input a URL for the description, text to display will be "Agenda.")
8. Name an alternate calendar to create events on the alternate calendar. (**_Same naming convention applies._**)
9. Confine the date range by inputting a start date and end date.
10. Optionally perform a dry run to test the Web app before running it in production. Consult logs for output.
11. Press submit. (Requires another authorization. **_Note also that creating calendar events is subject to a [use limit](https://support.google.com/a/answer/2905486?hl=en)._**)

## Known Issue

Events disappear when saving edits for "this and following events." (Investigating!)

## Next Steps

- If you deploy the Web app such that it executes as `User accessing the web app` where `Anyone with Google account` can access it, then you can share the URL for them to add events to a calendar in their own account. (You may wish to hide the dry run option.)
- Edit or delete individual events, individual and subsequent events, or all events directly in [Google Calendar](https://calendar.google.com/calendar/).
- Feel free to fork!
- Additional Web apps are no longer needed. ([Web app for updating events](https://github.com/saegl5/jiayou_update_events) and [Web app for deleting events](https://github.com/saegl5/jiayou_delete_events) have now been deprecated.)


## End-user instructions
If you haven't already, first create a JIAYOU calendar in the other form if you haven't already.
1. Select your newly-created calendar to put your event in
2. Choose which JIAYOU days the event occurs
3. Add a title and the optional event info if necessary
4. Add start and end date. This will add the event to the checked JIAYOU days (from step 2) in between these two dates.
   - If left blank, it will add the event to ALL checked JIAYOU dates, starting from today to 1 year from now
   - Type them out as MM/DD/YYYY (e.g. 12/31/2024). There are 2 other formats as stated in the form below the text fields if you prefer those instead.
5. Set start and end time. 
   - If left blank, the event will be added as an All-day event.
   - 24 hour time is necessary 
6. After everything is inputted, click Submit. It may take a while, but it will say that it is complete when all events are created.

<hr>
Made with &heartsuit; in Visual Studio Code
