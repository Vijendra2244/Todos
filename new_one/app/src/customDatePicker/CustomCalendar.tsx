import "../css/customCalendar.css";
import TODAYSVG from "../assets/customCalendar/today.svg";
import CANCELSVG from "../assets/customCalendar/calendarcancel.svg";
import TOMORRORSVG from "../assets/customCalendar/tomorrow.svg";
import WEEKENDSVG from "../assets/customCalendar/weekend.svg";
import NEXTWEEKSVG from "../assets/customCalendar/nextweek.svg";
import { Divider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/en";
import { useState } from "react";
import CustomizedSnackbar from "@/snackBar/customizedSnackBar";

interface CustomCalendarProps {
  onCloseModalCC: () => void;
  onSetDateTime: (dateTime: string) => void;
  dueDate?:any;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  onCloseModalCC,
  onSetDateTime,
  dueDate,
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "info" | "warning" | "error"
  >("info");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSnackbar = (
    message: string,
    severity: "success" | "info" | "warning" | "error"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate()); // For testing purposes, setting it to 3 days ahead
  const currentDay = currentDate.getDay();

  const getDayName = (dayIndex: number) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[dayIndex];
  };

  const getMonthName = (monthIndex: number) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[monthIndex];
  };
  // update code by vijendra from here
  const calculateFutureDate = (daysToAdd: number) => {
    const futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() + daysToAdd);
    return futureDate;
  };

  const tomorrowDate = calculateFutureDate(1);
  const weekendDate =
    currentDay <= 4
      ? calculateFutureDate(6 - currentDay)
      : calculateFutureDate(13 - currentDay);
  const nextWeekDate =
    currentDay === 6
      ? calculateFutureDate(8 - currentDay)
      : calculateFutureDate(currentDay <= 5 ? 8 - currentDay : 15 - currentDay);

  // update code by vijendra to here

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [storeYear, setStoreYear] = useState<number | null>(null);
  const [dateSelected, setDateSelected] = useState<Dayjs | null>(null);
  const [hour, setHour] = useState<string>("");
  const [minute, setMinute] = useState<string>("");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("AM");
  const [AMorPMValue, setAMorPMValue] = useState<string>("");

  const handleCancelSelectedValue = () => {
    setSelectedDate("");
    setHour("");
    setMinute("");
    setSelectedPeriod("AM");
    setAMorPMValue("");
  };

  const handleDateSelect = (date: Date) => {
    
    const formattedDate = `${getMonthName(date.getMonth())} ${date.getDate()}`;
    setSelectedDate(formattedDate);
    const year = date.getFullYear();
    setStoreYear(year);
  };

  const handleDateSelectedChange = (newValue: Dayjs | null) => {
    setDateSelected(newValue);
    setSelectedDate(newValue ? dayjs(newValue).format("MMM DD") : "");
    setStoreYear(dayjs(newValue).year());
    // code update by vijendra from here

    if (!hour && !minute) {
      setHour("10");
      setMinute("00");
      setSelectedPeriod("AM");
      setAMorPMValue("AM");
    }
    // code update by vijendra to here
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const inputHour = e.target.value;
    if (
      !isNaN(Number(inputHour)) &&
      Number(inputHour) >= 1 &&
      Number(inputHour) <= 12
    ) {
      setHour(inputHour);
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const inputMinute = e.target.value;
    if (
      !isNaN(Number(inputMinute)) &&
      Number(inputMinute) >= 0 &&
      Number(inputMinute) <= 59
    ) {
      setMinute(inputMinute);
    }
  };

  const handleAMClick = () => {
    setSelectedPeriod("AM");
    setAMorPMValue("AM");
  };

  const handlePMClick = () => {
    setSelectedPeriod("PM");
    setAMorPMValue("PM");
  };

  const handleCancelCalendar = () => {
    setSelectedDate("");
    setHour("");
    setMinute("");
    setSelectedPeriod("AM");
    setAMorPMValue("");
    onCloseModalCC();
  };

  const handleSave = () => {
    if (!selectedDate || !hour || !minute || !AMorPMValue) {
      handleSnackbar("Please select full date and time", "warning");
      return;
    }

    const now = new Date();
    const selectedDateTimeStr = `${selectedDate} ${storeYear} ${hour}:${minute} ${AMorPMValue}`;
    const selectedDateTime = new Date(selectedDateTimeStr);

    if (selectedDateTime < now) {
      handleSnackbar("Please choose a valid future time", "warning");
      return;
    }

    if (dueDate && selectedDateTime > new Date(dueDate)) {
      handleSnackbar(
        "Reminder time must be before the due date time",
        "warning"
      );
      return;
    }

    const year = selectedDateTime.getFullYear();
    const month = ("0" + (selectedDateTime.getMonth() + 1)).slice(-2);
    const date = ("0" + selectedDateTime.getDate()).slice(-2);
    let hours = selectedDateTime.getHours();
    const minutes = ("0" + selectedDateTime.getMinutes()).slice(-2);

    if (AMorPMValue === "PM" && hours < 12) {
      hours += 12;
    }

    const formattedDateTime = `${year}-${month}-${date}T${("0" + hours).slice(
      -2
    )}:${minutes}`;
    onSetDateTime(formattedDateTime);
    onCloseModalCC();
  };
  // code update by vijendra from here

  let weekenOption = currentDay <= 4 ? "Weekend" : "Next Weekend";

  // code update by vijendra to here
  return (
    <div className="outerCalendarDiv">
      <CustomizedSnackbar
        open={snackbarOpen}
        handleClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />

      <div className="firstInnerCalendarDiv">
        <input
          className="input"
          type="text"
          value={`${selectedDate}${hour ? ` ${hour}` : ""}${
            minute ? `:${minute}` : ""
          }${AMorPMValue ? ` ${AMorPMValue}` : ""}`}
          readOnly
        />

        <div className="cancelDivCC" onClick={handleCancelSelectedValue}>
          <img src={CANCELSVG} alt="" />
        </div>
      </div>

      <Divider className="DividerCC" />

      <div className="secondInnerCalendarDiv">
        <div
          className="secondInnermostDiv"
          onClick={() => handleDateSelect(currentDate)}
         
        >
          <div className="innerImageDiv">
            <img src={TODAYSVG} alt="" />
            <p className="calenderdays">Today</p>
          </div>
          <div className="innerImageDiv2">
            <p>{getDayName(currentDate.getDay())}</p>
          </div>
        </div>

        <div
          className="secondInnermostDiv"
          onClick={() => handleDateSelect(tomorrowDate)}
        >
          <div className="innerImageDiv">
            <img src={TOMORRORSVG} alt="" />
            <p>Tomorrow</p>
          </div>
          <div className="innerImageDiv2">
            <p>{getDayName(tomorrowDate.getDay())}</p>
          </div>
        </div>

        {
          // code update by vijendra from here
          currentDay <= 4 ? (
            <>
              <div
                className="secondInnermostDiv"
                onClick={() => handleDateSelect(weekendDate)}
              >
                <div className="innerImageDiv">
                  <img src={WEEKENDSVG} alt="" />
                  <p>{weekenOption}</p>
                </div>
                <div className="innerImageDiv2">
                  <p>{`${getDayName(
                    weekendDate.getDay()
                  )}, ${weekendDate.getDate()} ${getMonthName(
                    weekendDate.getMonth()
                  )}`}</p>
                </div>
              </div>
              <div
                className="secondInnermostDiv"
                onClick={() => handleDateSelect(nextWeekDate)}
             
              >
                <div className="innerImageDiv">
                  <img src={NEXTWEEKSVG} alt="" />
                  <p>Next Week</p>
                </div>
                <div className="innerImageDiv2">
                  <p>{`Mon, ${nextWeekDate.getDate()} ${getMonthName(
                    nextWeekDate.getMonth()
                  )}`}</p>
                </div>
              </div>{" "}
            </>
          ) : (
            <>
              <div
                className="secondInnermostDiv"
                onClick={() => handleDateSelect(nextWeekDate)}
              >
                <div className="innerImageDiv">
                  <img src={NEXTWEEKSVG} alt="" />
                  <p>Next Week</p>
                </div>
                <div className="innerImageDiv2">
                  <p>{`Mon, ${nextWeekDate.getDate()} ${getMonthName(
                    nextWeekDate.getMonth()
                  )}`}</p>
                </div>
              </div>
              <div
                className="secondInnermostDiv"
                onClick={() => handleDateSelect(weekendDate)}
              >
                <div className="innerImageDiv">
                  <img src={WEEKENDSVG} alt="" />
                  <p>{weekenOption}</p>
                </div>
                <div className="innerImageDiv2">
                  <p>{`${getDayName(
                    weekendDate.getDay()
                  )}, ${weekendDate.getDate()} ${getMonthName(
                    weekendDate.getMonth()
                  )}`}</p>
                </div>
              </div>
            </>
          )

          // code update by vijendra to here
        }
      </div>

      <Divider className="DividerCC" />

      <div className="thirdInnerCalendarDiv">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StaticDatePicker
            disablePast={true}
            value={dateSelected}
            onChange={(newValue) => handleDateSelectedChange(newValue)}
          />
        </LocalizationProvider>
      </div>

      <div className="fourthInnerCalendarDiv">
        <div className="TimeDiv">Time</div>
        {/* code updated by vijendra from here  */}
        <div className="timeInputDivCC">
          <select
            value={hour}
            onChange={handleHourChange}
            disabled={!dateSelected}
          >
            {[...Array(12)].map((_, i) => {
              const value = (i + 1).toString().padStart(2, "0");
              return (
                <option key={i + 1} value={value}>
                  {value}
                </option>
              );
            })}
          </select>
          <span>:</span>
          <select
            value={minute}
            onChange={handleMinuteChange}
            disabled={!dateSelected}
          >
            {[...Array(12)].map((_, i) => {
              const value = (i * 5).toString().padStart(2, "0");
              return (
                <option key={value} value={value}>
                  {value}
                </option>
              );
            })}
          </select>
        </div>
        {/* code updated by vijendra to  here  */}
        <div className="AMPMButtonDivCC">
          <button
            className={selectedPeriod === "AM" ? "activeBtn" : "disableBtn"}
            onClick={handleAMClick}
            disabled={!hour || !minute}
          >
            AM
          </button>
          <button
            className={selectedPeriod === "PM" ? "activeBtn" : "disableBtn"}
            onClick={handlePMClick}
            disabled={!hour || !minute}
          >
            PM
          </button>
        </div>
      </div>

      <Divider className="DividerCC" />

      <div className="saveDivCC">
        <button className="cancelBtnCC" onClick={handleCancelCalendar}>
          Cancel
        </button>
        <button className="saveBtnCC" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default CustomCalendar;
