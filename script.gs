document.addEventListener("DOMContentLoaded", function () {
  // const selectElems = document.querySelectorAll('select');
  // M.FormSelect.init(selectElems);

  // const collapsibleElems = document.querySelectorAll(".collapsible");
  // M.Collapsible.init(collapsibleElems);

  M.AutoInit();
  load();
});

// JavaScript handles form submission and sends data to the Google Apps Script

// make var to carry over value
var username;

function load() {
  // optimized by merging into one script
  google.script.run
    .withSuccessHandler(function (response) {
      if (isChineseLanguage() === true) 
        document.getElementById("user").innerHTML = "欢迎，" + response.username + "！";
      else
        document.getElementById("user").innerHTML = "Welcome, " + response.username + "!";
      username = response.username; // backup
      const selectElement = document.querySelector('select');
      selectElement.innerHTML = ''; // Clear existing options
      for (const calendar of response.calendars) {
        // populate dropdown list
        if (calendar === response.defaultCal)
          // select option with default calendar listed
          document
            .getElementById("calendarName")
            .options.add(
              new Option(calendar + " (default)", calendar, true, true)
            );
        // syntax: new Option(text, value, defaultSelected, selected), so here this option will display the calendar name; its value will be that same name; it is selected by default; and is shown as selected
        // do not select calendar listed
        else
          document
            .getElementById("calendarName")
            .options.add(new Option(calendar, calendar, false, false)); // likewise, each other option will display the calendar name, and their value will be that same name; however, they are not selected by default and are not shown as selected
        // see also https://stackoverflow.com/questions/45379356/whats-the-difference-between-selected-and-defaultselected-when-constructing
      }
      document.getElementById("calendarNameRef").value = response.reference;
      document.getElementById("howMany").value = response.conflict;
      if (response.conflict > 1) {
        document.getElementById("wait").innerHTML = "Multiple calendars contain letter days!";
      }
      M.FormSelect.init(selectElement);
      if (response.endDate !== null) {
        document.getElementById("end").value = response.endDate;
        // document.getElementById("endRef").value = document.getElementById("end").value; // backup
        if (isChineseLanguage() === true) { // tail back
          document.getElementById("endRef").value = document.getElementById("end").value; // backup here, in case end date is changed
          document.getElementById("end").value = new Date(document.getElementById("endRef").value).toISOString().split("T")[0]; // keeps just date
        }
      }
    })
    .getCalendarNamesAndDefault();

  function isChineseLanguage() {
    const language = navigator.language || navigator.languages[0];
    return language.startsWith("zh"); // examples: zh-CN and zh-TW
  }

  if (isChineseLanguage() === true) {
    document.getElementById("chinese").checked = true;
    translate("Chinese"); // translate text to Chinese, if endDate is not null then tail back above
  }
}

function localeDateString(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  .replace(/,/g, ""); // removes comma
// Examples: Jan 4 2024, Mar 14 2025
// Format is consistent with default date format in Create 加油 ("jiā yóu") Calendar web app
}

document.getElementById("start").value = localeDateString(Date.now());

function parseTimeLocal(time) {
  let [timePart, modifier] = time.split(" "); // modifier ignored if missing
  time = timePart.split(":");

  // Split strings into lists of hours and minutes
  time[0] = parseInt(time[0]);
  time[1] = parseInt(time[1]);

  if (modifier === "AM" && time[0] === 12) time[0] = time[0] - 12;
  else if (modifier === "PM" && time[0] !== 12) time[0] = time[0] + 12;

  // add leading zero
  if (time[1] < 10) time[1] = "0" + time[1];

  // exclude modifier

  return time;
}

function parseTimeISO(time) {
  time = time.split(":");
  time[0] = parseInt(time[0]);
  time[1] = parseInt(time[1]);
  
  let modifier = undefined;

  if (time[0] === 0) {
    time[0] = 12;
    modifier = "AM";
  }
  else if (time[0] < 12) modifier = "AM";
  else if (time[0] === 12) modifier = "PM";
  else {
    time[0] = time[0] - 12;
    modifier = "PM";
  }

  // add leading zero
  if (time[1] < 10) time[1] = "0" + time[1];

  // append modifier
  time[1] = time[1] + " " + modifier;

  return time;
}

