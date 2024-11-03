import "../css/newTaskForm.css";
import calendarRed from "../assets/calendarRed.svg";
// import TASKTYPE from "../assets/NewTaskForm/taskType.svg";
import redReminder from "../assets/redReminder.svg";
import CANCEL from "../assets/NewTaskForm/intoGrey.svg";
import SEND from "../assets/NewTaskForm/send.svg";
import { CircularProgress, MenuItem, Modal, Select } from "@mui/material";
import myTask from "../assets/myTask.svg";
import followUp from "../assets/followUp.svg";
import other from "../assets/other.svg";
import { styled } from "@mui/system";
import { useState } from "react";
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import 'dayjs/locale/en';
import { TESTING_URL } from "@/ApiLinks";
import CustomizedSnackbar from "@/snackBar/customizedSnackBar";
import dayjs from 'dayjs';
import CustomCalendar from "@/customDatePicker/CustomCalendar";
import LocalStorageItem from "@/utils/util";
// import CustomCalendarForSchedule from "@/customDatePicker/CustomCalendarForSchedule";

interface TaskFormProps {
  onClicked?: (success: boolean) => void;
  onCancel?: () => void; // Define the type of onCancel prop
  messageIdForTaskFn?: any;
  mailSubject?: string;
  closeTaskForm?: () => void;
  toRender?: () => void;
  mailUrl?: any;
  handleNewTaskAdded: (task: any) => void;
}

const Textarea = styled(BaseTextareaAutosize)(
  () => `
  box-sizing: border-box;
  font-family:poppins;
  width:94%;
  line-height: 1.5;
  border-radius: 8px;
  resize: none;
  border: none;
  &:hover {
    border-color: rgb(33,33,33); /* Set border color to transparent on hover */
  }
  &:focus {
    outline: none; 
    border: none;
  }

`,
);

//dropdown custom properties mui
const CustomSelect = styled(Select)({
  width: '80px',
  height: '25px',
  fontSize: '11px',
  color: 'black',
  borderColor: "#0000003B",
  ':focus': {
    outline: 'none',
    borderColor: '#0000003B'
  },
});


const CustomMenuItem = styled(MenuItem)({
  fontSize: '12px'
});

