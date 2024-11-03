
import React, { useState } from 'react';
import { Tasks } from './SideBar'; // Ensure this import path is correct
import myTask from "../assets/myTask.svg";
import followUp from "../assets/followUp.svg";
import other from "../assets/other.svg";
import "../css/taskform.css";
import {  MenuItem, Select, TextField } from "@mui/material";
// import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from "@mui/system";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs'; // Import dayjs
import 'dayjs/locale/en';
import CustomizedSnackbar from '@/snackBar/customizedSnackBar';
import { TESTING_URL } from '@/ApiLinks';
import CALENDARICON from  "../assets/sidebar/CalendarIcon.svg";
import LocalStorageItem from '@/utils/util';

// Assuming you have the same styled components and imports as in TaskForm
interface TaskEditFormProps {
  task: Tasks;
  onCancelView: () => void;
}

// const Textarea = styled(BaseTextareaAutosize)(
//   () => `
//   box-sizing: border-box;
//   width:90%;
//   font-size: 0.875rem;
//   font-weight: 400;
//   line-height: 1.5;
//   padding: 8px 12px;
//   border-radius: 8px;
//   resize: none;
//   border: 1px solid rgb(196,196,196);
//   &:hover {
//     border-color: rgb(33,33,33); /* Set border color to transparent on hover */
//   }
//   &:focus {
//     outline: none; 
//     border: 2px solid blue;
//   }

// `,
// );

// Title custom properties
const CustomTextField = styled(TextField)({
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    //  borderColor: 'orange',
    //  color:"orange"
  },
  '& .MuiFormLabel-root.Mui-focused': {
    // color: 'orange', // Change label color when focused
  },
});

//dropdown
const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'orange',
    color: 'orange',
  },
  '& .MuiFormLabel-root.Mui-focused': {
    color: 'orange',
  },
});

const TaskEditForm: React.FC<TaskEditFormProps> = ({ task, onCancelView }) => {

  const [initialState] = useState({
    title: task.title,
    selectedOption: task.taskType.taskType,
    reminderDate: task.setReminders[0] ? dayjs(task.setReminders[0].reminderTimestamp) : null,
    dueDate: task.deadline ? dayjs(task.deadline) : null,
    notes: task.notes,
  });



  // Initialize state with task data, converting Date objects to Dayjs objects
  const [title, setTitle] = useState<string>(task.title);
  const [selectedOption, setSelectedOption] = useState<string>(task.taskType.taskType); // Assuming taskType is an object with a name property
  const [reminderDate, setReminderDate] = useState<dayjs.Dayjs | null>(task.setReminders[0] ? dayjs(task.setReminders[0].reminderTimestamp) : null);
  const [dueDate, setDueDate] = useState<dayjs.Dayjs | null>(task.deadline ? dayjs(task.deadline) : null);
  const [notes, setNotes] = useState<string>(task.notes);
  const [snackbarOpen, setSnackbarOpen] = useState(false); //snackbar
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('');



  const isFormEdited = () => {
    return (
      title !== initialState.title ||
      selectedOption !== initialState.selectedOption ||
      !reminderDate?.isSame(initialState.reminderDate) ||
      !dueDate?.isSame(initialState.dueDate) ||
      notes !== initialState.notes
    );
  };

  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormEdited()) {
      handleSnackbar("Please edit before submitting", "warning");
      return;
    }

    let selectedTaskTypeId;
    try {
      const res = await fetch(`${TESTING_URL}/api/v1/tasks/master-task-type`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': LocalStorageItem()
        }
      })
      const resData = await res.json();
      console.log("resData", resData);
      selectedTaskTypeId = resData.find((taskType: any) => taskType.taskType === selectedOption)?.id;
    }
    catch (error) {
      console.log("error", error);
    }


    //for setReminder date and time
    function formatCustomDate(dateObj: any): string {
      // Extract the date parts
      const year = dateObj.$y;
      const month = dateObj.$M + 1; // Note: JavaScript months are 0-indexed, so you might need to adjust this
      const formattedMonth = month < 10 ? `0${month}` : month;
      const day = dateObj.$D;
      const formattedDay = day < 10 ? `0${day}` : day;
      const hour = dateObj.$H;
      const formattedHour = hour < 10 ? `0${hour}` : hour;
      const minute = dateObj.$m;
      // const ampm = hour >= 12 ? 'PM' : 'AM';

      // Format the date and time
      const formatteddDate = `${year}-${formattedMonth}-${formattedDay}T${formattedHour}:${minute < 10 ? '0' : ''}${minute}`;
      console.log(formatteddDate);
      return formatteddDate;
    }

    //current date and time
    function getCurrentDateTimeFormatted(): string {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
      const day = String(currentDate.getDate()).padStart(2, '0'); // Add leading zero if needed
      const hours = String(currentDate.getHours()).padStart(2, '0'); // Add leading zero if needed
      const minutes = String(currentDate.getMinutes()).padStart(2, '0'); // Add leading zero if needed

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    // Create editedFormData object with only non-empty fields
    const editedFormData: any = {
      id: task.id,
      title,
      taskType: { id: selectedTaskTypeId },
      createdDate: getCurrentDateTimeFormatted()
    };

    // Add reminder only if it is not empty
    if (reminderDate) {
      const formattedReminderDate = formatCustomDate(reminderDate);
      editedFormData.reminder = { id: task.setReminders[0]?.id, reminderTimestamp: formattedReminderDate, status: { id: 2 } };
    }

    // Add deadline only if it is not empty
    if (dueDate) {
      // const formattedDueDate = formatCustomDueDate(dueDate); //before
      const formattedDueDatee = formatCustomDate(dueDate);
      editedFormData.deadline = formattedDueDatee;
    }

    //to check iif selected deadline is passed the reminder date
    let reminderDatee;
    if (editedFormData.reminder?.reminderTimestamp) {
      reminderDatee = new Date(editedFormData.reminder?.reminderTimestamp);
    }

    let deadlineDatee;
    if (editedFormData.deadline) {
      deadlineDatee = new Date(editedFormData.deadline);
    }

    if (reminderDatee && deadlineDatee) {
      // Check if the deadline is after the reminder
      if (deadlineDatee <= reminderDatee) {
        console.log("Errore: Deadline cannot be on or before the reminder timestamp.");
        handleSnackbar("Deadline cannot be past reminder", "error");
        return;
      }

    }

    // Add notes only if it is not empty
    if (notes) {
      editedFormData.notes = notes;
    }

    console.log("editedd", editedFormData);

    try {

      const response = await fetch(`${TESTING_URL}/api/v1/tasks`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': LocalStorageItem()
        },
        body: JSON.stringify(editedFormData)
      })

      const res = await response.json();
      console.log("res edited data", res);
      handleSnackbar("Task edited successfully", "success");
      setTimeout(() => {
        onCancelView()
      }, 1000)
    }
    catch (err) {
      handleSnackbar("Failed to edit task", "error");
      console.log("error patching form", err);
    }

  };

  //snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSnackbar = (message: string, severity: any) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  dayjs.locale('en'); // Set the locale for dayjs
  // Function to check if a date is before today to diable dates in calendar before today
  const isBeforeToday = (date: any) => {
    const today = dayjs().startOf('day');
    return dayjs(date).isBefore(today);
  };