function validateTimeInput(event) {
  let inputValue = event.target.value;
  let hour = inputValue.split(":")[0]; // Extract hour part
  hour = parseInt(hour);
  let modifier = inputValue.split(" ")[1]; // Extract AM/PM part, if exists
  // let minute = inputValue.split(":")[1]?.split(" ")[0]; // Extract minute part
  // minute = parseInt(minute);

  // Ignoring negative numbers, minimum hour, cross formatting, hourly roll over, minimum and maximum minute, since maximum hour restriction is most important 

  // 12-hour format -----------
  // if (modifier !== undefined && hour === 0) { // Minimum hour is 12
  //   event.target.value = event.target.value.replace(hour, 12); // Replace prohibited text
  //   event.target.value = event.target.value.replace(modifier, "AM"); // Reset modifier
  // } 
  // if (modifier !== undefined && hour >= 24) { // Cap hour at 11 (PM), since 12 (AM) and later is next day
  //   event.target.value = event.target.value.replace(hour, 11); // Replace prohibited text
  //   event.target.value = event.target.value.replace(modifier, "PM"); // Reset modifier
  // } 
  // else if (modifier !== undefined && hour > 12) { // Otherwise, since maximum hour is also 12, roll over hour
  //   event.target.value = event.target.value.replace(hour, hour % 12); // Replace prohibited text
  //   event.target.value = event.target.value.replace(modifier, "PM"); // Reset modifier, although 12 ideally would change modifier
  // }

  // 24-hour format -----------
  if (modifier === undefined && hour >= 24) // Cap hour at 23, since 24 and greater is next day
    event.target.value = event.target.value.replace(hour, 23); // Replace prohibited text

  // 12-hour and 24-hour format -----------
  // if (minute >= 60) // Cap minute at 59, since 60 and greater is next hour
  //   event.target.value = event.target.value.replace(minute, 59); // Replace prohibited text
}

// Attach the reusable function to both startTime and endTime inputs
document.getElementById("startTime").addEventListener("input", validateTimeInput);
document.getElementById("endTime").addEventListener("input", validateTimeInput);

function translate(language) {
  if (language === "Chinese") {
    if (username !== undefined) document.getElementById("user").innerHTML = "欢迎，" + username + "！";
    document.getElementById("calendarHeader").innerHTML = "日历";
    document.getElementById("letterDayHeader").innerHTML = "字母日";
    document.getElementById("frequencyHeader").innerHTML = "频率";
    document.getElementById("titleHeader").innerHTML = "标题";
    document.getElementById("timeHeader").innerHTML = "时间";
    document.getElementsByName("collapsible-header")[0].innerHTML = "客人,&nbsp;位置,&nbsp;描述,&nbsp;日期";
    document.getElementById("guestsHeader").innerHTML = "客人";
    document.getElementById("locationHeader").innerHTML = "位置";
    document.getElementById("descriptionHeader").innerHTML = "描述";
    document.getElementById("dateHeader").innerHTML = "日期";
    document.getElementsByName("searchSection")[0].innerHTML = "搜索参数";
    document.getElementsByName("eventSection")[0].innerHTML = "事件设置";
    document.getElementsByName("calendarName")[0].innerHTML = "必须已存在";
    document.getElementsByName("numberInput")[0].innerHTML = "每一、两或三个字母日";
    // document.getElementsByName("title")[0].innerHTML = "事件的标题";
    document.getElementsByName("times")[0].innerHTML = "HH:MM AM/PM, HH:MM (24小时)";
    document.getElementsByName("guests")[0].innerHTML = "客人的电子邮件地址列表，以逗号分隔";
    // document.getElementsByName("location")[0].innerHTML = "事件的位置";
    document.getElementsByName("description")[0].innerHTML = "字符串或完整URL";
    document.getElementsByName("dates")[0].innerHTML = "Mmm DD YYYY, MM/DD/YYYY, YYYY-MM-DD";
    if (document.getElementById("title").value === "New Meeting") document.getElementById("title").value = "新会议"; // quirky in vscode preview
    document.getElementById("startTime").value = parseTimeLocal(document.getElementById("startTime").value).join(":");
    document.getElementById("startTime").placeholder = "可选的";
    document.getElementById("endTime").value = parseTimeLocal(document.getElementById("endTime").value).join(":");
    document.getElementById("endTime").placeholder = "可选的";
    document.getElementById("guests").placeholder = "可选的";
    document.getElementById("location").placeholder = "可选的";
    document.getElementById("description").placeholder = "可选的";
    document.getElementById("start").placeholder = "可选的";
    document.getElementById("end").placeholder = "可选的";
    document.getElementById("startRef").value = document.getElementById("start").value; // backup, in case start date is changed
    document.getElementById("start").value = new Date(document.getElementById("startRef").value).toISOString().split("T")[0]; // keeps just date
    document.getElementById("button").innerHTML = "提交";
    document.getElementsByName("difficulties")[0].innerHTML = "技术问题？在" + `<a href="https://github.com/saegl5/jiayou_add_events/issues">GitHub</a>` + "上搜索问题或打开一个新问题。";
    document.getElementsByName("reference")[0].innerHTML = "版本 ";
    document.getElementById("endRef").value = document.getElementById("end").value; // backup here, in case end date is changed
    document.getElementById("end").value = new Date(document.getElementById("endRef").value).toISOString().split("T")[0]; // keeps just date
  } else if (language === "English") { // default
    if (username !== undefined) document.getElementById("user").innerHTML = "Welcome, " + username + "!";
    document.getElementById("calendarHeader").innerHTML = "Calendar";
    document.getElementById("letterDayHeader").innerHTML = "Letter Days";
    document.getElementById("frequencyHeader").innerHTML = "Frequency";
    document.getElementById("titleHeader").innerHTML = "Title";
    document.getElementById("timeHeader").innerHTML = "Time";
    document.getElementsByName("collapsible-header")[0].innerHTML = "Guests,&nbsp;Location,&nbsp;Description,&nbsp;Date";
    document.getElementById("guestsHeader").innerHTML = "Guests";
    document.getElementById("locationHeader").innerHTML = "Location";
    document.getElementById("descriptionHeader").innerHTML = "Description";
    document.getElementById("dateHeader").innerHTML = "Date";
    document.getElementsByName("searchSection")[0].innerHTML = "Search Parameters";
    document.getElementsByName("eventSection")[0].innerHTML = "Event Settings";
    document.getElementsByName("calendarName")[0].innerHTML = "Must already exist";
    document.getElementsByName("numberInput")[0].innerHTML = "Every one, two or three letter days";
    // document.getElementsByName("title")[0].innerHTML = "of events";
    document.getElementsByName("times")[0].innerHTML = "HH:MM AM/PM, HH:MM (24-hour)";
    document.getElementsByName("guests")[0].innerHTML = "List email addresses, comma-separated";
    // document.getElementsByName("location")[0].innerHTML = "of events";
    document.getElementsByName("description")[0].innerHTML = "String or full URL";
    document.getElementsByName("dates")[0].innerHTML = "Mmm DD YYYY, MM/DD/YYYY, YYYY-MM-DD";
    if (document.getElementById("title").value === "新会议") document.getElementById("title").value = "New Meeting"; // quirky in vscode preview
    document.getElementById("startTime").value = parseTimeISO(document.getElementById("startTime").value).join(":");
    document.getElementById("startTime").placeholder = "Optional";
    document.getElementById("endTime").value = parseTimeISO(document.getElementById("endTime").value).join(":");
    document.getElementById("endTime").placeholder = "Optional";
    document.getElementById("guests").placeholder = "Optional";
    document.getElementById("location").placeholder = "Optional";
    document.getElementById("description").placeholder = "Optional";
    document.getElementById("start").placeholder = "Optional";
    document.getElementById("end").placeholder = "Optional";
    document.getElementById("start").value = localeDateString(document.getElementById("startRef").value);
    document.getElementById("button").innerHTML = "Submit";
    document.getElementsByName("difficulties")[0].innerHTML = "Technical difficulties? Search issues or open a new one on " + `<a href="https://github.com/saegl5/jiayou_add_events/issues">GitHub</a>` + ".";
    document.getElementsByName("reference")[0].innerHTML = "Version ";
    document.getElementById("end").value = localeDateString(document.getElementById("endRef").value);
  }
}

