import React from "react";
import { Card } from "react-bootstrap";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
const headers = { withCredentials: true };

export default class CalendarForm extends React.Component {
  state = {
    weekendsVisible: true,
    currentEvents: [],
    events: [],
  };

  componentWillMount() {
    const send_param = {
      headers,
      _id: window.sessionStorage.getItem("login_id"),
    };
    axios
      .post("http://localhost:8080/calendar/getcal", send_param)
      .then((returnData) => {
        if (returnData.data.message) {
          this.setState({ events: returnData.data.calendar });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    const CalendarStyle = {
      width: "80%",
      textAlign: "Center",
      margin: "0 auto",
      marginTop: 20,
      listStyle: "none",
    };
    return (
      <div className="demo-app" style={{ textAlign: "center" }}>
        <Card>
          <Card.Body>
            Select dates and you will be prompted to create a new event <br />
            Drag, drop, and resize events <br />
            Click an event to delete it
          </Card.Body>
        </Card>
        <div className="demo-app-main" style={CalendarStyle}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            events={this.state.events}
            select={this.handleDateSelect}
            eventContent={renderEventContent} // custom render function
            eventClick={this.handleEventClick}
            eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
            /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
          />
        </div>
      </div>
    );
  }

  handleDateSelect = (selectInfo) => {
    let title = prompt("????????? ?????? ????????? ???????????????.");
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    //event ??????
    if (title) {
      const send_param = {
        writer: window.sessionStorage.getItem("login_id"),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      };

      axios
        .post("http://localhost:8080/calendar/add", send_param)
        .then((returnData) => {
          if (returnData.data.message) {
            alert("????????? ?????????????????????!");
            calendarApi.addEvent(send_param);
          } else {
            alert("?????? ????????? ??????????????????. ?????? ??????????????????.");
          }
        })
        .catch((err) => {
          alert("?????? ????????? ??????????????????. ?????? ??????????????????.");
        });
    }
  };

  handleEventClick = (clickInfo) => {
    if (window.confirm(`'${clickInfo.event.title}' ????????? ?????????????????????????`)) {
      const send_param = {
        headers,
        _id: clickInfo.event._def.extendedProps._id,
      };

      axios
        .post("http://localhost:8080/calendar/delete", send_param)
        .then((returnData) => {
          if (returnData.data.message) {
            alert("?????????????????????.");
            clickInfo.event.remove();
          }
        })
        .catch((err) => {
          alert("?????? ????????? ??????????????????. ?????? ??????????????????.");
        });
    }
  };

  handleEvents = (events) => {
    this.setState({
      currentEvents: events,
    });
    let arr = [];

    if (this.state.currentEvents.length !== 0) {
      for (var i = 0; i < events.length; i++) {
        console.log(this.state.currentEvents[i])
        //if ((events[i]._instance.range.start !== this.state.currentEvents[i]._instance.range.start) ||(events[i]._instance.range.end !==this.state.currentEvents[i]._instance.range.end)) {
        arr.push(events[i]);
        //}
      }
      console.log(arr);
      if (arr.length !== 0) {
        const send_param = {
          _id: arr[0]._def.extendedProps._id,
          start: arr[0]._instance.range.start,
          end: arr[0]._instance.range.end,
        };
        axios
          .post("http://localhost:8080/calendar/update", send_param)
          .then((returnData) => {
            if (!returnData.data.message) {
              console.log(false);
            }
          })
          .catch((err) => {
            console.log("error ??????");
          });
      }
    }
  };
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}