console.log(CALENDARICON)
  return (

    <div className="outerDiv">

      <CustomizedSnackbar
        open={snackbarOpen}
        handleClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />


      <form onSubmit={handleSubmit}>
        {/* Form fields go here, similar to TaskForm but with pre-populated values */}

        {/* title  */}
        <div className="forMargin titleDiv">
          <CustomTextField className="titleDivTextField"
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            inputProps={{
              maxLength: 50, // Maximum length for the title
              style: { fontSize: "14px" },
            }}
            multiline
          />
          <div
            style=
            {{
              // border: "1px solid red",
              fontSize: "12px",
              color: "rgb(130,130,130)",
              textAlign: "right",
              width: "80%",
              marginLeft: "40px",
              marginTop: "4px"
            }}
          >{title.length}/50</div>
        </div>

        {/* notes */}
        <div>
          <TextField className="textAreaNotes"
            value={notes}
            label="Description"
            onChange={(e) => setNotes(e.target.value)}
            aria-label="maximum height"
            placeholder="Notes"
            inputProps={{
              maxLength: 200,
              style: { fontSize: "14px" },
            }}
            multiline
          />
          <div className='forMargin'
            style=
            {{
              // border: "1px solid red",
              fontSize: "12px",
              color: "rgb(130,130,130)",
              textAlign: "right",
              width: "80%",
              marginLeft: "40px",
              marginTop: "1px"
            }}
          >{notes ? notes.length : 0}/200</div>
        </div>


        {/* due date */}
        <div className="forMargin setReminderDiv">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              className="dueDatePciker"
              label="Due Date"
              value={dueDate}
              onChange={(newValue) => setDueDate(newValue)}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
              // Disable dates before today
              disablePast={true}
              shouldDisableDate={isBeforeToday}
            />
            {/* <SvgIcon> */}
             {/* <img src={`${CALENDARICON}`} alt="" /> */}

            {/* </SvgIcon> */}
          </LocalizationProvider>
        </div>

        {/* dropdown */}
        <div className="forMargin custom-select">
          <CustomSelect
            className="selectDivCustomSelect"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value as string)}
            displayEmpty
            variant="outlined"
            renderValue={(value) => (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {typeof value === 'string' && (
                  <>
                    {value === 'My Tasks' && <img src={myTask} alt="My Tasks" style={{ width: 20, height: 20, marginRight: 8, }} />}
                    {value === 'Follow Up' && <img src={followUp} alt="Follow Up" style={{ width: 20, height: 20, marginRight: 8, }} />}
                    {value === 'Other' && <img src={other} alt="Other" style={{ width: 20, height: 20, marginRight: 8, }} />}
                    <span style={{ marginLeft: '8px' }}>{value}</span>
                  </>
                )}
                {!value && <span style={{ display: "flex" }}><img src={other} style={{ marginRight: 8, width: 20, height: 20 }} /> Select Task Type</span>}
              </div>
            )}>
            <MenuItem value="My Tasks">
              <img src={myTask} alt="My Tasks" style={{ marginRight: 15, width: 20, height: 20 }} />
              My Tasks
            </MenuItem>
            <MenuItem value="Follow Up">
              <img src={followUp} alt="Follow Up" style={{ marginRight: 15, width: 20, height: 20 }} />
              Follow Up
            </MenuItem>
            <MenuItem value="Other">
              <img src={other} alt="Other" style={{ marginRight: 15, width: 20, height: 20 }} />
              Other
            </MenuItem>
          </CustomSelect>
        </div>

        {/* setreminder */}
        <div className="forMargin">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              className="setReminderPicker"
              label="Set Reminder"
              value={reminderDate}
              onChange={(newValue) => setReminderDate(newValue)}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
              // Disable dates before today
              disablePast={true}
              shouldDisableDate={isBeforeToday}
            />
          </LocalizationProvider>
        </div>



        {/* submit */}
        <div className="forMargin submitDiv">
         <button  onClick={onCancelView} className='buttonsTEF'>
          Cancel
         </button>

         <button type='submit' onClick={onCancelView} className='buttons1TEF'>
          Submit
         </button>

        </div>
      </form>
    </div>
  );
};

export default TaskEditForm;