document
  .getElementById("chinese")
  .addEventListener("change", function () { 
    if (this.checked) translate("Chinese");
    else translate("English");
  }); 

document
  .getElementById("calendarName")
  .addEventListener("change", function () { 
    if (this.value === document.getElementById("calendarNameRef").value)
      alert("\"" + this.value + "\" is an internal calendar!\n\nPlease kindly choose a different calendar to add events.");
}); 

function addLeadingZero(time) {
  let hour = time.split(":")[0]; // Extract hour part
  hour = parseInt(hour);
  let modifier = time.split(" ")[1]; // Extract AM/PM part, if exists
  let minute = time.split(" ")[0].split(":")[1]; // Extract minute part
  minute = parseInt(minute);
  if (minute < 10) {
    minute = "0" + minute; // add leading zero
    if (modifier !== undefined) time = hour + ":" + minute + " " + modifier; // update input
    else time = hour + ":" + minute; // update input
  }
  return time; // return updated time
}

document
  .getElementById("calendarForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevents the form from submitting the traditional way

    var calendarName = document.getElementById("calendarName").value;
    var calendarNameRef = document.getElementById("calendarNameRef").value;
    var howMany = document.getElementById("howMany").value;
    var query = [
      ...document.querySelectorAll("input[name=letters]:checked"),
    ].map(({ value }) => value); // essentially, place the value of every letter day (that is checked) into an array called "letters", "..." is spread syntax

    var frequency = document.getElementById("frequency").value;
    // var calendarNameAlt =
    //   document.getElementById("calendarNameAlt").value;
    var title = document.getElementById("title").value;
    var guests = document.getElementById("guests").value;
    var location = document.getElementById("location").value;
    var description = document.getElementById("description").value;
    var start = document.getElementById("start").value;
    var end = document.getElementById("end").value;
    var startTime = document.getElementById("startTime").value;
    document.getElementById("startTime").value = addLeadingZero(startTime); // Add leading zero to minute, if missing
    var endTime = document.getElementById("endTime").value;
    document.getElementById("endTime").value = addLeadingZero(endTime); // Add leading zero to minute, if missing

    var dryRun = document.getElementById("dryRun").checked; // by default, checkbox is unchecked, meaning .checked is false

    document.getElementById("wait").innerHTML = "Please wait...";

    google.script.run
      .withSuccessHandler(function (response) {
        document.getElementById("wait").innerHTML = response; // Displays a success message when completed
      })
      .addEvents(
        calendarName,
        calendarNameRef,
        howMany,
        query,
        frequency,
        title,
        guests,
        location,
        description,
        start,
        end,
        startTime,
        endTime,
        dryRun
      );
  }); // calendarNameAlt is now calendarName, and previous calendarName has been hard-coded
