# Add 加油 ("jiā yóu") Events

Google Web app for creating recurring events on only certain letter days (e.g., on only "J Day's"). Modify as needed, and back up your calendars before you run the app. Without an app script, one would need to add these events manually.

## Visual Example

<img src="screenshots/calendarForm.png" alt="screenshot of calendar form" width="500"><br>Form for creating additional "JIA YOU" events. (Username and calendar name are hidden.)

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
6. Next to Services, add a service: "Google Calendar API."
7. Deploy the project as a Web app, and open the assigned URL.
8. Check the username to ensure that you opened the URL in the correct account.
9. Select your calendar name, and choose letter days on which you want to add events. (The Web app will automatically generate calendars that it can find and select your default one. In the background, it will also automatically locate the 加油 calendar.)
10. Modify the events' title, guests, location, and description. (If you input a URL for the description, text to display will be "Agenda.")
11. Modify the events' start time and end time. (If left blank, events will be added as all-day events.)
12. Confine the date range by inputting a start date and end date. (If left blank, events will be added to all chosen letter days, starting from today and ending one year from today.)
13. Optionally perform a dry run to test the Web app before running it in production. Consult logs for output.
14. Press submit. (Requires another authorization. **_Note also that creating recurring events is subject to a [use limit](https://support.google.com/calendar/answer/37115)._**)

## Next Steps

- Edit or delete individual events, individual and subsequent events, or all events directly in [Google Calendar](https://calendar.google.com/calendar/).
- If you deploy the Web app such that it executes as `User accessing the web app` where `Anyone with Google account` can access it, then you can share the URL for them to add events to a calendar in their own account. (You may wish to hide the dry run option.)
- Feel free to fork!
- Additional Web apps are no longer needed. ([Web app for updating events](https://github.com/saegl5/jiayou_update_events) and [Web app for deleting events](https://github.com/saegl5/jiayou_delete_events) have now been deprecated.)

## Known Issue

While you _can_ drag and drop single events of a series to another day or edit the day of a single event of a series, you _cannot_ drag and drop single and subsequent events as a series to another day or edit the day of them all at once. Google Calendar does not handle changing days of these events (i.e., events chained by date) properly. So, treat event days as fixed days. If you need to adjust the events' days, delete the events in Google Calendar, and re-create them using this Web app.

<hr>
Made with &heartsuit; in Visual Studio Code

<br>

A special thank you to James Armstrong for adding recurring events, the calendar name dropdown menu, letter day checkboxes, etc.
