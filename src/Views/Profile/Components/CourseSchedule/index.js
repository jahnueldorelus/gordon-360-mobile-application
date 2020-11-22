import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { getUserSchedule } from "../../../../Services/Profile/ProfileService";
import moment from "moment";

export const Schedule = (props) => {
  const [days, setDays] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const [events, setEvents] = useState();

  // Creates the days of the week in the schedule
  useEffect(() => {
    const currDate = moment();
    // The current date is set before the date object is manipulated
    let currDateObject = currDate.toObject();
    currDateObject.monthName = currDate.format("MMMM");
    currDateObject.day = currDate.format("ddd");
    setSelectedDate(currDateObject);
    // Creates a list with 7 objects to represent 7 days of the week
    let dayIndices = [0, 1, 2, 3, 4, 5, 6];
    let daysOfTheWeek = [];
    // Adds to the list "daysOfTheWeek" objects of each day of the week
    dayIndices.forEach((dayIndex) => {
      let dateObject = currDate.day(dayIndex).toObject();
      dateObject.day = currDate.day(dayIndex).format("ddd");
      dateObject.monthName = currDate.day(dayIndex).format("MMMM");
      daysOfTheWeek.push(dateObject);
    });
    setDays(daysOfTheWeek);
  }, []);

  // Creates the events objects
  useEffect(() => {
    async function getSchedule() {
      let allEvents = [];
      let events = await getUserSchedule();

      events.forEach((event) => {
        let eventObject = {};
        // Creates a new event object to work alongside Moment date objects
        eventObject.startTime = event.BEGIN_TIME.trim();
        eventObject.endTime = event.END_TIME.trim();
        eventObject.courseName = event.CRS_TITLE.trim();
        eventObject.courseCode = event.CRS_CDE.trim();
        eventObject.courseBuilding = event.BLDG_CDE.trim();
        eventObject.courseRoom = event.ROOM_CDE.trim();
        // Creates a list of days each event occurs on
        eventObject.days = [];
        /**
         * Code letters for each day was taken from repo: `gordon-360-ui` from the file
         * `/src/components/SchedulePanel/components/myScheduleDialog/index.js`
         */
        if (event.SUNDAY_CDE === "N") eventObject.days.push("Sun");
        if (event.MONDAY_CDE === "M") eventObject.days.push("Mon");
        if (event.TUESDAY_CDE === "T") eventObject.days.push("Tue");
        if (event.WEDNESDAY_CDE === "W") eventObject.days.push("Wed");
        if (event.THURSDAY_CDE === "R") eventObject.days.push("Thu");
        if (event.FRIDAY_CDE === "F") eventObject.days.push("Fri");
        if (event.SATURDAY_CDE === "S") eventObject.days.push("Sat");

        allEvents.push(eventObject);
      });
      setEvents(allEvents);
    }

    getSchedule();
  }, []);

  const defaultFontSize = 18;
  const styles = StyleSheet.create({
    mainContainer: { flex: 1 },
    calContainer: {
      paddingVertical: 10,
      backgroundColor: "#013E70",
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      flexDirection: "column",
    },
    calMonthContainer: {
      alignSelf: "center",
      marginBottom: 10,
      flexDirection: "row",
    },
    calMonthText: {
      color: "white",
      fontSize: defaultFontSize,
    },
    calWeekDaysContainer: {
      flexDirection: "row",
      justifyContent: "space-evenly",
    },
    calDayContainer: { alignItems: "center" },
    calDayButton: {
      borderColor: "white",
      borderRadius: 50,
      borderWidth: 1,
      width: 40,
      height: 40,
      marginTop: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    calDayText: { color: "white" },
    calDayNumText: { fontSize: defaultFontSize },
    eventContainer: {
      flexDirection: "row",
      backgroundColor: "white",
      borderBottomColor: "#014983",
      borderWidth: 1,
      paddingVertical: 10,
    },
    eventTimeContainer: { paddingLeft: 10 },
    eventTimeLabel: { color: "#014983", fontSize: 15 },
    eventTimeSeparator: { flex: 1, marginVertical: 5 },
    eventTimeSeparatorCircle: {
      width: 5,
      height: 5,
      borderRadius: 50,
      backgroundColor: "#016ABD",
      alignSelf: "center",
    },
    eventTimeSeparatorLine: {
      borderLeftWidth: 2,
      borderColor: "#016ABD",
      alignSelf: "center",
      flex: 1,
    },
    eventInfoContainer: {
      flexDirection: "column",
      paddingHorizontal: 10,
      flex: 1,
    },
    eventInfoCodeText: { fontSize: defaultFontSize, color: "#016ABD" },
    eventInfoNameText: { fontSize: defaultFontSize, color: "#015496" },
    eventInfoLocationText: { fontSize: defaultFontSize, color: "#01335C" },
    noEventsContainer: {
      alignItems: "center",
      paddingVertical: 20,
      borderWidth: 1,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    noEventsText: {
      fontSize: defaultFontSize,
    },
  });

  // Gets the days of the week to display
  const getDays = () => {
    /**
     * Gets the month name to display. If there are 2 different months
     * in the week, both months will be displayed. The list will only have
     * a maximum of 2 months
     */
    let monthList = [];
    days.forEach((day) => {
      if (!monthList.includes(day.monthName)) monthList.push(day.monthName);
    });

    return (
      <View style={styles.calContainer}>
        <View style={styles.calMonthContainer}>
          <Text
            style={[
              styles.calMonthText,
              {
                // Underlines this month if it's the same as the selected day and
                // if there's more than 1 month in the week displayed
                textDecorationLine:
                  selectedDate.monthName === monthList[0] && monthList[1]
                    ? "underline"
                    : "none",
              },
            ]}
          >
            {monthList[0]}
          </Text>
          <Text style={styles.calMonthText}>
            {
              // If there's 2 months in the week, the months are separated with a forward slash
              monthList[1] ? " / " : ""
            }
          </Text>
          <Text
            style={[
              styles.calMonthText,
              {
                // This 2nd month is shown only if there's 2 months in the week displayed
                // This 2nd month is underlined if it's the same month as the selected day
                textDecorationLine:
                  selectedDate.monthName === monthList[1]
                    ? "underline"
                    : "none",
              },
            ]}
          >
            {monthList[1] ? monthList[1] : ""}
          </Text>
        </View>
        <View style={styles.calWeekDaysContainer}>
          {days.map((day, index) => {
            return (
              <View key={index} style={styles.calDayContainer}>
                <Text style={styles.calDayText}>{day.day}</Text>
                <TouchableOpacity
                  style={[
                    styles.calDayButton,
                    {
                      backgroundColor:
                        day.day === selectedDate.day ? "white" : "transparent",
                    },
                  ]}
                  onPress={() => {
                    setSelectedDate(day);
                  }}
                >
                  <Text
                    style={[
                      styles.calDayNumText,
                      {
                        color:
                          day.day === selectedDate.day ? "#014983" : "white",
                      },
                    ]}
                  >
                    {day.date}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  // Displays the events
  const getEvents = () => {
    // Gets the events for the selected day
    let selectedDayEvents = events.filter((event) => {
      return event.days.includes(selectedDate.day);
    });

    // If there are events for the selected day
    if (selectedDayEvents.length > 0) {
      // Sorts the events in order based upon the event's start time
      selectedDayEvents.sort((a, b) => {
        // Creates a date for comparison based on the start time of event A
        let dateA = moment();
        let startTimeA = a.startTime.split(":");
        dateA.set("hour", startTimeA[0]);
        dateA.set("minute", startTimeA[1]);
        // Creates a date for comparison based on the start time of event B
        let dateB = moment();
        let startTimeB = b.startTime.split(":");
        dateB.set("hour", startTimeB[0]);
        dateB.set("minute", startTimeB[1]);
        // Returns a check to order the dates
        return dateA.isAfter(dateB);
      });

      // After sorting the events in order by start time, each event
      // is displayed
      return selectedDayEvents.map((event, index) => {
        // Temporary date used to create the event's time labels
        let date = moment();
        // Creates the starting time label
        let startTime = event.startTime.split(":");
        date.set("hour", startTime[0]);
        date.set("minute", startTime[1]);
        let startTimeLabel = date.format("h:mm A");
        // Creates the ending time label
        let endTime = event.endTime.split(":");
        date.set("hour", endTime[0]);
        date.set("minute", endTime[1]);
        let endTimeLabel = date.format("h:mm A");

        return (
          <View
            key={index}
            style={[
              styles.eventContainer,
              {
                // If the event is the last item in the list, its bottom borders are rounded
                borderBottomLeftRadius:
                  index === selectedDayEvents.length - 1 ? 10 : 0,
                borderBottomRightRadius:
                  index === selectedDayEvents.length - 1 ? 10 : 0,
              },
            ]}
          >
            <View style={styles.eventTimeContainer}>
              <Text style={styles.eventTimeLabel}>{startTimeLabel}</Text>
              <View style={styles.eventTimeSeparator}>
                <View style={styles.eventTimeSeparatorCircle} />
                <View style={styles.eventTimeSeparatorLine} />
                <View style={styles.eventTimeSeparatorCircle} />
              </View>
              <Text style={styles.eventTimeLabel}>{endTimeLabel}</Text>
            </View>
            <View style={styles.eventInfoContainer}>
              <Text style={styles.eventInfoCodeText}>{event.courseCode}</Text>
              <Text style={styles.eventInfoNameText}>{event.courseName}</Text>
              <Text style={styles.eventInfoLocationText}>
                {event.courseBuilding.trim()} {event.courseRoom.trim()}
              </Text>
            </View>
          </View>
        );
      });
    }
    // If there are no events for the selected day
    else {
      return (
        <View style={styles.noEventsContainer}>
          <Text style={styles.noEventsText}>No events for today!</Text>
        </View>
      );
    }
  };

  if (days && selectedDate && events) {
    return (
      <View style={styles.mainContainer}>
        {getDays()}
        {getEvents()}
      </View>
    );
  } else return <></>;
};