const NewTaskForm: React.FC<TaskFormProps> = ({ messageIdForTaskFn, mailSubject, closeTaskForm, toRender, mailUrl, handleNewTaskAdded }) => {


  const [selectedOption, setSelectedOption] = useState('My Tasks') //task type
  const [_, setShowOptions] = useState<boolean>(false);
  const [title, setTitle] = useState<string>((mailSubject || '').split(' ').slice(0, 50).join(' ')); //title
  const [description, setDescription] = useState<string>(''); //title

  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [reminder, setReminder] = useState<Date | null>(null);
  // const [open, setOpen] = useState(false); //open calendar for dueDate
  // const [openForReminder, setOpenForReminder] = useState(false); //open calendar for reminder

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

  //task type
  const handleOptionChange = (e: any) => {
    setSelectedOption(e.target.value);
    setShowOptions(false);
  };

  const NoIcon = () => null;

  const handleCancelForm = () => {
    setTitle("");
    setDescription("");
    // setSelectedOption(null);
    setReminder(null);
    setDueDate(null);
    if (closeTaskForm) {
      closeTaskForm();
    }
  }

  console.log("mailSubject in NewTaskForm", mailSubject, mailUrl);

  console.log("dueDateS", dueDate)

  const [buttonLoading, setButtonLoading] = useState(false);
  const [__, setButtonDisabled] = useState(false);


  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let selectedTaskTypeId; //to get id of tasktype
    try {
      const res = await fetch(`${TESTING_URL}/api/v1/tasks/master-task-type`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': LocalStorageItem()
        }
      })
      const resData = await res.json();
      console.log("resDataTasktype", resData);
      selectedTaskTypeId = resData.find((taskType: any) => taskType.taskType === selectedOption)?.id;
    }
    catch (error) {
      console.log("error", error);
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


    let formattedReminderDate;
    if (reminder) {
      formattedReminderDate = formatCustomDate(reminder);
    }

    //for setReminder date and time
    // function formatCustomDate(dateObj: any): string {
    //   // Extract the date parts
    //   const year = dateObj.$y;
    //   const month = dateObj.$M + 1; // Note: JavaScript months are 0-indexed, so you might need to adjust this
    //   const formattedMonth = month < 10 ? `0${month}` : month;
    //   const day = dateObj.$D;
    //   const formattedDay = day < 10 ? `0${day}` : day;
    //   const hour = dateObj.$H;
    //   const formattedHour = hour < 10 ? `0${hour}` : hour;
    //   const minute = dateObj.$m;
    //   // const ampm = hour >= 12 ? 'PM' : 'AM';

    //   // Format the date and time
    //   const formattedDateAccToBackend = `${year}-${formattedMonth}-${formattedDay}T${formattedHour}:${minute < 10 ? '0' : ''}${minute}`;
    //   return formattedDateAccToBackend;
    // }

    function formatCustomDate(date: any) {
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      const hours = ('0' + date.getHours()).slice(-2);
      const minutes = ('0' + date.getMinutes()).slice(-2);
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    let formattedDueDate;
    if (dueDate) {
      formattedDueDate = formatCustomDate(dueDate);
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
      description?: string;
      mailUrl?: string;
      // emailMessage?: {emailMessageId :string}
    } = {
      title,
      taskType: { id: selectedTaskTypeId },
      createdDate: getCurrentDateTimeFormatted(),
      taskStatus: { id: 3 },
      client: { id: 1 }
    };

    if (description) {
      formData.notes = description;
    }

    if (messageIdForTaskFn) formData.standardEmailId = messageIdForTaskFn;

    if (mailSubject) formData.description = mailSubject;

    if (mailUrl) formData.mailUrl = mailUrl;

    if (formattedReminderDate) {
      formData.reminder = { reminderTimestamp: formattedReminderDate, status: { id: 2 } };
    }

    if (formattedDueDate) {
      formData.deadline = formattedDueDate;
    }

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

    console.log("formDataNew", formData);


    try {
      setButtonLoading(true);
      setButtonDisabled(true);
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
      // setFetchedTasks((prevTasks) => [responseData, ...prevTasks]);
      setTitle("");
      setDescription("");
      setReminder(null);
      setDueDate(null);
      handleSnackbar("Task addedd successfully", "success");
      setButtonLoading(false);
      setButtonDisabled(false);
      handleNewTaskAdded(responseData);
      setTimeout(() => {
        if (closeTaskForm) {
          closeTaskForm();
        }
        if (toRender) {
          toRender()
        }
      }, 800)

    }
    catch (error) {
      setButtonLoading(false);
      setButtonDisabled(false);
      handleSnackbar("Failed to add task", "error");
      console.error("Error:", error);
    }
  }


  const buttonClass = title ? "buttonSendWithoutTitle" : "buttonSend";

  const formatDueDateForUi = (dueDate: any) => {
    const selectedDate = dayjs(dueDate);

    const today = dayjs().startOf('day');
    const tomorrow = dayjs().add(1, 'day').startOf('day');
    const nextWeek = dayjs().add(7, 'days').startOf('day');

    if (selectedDate.isSame(today, 'day')) {
      return `Today ${selectedDate.format('h:mm A')}`;
    } else if (selectedDate.isSame(tomorrow, 'day')) {
      return `Tomorrow ${selectedDate.format('h:mm A')}`;
    } else if (selectedDate.isBefore(nextWeek)) {
      return selectedDate.format('dddd h:mm A');
    } else {
      return selectedDate.format('DD MMM h:mm A');
    }
  };

  // console.log("styles", styles);

  // reminder
  const [openForScheduleRM, setOpenForScheduleRM] = useState(false);
  const handleOpenForScheduleRM = () => {
    setOpenForScheduleRM(true);
  };
  const handleCloseCalendarForScheduleRM = () => {
    setOpenForScheduleRM(false);
  };

  const handleSetReminder = (formattedDateTime: string) => {
    setReminder(new Date(formattedDateTime));
  };

  //dure date

  const [openForScheduleDD, setOpenForScheduleDD] = useState(false);
  const handleOpenForScheduleDD = () => {
    setOpenForScheduleDD(true);
  };

  const handleCloseCalendarForScheduleDD = () => {
    setOpenForScheduleDD(false);
  };

  const handleSetDueDate = (formattedDateTime: string) => {
    setDueDate(new Date(formattedDateTime));
  };


  // const [openForSchedule, setOpenForSchedule] = useState(false);

  // const handleOpenForSchedule = () => {
  //   setOpenForSchedule(true);
  // };

  // const handleCloseCalendarForSchedule = () => {
  //   setOpenForSchedule(false);
  // };




  return (
    <>
      <CustomizedSnackbar
        open={snackbarOpen}
        handleClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />

      <form onSubmit={handleFormSubmit}>
        <div className="newTaskFormOuterDiv">

          {/* title */}
          <Textarea
            minRows={1}
            maxRows={4}
            className="inputNewTaskForm1"
            placeholder="Task Title"
            required
            maxLength={50}
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
          />

          {/* description */}
          <Textarea className="inputNewTaskForm2 commonMargin"
            maxRows={8}
            minRows={1}
            aria-label="maximum height"
            placeholder="Description"
            maxLength={200}
            value={description}
            onChange={(e: any) => setDescription(e.target.value)}
          />

          <div className="newTaskFormInnerDiv ">
            {/* Due Date */}

            <div
              className="newTaskFormInnerDiv1 commonMargin additionalNTF"
              onClick={handleOpenForScheduleDD} >
              <img src={calendarRed} alt="" width={"17px"} />
              <p> {dueDate ? formatDueDateForUi(dueDate) : 'Due Date'}</p>

            </div>

            <Modal
              open={openForScheduleDD}
              onClose={handleCloseCalendarForScheduleDD}
              aria-labelledby="schedule-modal"
              aria-describedby="pick-date-and-time"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ backgroundColor: 'white' }}>
                <CustomCalendar onCloseModalCC={handleCloseCalendarForScheduleDD} onSetDateTime={handleSetDueDate} dueDate={dueDate} />
              </div>
            </Modal>

            {/* taskType */}

            <div className="newTaskFormInnerDiv2">
              <CustomSelect
                className="selectDivCustomSelect"
                value={selectedOption || ''}
                IconComponent={NoIcon}
                onChange={handleOptionChange}
                displayEmpty
                required
                sx={{
                  fontFamily: "Poppins",
                  boxShadow: "none",
                  ".MuiOutlinedInput-notchedOutline": { border: 0 },
                  "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                  {
                    border: 0,
                  },
                  "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    border: 0,
                  },
                }}
                variant="outlined"
                renderValue={(value: any) => (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {typeof value === 'string' && (
                      <>
                        {value === 'My Tasks' && <img src={myTask} alt="My Tasks" style={{ width: 16, height: 16, marginRight: "10px", marginLeft: -14 }} />}
                        {value === 'Follow Up' && <img src={followUp} alt="Follow Up" style={{ width: 16, height: 16, marginRight: "10px", marginLeft: -14 }} />}
                        {value === 'Other' && <img src={other} alt="Other" style={{ width: 16, height: 16, marginRight: "10px", marginLeft: -14 }} />}
                        <span style={{ marginTop: "1px" }}>{value}</span>
                      </>
                    )}
                    {/* {!value && <span style={{ display: "flex",alignItems:"center" }}><img src={TASKTYPE} style={{ marginRight: 8, width: 18, height: 18, marginLeft: -16 }} />Task Type </span>} */}
                  </div>
                )}>
                <CustomMenuItem value="My Tasks">
                  <img src={myTask} alt="My Tasks" style={{ marginRight: 8, width: 18, height: 18 }} />
                  My Tasks
                </CustomMenuItem>
                <CustomMenuItem value="Follow Up">
                  <img src={followUp} alt="Follow Up" style={{ marginRight: 8, width: 18, height: 18 }} />
                  Follow Up
                </CustomMenuItem>
                <CustomMenuItem value="Other">
                  <img src={other} alt="Other" style={{ marginRight: 8, width: 18, height: 18 }} />
                  Other
                </CustomMenuItem>
              </CustomSelect>
            </div>

          </div>

          {/* reminder */}
          <div className="newTaskFormInnerDiv">

            <div className="newTaskFormInnerDiv3 commonMargin additionalNTF" onClick={handleOpenForScheduleRM}>
              <img src={redReminder} width={"17px"} alt="" />
              <p>{reminder ? formatDueDateForUi(reminder) : 'Reminder'}</p>
            </div>

            <Modal
              open={openForScheduleRM}
              onClose={handleCloseCalendarForScheduleRM}
              aria-labelledby="schedule-modal"
              aria-describedby="pick-date-and-time"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ backgroundColor: 'white' }}>
                <CustomCalendar onCloseModalCC={handleCloseCalendarForScheduleRM} onSetDateTime={handleSetReminder}  dueDate={dueDate} />
              </div>
            </Modal>
          </div>

          {/* schedule button */}
          {/* <div >
            <button type="button" onClick={handleOpenForSchedule}>schedule</button>

            <Modal
              open={openForSchedule}
              onClose={handleCloseCalendarForSchedule}
              aria-labelledby="schedule-modal"
              aria-describedby="pick-date-and-time"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ backgroundColor: 'white' }}>
                <CustomCalendar onCloseModalCC={handleCloseCalendarForSchedule} />
              </div>
            </Modal>
          </div> */}

          {/* schedule */}
          {/* <div className="newTaskFormInnerDiv">

            <div className="newTaskFormInnerDiv3 commonMargin additionalNTF" onClick={handleOpenForSchedule}>
              <img src={calendarRed} width={"17px"} alt="" />
              <p>{reminder ? formatDueDateForUi(reminder) : 'schedule'}</p>
            </div>
            <Modal
              open={openForSchedule}
              onClose={handleCloseCalendarForSchedule}
              aria-labelledby="schedule-modal"
              aria-describedby="pick-date-and-time"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ backgroundColor: 'white' }}>
              <CustomCalendarForSchedule onCloseModalCC={handleCloseCalendarForSchedule} />
              </div>
            </Modal>
          </div> */}


          {/* submit button */}
          <div className="ButtonDivs">
            <button className="buttonCancel" type="button" onClick={handleCancelForm}><img src={CANCEL} alt="" /></button>

            <button className={`${buttonClass}`} type="submit" >
              {buttonLoading ? <CircularProgress size={18} style={{ color: 'white' }} /> : <img src={SEND} alt="" />}
            </button>
          </div>
        </div>

      </form>

    </>
  )
}

export default NewTaskForm