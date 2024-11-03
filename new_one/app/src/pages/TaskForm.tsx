import { useState } from "react";
import myTask from "../assets/myTask.svg";
import followUp from "../assets/followUp.svg";
import other from "../assets/other.svg";
import "../css/taskform.css";
import { Button, MenuItem, Select, TextField } from "@mui/material";
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from "@mui/system";
import taskType2 from "../assets/taskType2.svg";
import "react-datepicker/dist/react-datepicker.css";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; //date and time
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs from "dayjs";
import 'dayjs/locale/en';
import CustomizedSnackbar from "@/snackBar/customizedSnackBar";
import { TESTING_URL } from "@/ApiLinks";
import LocalStorageItem from "@/utils/util";
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';


interface TaskFormProps {
  onClicked?: (success: boolean) => void;
  onCancel?: () => void; // Define the type of onCancel prop
  messageIdForTaskFn?: any;
  mailSubject?: string;
}

// notes custom properties mui
const Textarea = styled(BaseTextareaAutosize)(
  () => `
  box-sizing: border-box;
  font-family:poppins;
  width:90%;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  resize: none;
  border: 1px solid rgb(196,196,196);
  &:hover {
    border-color: rgb(33,33,33); /* Set border color to transparent on hover */
  }
  &:focus {
    outline: none; 
    border: 2px solid blue;
  }

`,
);

// Title custom properties mui
const CustomTextField = styled(TextField)({
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    //  borderColor: 'orange',
    //  color:"orange"
  },
  '& .MuiFormLabel-root.Mui-focused': {
    // color: 'orange', // Change label color when focused
  }
});

//dropdown custom properties mui
const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'orange',
    color: 'orange',
  },
  '& .MuiFormLabel-root.Mui-focused': {
    color: 'orange',
  },
});


const TaskForm: React.FC<TaskFormProps> = ({onClicked, onCancel, messageIdForTaskFn, mailSubject }) => {

  const [title, setTitle] = useState<string>(''); //title
  const [selectedOption, setSelectedOption] = useState(null); //task type
  const [_, setShowOptions] = useState<boolean>(false);
  const [reminderDate, setReminderDate] = useState<Date | null>(null); //reminder
  const [dueDate, setDueDate] = useState<Date | null>(null); //due date
  const [notes, setNotes] = useState(""); //notes
  // const [alert, setAlert] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false); //snackbar
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('');

  //snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSnackbar = (message: string, severity: any) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  //cancel button
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (onClicked) {
      onClicked(false);
    }
  };

  //task type
  const handleOptionChange = (e: any) => {
    setSelectedOption(e.target.value);
    setShowOptions(false); // Close dropdown options after selection
  };


  //notes
  const handleNotesChange = (e: any) => {
    setNotes(e.target.value);
  };

