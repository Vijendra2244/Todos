import "../css/customCalendar.css";
import TODAYSVG from "../assets/customCalendar/today.svg";
import { Box, Divider, TextField } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; //date and time
import CANCELSVG from "../assets/customCalendar/calendarcancel.svg";
import TOMORRORSVG from "../assets/customCalendar/tomorrow.svg";
import WEEKENDSVG from "../assets/customCalendar/weekend.svg";
import NEXTWEEKSVG from "../assets/customCalendar/nextweek.svg";
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import { useState } from "react";
import CustomizedSnackbar from "@/snackBar/customizedSnackBar";


const CustomCalendarForSchedule = ({ onCloseModalCC, onSetDateTime }: any) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('');

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleSnackbar = (message: string, severity: any) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday

    const getDayName = (dayIndex: any) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[dayIndex];
    };

    const getMonthName = (monthIndex: any) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[monthIndex];
    };

    let tomorrowDate = new Date(currentDate);
    tomorrowDate.setDate(currentDate.getDate() + 1);

    let weekendOption = "Weekend";
    let nextWeekOption = "Next Week";

    if (currentDay === 5 || currentDay === 6) { // Friday or Saturday
        weekendOption = "Next Week";
        nextWeekOption = "Next Weekend";
    }

    let weekendDate = new Date(currentDate);
    weekendDate.setDate(currentDate.getDate() + (6 - currentDay + 7) % 7); // Adding days to reach Saturday

    if (currentDay === 0 || currentDay === 6) {
        weekendDate.setDate(weekendDate.getDate() + 7);
    }

    let nextWeekDate = new Date(currentDate);
    if (currentDay === 5 || currentDay === 6) { // If today is Friday or Saturday
        nextWeekDate.setDate(currentDate.getDate() + (8 - currentDay + 7)); // Next Monday of following week
    } else {
        nextWeekDate.setDate(currentDate.getDate() + (8 - currentDay)); // Next Monday
    }

    const [selectedDate, setSelectedDate] = useState<string>("");
    const [storeYear, setStoreYear] = useState<number | null>(null);

    const handleCancelSelectedValue = () => {
        setSelectedDate('');
        setStartTime("");
        setEndTime("");
    };

    const handleDateSelect = (date: any) => {
        const formattedDate = `${getMonthName(date.getMonth())} ${date.getDate()}`;
        setSelectedDate(formattedDate);
        const year = date.getFullYear(); // Extracting year using getFullYear() method
        setStoreYear(year);
    };

    const [dateSelected, setDateSelected] = useState<Date | null>(null);

    const handleDateSelectedChange = (newValue: Date | null) => {
        setDateSelected(newValue);
        setSelectedDate(newValue ? dayjs(newValue).format('MMM DD') : '');
        setStoreYear(dayjs(newValue).year());
    };

    const [startTime, setStartTime] = useState(''); // State for start time input
    const [endTime, setEndTime] = useState(''); // State for end time input

    const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStartTime(event.target.value);
    };

    const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEndTime(event.target.value);
    };

    const handleCancelCalendar = () => {
        setSelectedDate('');
        setStartTime('');
        setEndTime('');
        onCloseModalCC(); // Close modal
    };

    
    const handleSave = () => {
        if (!selectedDate || !startTime || !endTime) {
            handleSnackbar("Please select full date and time", "warning");
            return;
        }
    
        // Check if start time is ahead of end time
        const start = dayjs(`1970-01-01T${startTime}`);
        const end = dayjs(`1970-01-01T${endTime}`);
    
        if (!end.isAfter(start)) {
            handleSnackbar("End time must be after start time", "error");
            return;
        }
    
        const selectedDateTime = `${selectedDate} ${storeYear} ${startTime} - ${endTime}`;
        console.log("Selected DateTime:", selectedDateTime);
    
        const parsedDateTime = `${storeYear}-${('0' + (new Date(selectedDate).getMonth() + 1)).slice(-2)}-${('0' + new Date(selectedDate).getDate()).slice(-2)}`;
        const formattedDateTime = `${parsedDateTime}T${startTime} - ${endTime}`;
    
        console.log("Formatted DateTime:", formattedDateTime);
    
        onSetDateTime(formattedDateTime);
        onCloseModalCC();
    };
    
    return (
        <div className="outerCalendarDiv">

            <CustomizedSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                message={snackbarMessage}
                severity={snackbarSeverity}
            />

            {/* First div */}
            <div className="firstInnerCalendarDiv">
                <input
                    className="input"
                    type="text"
                    value={`${selectedDate}${startTime ? ` ${startTime}` : ''}${endTime ? `-${endTime}` : ''}`}
                    readOnly
                />

                <div className="cancelDivCC" onClick={handleCancelSelectedValue}>
                    <img src={CANCELSVG} alt="Cancel" />
                </div>
            </div>

            <Divider className="DividerCC" />

            {/* Second div */}
            <div className="secondInnerCalendarDiv">
                <div className="secondInnermostDiv" onClick={() => handleDateSelect(currentDate)}>
                    <div className="innerImageDiv">
                        <img src={TODAYSVG} alt="Today" />
                        <p>Today</p>
                    </div>
                    <div className="innerImageDiv2">
                        <p>{getDayName(currentDate.getDay())}</p>
                    </div>
                </div>

                <div className="secondInnermostDiv" onClick={() => handleDateSelect(tomorrowDate)}>
                    <div className="innerImageDiv">
                        <img src={TOMORRORSVG} alt="Tomorrow" />
                        <p>Tomorrow</p>
                    </div>
                    <div className="innerImageDiv2">
                        <p>{getDayName(tomorrowDate.getDay())}</p>
                    </div>
                </div>

                <div className="secondInnermostDiv" onClick={() => handleDateSelect(weekendDate)}>
                    <div className="innerImageDiv">
                        <img src={WEEKENDSVG} alt="Weekend" />
                        <p>{weekendOption}</p>
                    </div>
                    <div className="innerImageDiv2">
                        <p>{weekendOption === "Weekend" ? `${getDayName(weekendDate.getDay())}, ${weekendDate.getDate()} ${getMonthName(weekendDate.getMonth())}` : `${getDayName(weekendDate.getDay())}, ${weekendDate.getDate()} ${getMonthName(weekendDate.getMonth())}`}</p>
                    </div>
                </div>

                <div className="secondInnermostDiv" onClick={() => handleDateSelect(nextWeekDate)}>
                    <div className="innerImageDiv">
                        <img src={NEXTWEEKSVG} alt="Next Week" />
                        <p>{nextWeekOption}</p>
                    </div>
                    <div className="innerImageDiv2">
                        <p>{nextWeekOption === "Next Weekend" ? `${getDayName(weekendDate.getDay())}, ${weekendDate.getDate()} ${getMonthName(weekendDate.getMonth())}` : `Mon, ${nextWeekDate.getDate()} ${getMonthName(nextWeekDate.getMonth())}`}</p>
                    </div>
                </div>
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

            <div className="fourthCalendarDiv">
                <Box sx={{ mt: "10px", mb: "10px", padding: "10px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <TextField
                        label="Start Time"
                        type="time"
                        value={startTime}
                        onChange={handleStartTimeChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 minutes
                        }}
                    />
                    <span style={{ marginLeft: "10px", marginRight: "10px" }}>-</span>

                    <TextField
                        label="End Time"
                        type="time"
                        value={endTime}
                        onChange={handleEndTimeChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 minutes
                        }}
                    />
                </Box>
            </div>

            <Divider className="DividerCC" />

            <div className="saveDivCC">
                <button className="cancelBtnCC" onClick={handleCancelCalendar}>cancel</button>
                <button className="saveBtnCC" onClick={handleSave}>save</button>
            </div>
        </div>
    );
};

export default CustomCalendarForSchedule;