console.log("mailSubject in taskform", mailSubject);
  //submit form
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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

    let formattedDate;
    if (reminderDate) {
      formattedDate = formatCustomDate(reminderDate);
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
      const formattedDate = `${year}-${formattedMonth}-${formattedDay}T${formattedHour}:${minute < 10 ? '0' : ''}${minute}`;
      console.log(formattedDate);
      return formattedDate;
    }

    let formattedDueDate;
    if (dueDate) {
      formattedDueDate = formatCustomDate(dueDate);
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


    const formData: {
      title: string;
      taskType: { id: number };
      reminder?: { reminderTimestamp: string; status: { id: number } };
      createdDate: string;
      deadline?: string | null;
      notes?: string;
      taskStatus?: { id: number };
      client?: { id: number };
      standardEmailId?: any;
      description?: string
      // emailMessage?: {emailMessageId :string}
    } = {
      title,
      taskType: { id: selectedTaskTypeId },
      createdDate: getCurrentDateTimeFormatted(), 
      taskStatus: { id: 3 },
      client: { id: 1 }
    };

    if (formattedDate) {
      formData.reminder = { reminderTimestamp: formattedDate, status: { id: 2 } };
    }

    if (formattedDueDate) {
      formData.deadline = formattedDueDate;
    }

    if (notes) {
      formData.notes = notes;
    }

    if(messageIdForTaskFn) formData.standardEmailId = messageIdForTaskFn;
    // if(messageIdForTaskFn) formData.emailMessage = {emailMessageId: messageIdForTaskFn };
    
    if(mailSubject) formData.description = mailSubject;

    //to check iif selected deadline is passed the reminder date
    let reminderDatee;
    if (formData.reminder?.reminderTimestamp) {
        reminderDatee = new Date(formData.reminder?.reminderTimestamp);
    }
    
    let deadlineDatee;
    if (formData.deadline) {
        deadlineDatee = new Date(formData.deadline);
    }
    
    if (reminderDatee && deadlineDatee) {
        // Check if the deadline is after the reminder
        if (deadlineDatee <= reminderDatee) {
            console.log("Errore: Deadline cannot be on or before the reminder timestamp.");
               handleSnackbar("Deadline cannot be past reminder", "error");
               return;
        }

    }

    console.log("data", formData);

    try {
      const response = await fetch(`${TESTING_URL}/api/v1/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': LocalStorageItem()
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Responseee at taskform:", responseData);
      setTitle("");
      setSelectedOption(null);
      setReminderDate(null);
      setDueDate(null);
      setNotes("");
      // setAlert(true);
      handleSnackbar("Task addedd successfully", "success");
      setTimeout(() => {
        // onCancel() // Fetch tasks again to update UI
        if (onCancel) {
          onCancel();
        } else if (onClicked) {
          onClicked(true);
        }
      }, 1000)

    } catch (error) {
      handleSnackbar("Failed to add task", "error");
      console.error("Error:", error);
    }

  }


  dayjs.locale('en'); // Set the locale for dayjs
  // Function to check if a date is before today to diable dates in calendar before today
  const isBeforeToday = (date: any) => {
    const today = dayjs().startOf('day');
    return dayjs(date).isBefore(today);
  };

  return (
    <div className="outerDiv">

      <CustomizedSnackbar
        open={snackbarOpen}
        handleClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />

      <form onSubmit={handleSubmit}>

        {/* title  */}
        <div className="forMargin titleDiv">
          <CustomTextField className="titleDivTextField"
            label="Title"
            variant="outlined"
            value={title}
            required
            onChange={(e: any) => setTitle(e.target.value)}
            inputProps={{
              maxLength: 50, // Maximum length for the title
            }}
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
          >{title.length}/50
          </div>
        </div>


        {/* dropdown */}
        <div>
          <div className="forMargin custom-select">
            <CustomSelect
              className="selectDivCustomSelect"
              value={selectedOption || ''}
              onChange={handleOptionChange}
              displayEmpty
              required
              variant="outlined"
              renderValue={(value) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {typeof value === 'string' && (
                    <>
                      {value === 'My Tasks' && <img src={myTask} alt="My Tasks" style={{ width: 20, height: 20 }} />}
                      {value === 'Follow UP' && <img src={followUp} alt="Follow Up" style={{ width: 20, height: 20 }} />}
                      {value === 'Other' && <img src={other} alt="Other" style={{ width: 20, height: 20 }} />}
                      <span style={{ marginLeft: '8px' }}>{value}</span>
                    </>
                  )}
                  {!value && <span style={{ display: "flex" }}><img src={taskType2} style={{ marginRight: 8, width: 20, height: 20 }} /> Select Task Type *</span>}
                </div>
              )}>
              <MenuItem value="My Tasks">
                <img src={myTask} alt="My Tasks" style={{ marginRight: 8, width: 20, height: 20 }} />
                My Tasks
              </MenuItem>
              <MenuItem value="Follow UP">
                <img src={followUp} alt="Follow Up" style={{ marginRight: 8, width: 20, height: 20 }} />
                Follow Up
              </MenuItem>
              <MenuItem value="Other">
                <img src={other} alt="Other" style={{ marginRight: 8, width: 20, height: 20 }} />
                Other
              </MenuItem>
            </CustomSelect>
          </div>
        </div>


        {/* setreminder */}

        <div className="forMargin setReminderDiv">
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


        {/* due date */}
        <div className="forMargin">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {/* <DatePicker */}
            <DateTimePicker
              className="dueDatePciker"
              label="Deadline date"
              value={dueDate}
              onChange={(newValue) => setDueDate(newValue)}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
              disablePast={true}
              shouldDisableDate={isBeforeToday}
            />
          </LocalizationProvider>
        </div>


        {/* notes */}
        <div>
          <Textarea className="forMargin textAreaNotes"
            maxRows={8}
            minRows={4}
            value={notes}
            aria-label="maximum height"
            placeholder="Notes"
            onChange={handleNotesChange}
            // minLength={10}
            maxLength={200}
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
              marginTop: "-12px"
            }}
          >{notes.length}/200</div>
        </div>


        {/* submit */}
        <div className="forMargin submitDiv">
          <Button
            color="primary"
            type="button"
            className="buttons cancel"
            onClick={handleCancel}
            style={{ backgroundColor: 'white' }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            type="submit"
            className="buttons submit"
            style={{
              boxShadow: '0px 3px 1px -2px #00000033, 0px 2px 2px 0px #00000024, 0px 1px 5px 0px #0000001F', backgroundColor: "#F1F3F4"
            }}
          >
            Submit
          </Button>
        </div>

      </form>
    </div>
  );
};

export default TaskForm
