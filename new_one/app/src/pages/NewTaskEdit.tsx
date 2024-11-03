import { useState } from 'react';
import { Tasks } from './SideBar';
import "../css/newTaskForm.css";
import calendarRed from "../assets/calendarRed.svg";
import TASKTYPE from "../assets/NewTaskForm/taskType.svg";
import redReminder from "../assets/redReminder.svg";
import CANCEL from "../assets/NewTaskForm/intoGrey.svg";
import SEND from "../assets/NewTaskForm/send.svg";
import { MenuItem, Modal, Select } from "@mui/material";
import myTask from "../assets/myTask.svg";
import followUp from "../assets/followUp.svg";
import other from "../assets/other.svg";
import { styled } from "@mui/system";
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import 'dayjs/locale/en';
import { TESTING_URL } from "@/ApiLinks";
import CustomizedSnackbar from "@/snackBar/customizedSnackBar";
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import CustomCalendar from '@/customDatePicker/CustomCalendar';
import LocalStorageItem from '@/utils/util';

// Assuming you have the same styled components and imports as in TaskForm
interface TaskEditFormProps {
    task: Tasks;
    // onCancelView: () => void;
    closeTaskFormEdit: () => void;
    submitTaskFormEdit: () => void;
    setFetchedTasks: React.Dispatch<React.SetStateAction<Tasks[]>>;
}

const Textarea = styled(BaseTextareaAutosize)(
    () => `
    box-sizing: border-box;
    font-family:poppins;
    width:90%;
    font-size: 15px;
    font-weight: 400;
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

const NewTaskEdit: React.FC<TaskEditFormProps> = ({ task, closeTaskFormEdit, submitTaskFormEdit,setFetchedTasks  }) => {

    const [initialState] = useState({
        title: task.title,
        selectedOption: task.taskType.taskType,
        reminderDate: task.setReminders[0] ? dayjs(task.setReminders[0].reminderTimestamp) : null,
        dueDate: task.deadline ? dayjs(task.deadline) : null,
        notes: task.notes,
    });



    const [selectedOption, setSelectedOption] = useState<string | null>(task.taskType.taskType); //task type
    const [_, setShowOptions] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(task.title); //title
    const [description, setDescription] = useState<string>(task.notes || ''); //title

    const [dueDate, setDueDate] = useState<Date | null>(task.deadline ? new Date(task.deadline) : null);
    const [reminder, setReminder] = useState<Date | null>(task.setReminders[0] ? new Date(task.setReminders[0].reminderTimestamp) : null);

    const buttonClass = title ? "buttonSendWithoutTitle" : "buttonSend";

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
        setSelectedOption(null);
        setReminder(null);
        setDueDate(null);
        // if (closeTaskFormEdit) {
        closeTaskFormEdit();
        // }
    }

    const isFormEdited = () => {
        return (
            title !== initialState.title ||
            selectedOption !== initialState.selectedOption ||
            description !== initialState.notes
        );
    };

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



    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isFormEdited()) {
            handleSnackbar("Please edit before submitting", "warning");
            return;
        }

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

        function formatCustomDate(date:any) {
            const year = date.getFullYear();
            const month = ('0' + (date.getMonth() + 1)).slice(-2);
            const day = ('0' + date.getDate()).slice(-2);
            const hours = ('0' + date.getHours()).slice(-2);
            const minutes = ('0' + date.getMinutes()).slice(-2);
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        }

        const editedFormData: any = {
            id: task.id,
            title: title,
            taskType: { id: selectedTaskTypeId },
            createdDate: getCurrentDateTimeFormatted()
        };

        if (description) {
            editedFormData.notes = description;
        }

        // Add reminder only if it is not empty
        if (reminder) {
            const formattedReminderDate = formatCustomDate(reminder);
            editedFormData.reminder = { id: task.setReminders[0]?.id, reminderTimestamp: formattedReminderDate, status: { id: 2 } };
        }
        // Add deadline only if it is not empty
        if (dueDate) {
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

        console.log("editedFormData", editedFormData);


        try {
            const response = await fetch(`${TESTING_URL}/api/v1/tasks`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': LocalStorageItem()
                },
                body: JSON.stringify(editedFormData)
            });

            const responseData = await response.json();
            console.log("Responseee at taskEditform:", responseData);
            setFetchedTasks(prevTasks => prevTasks.map(t => t.id === responseData.id ? responseData : t));
            handleSnackbar("Task edited successfully", "success");
            setTimeout(() => {
                submitTaskFormEdit();
                setTitle("");
                setDescription("");
                setSelectedOption(null);
                setReminder(null);
                setDueDate(null);
            }, 800)

        } catch (error) {
            handleSnackbar("Failed to edit task", "error");
            console.log("Error:", error);
        }

    }


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

    const cancelReminderFromEdit = () => {
        setReminder(null);
    }

    const cancelDueDateFromEdit = () => {
        setDueDate(null);
    }

    return (
        <>
            <CustomizedSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                message={snackbarMessage}
                severity={snackbarSeverity}
            />

            <form onSubmit={handleFormSubmit}>
                <div >

                    {/* title */}
                    <Textarea className="inputNewTaskForm1"
                        style={{ fontSize: "14px", fontWeight: "500" }}
                        maxRows={3}
                        minRows={1}
                        placeholder="Task Title"
                        required
                        maxLength={50}
                        value={title}
                        onChange={(e: any) => setTitle(e.target.value)}
                    />

                    {/* description */}
                    <Textarea className="inputNewTaskForm2 commonMargin"
                        style={{ fontSize: "14px", fontWeight: "400" }}
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
                            className="newTaskFormInnerDiv1 commonMargin"
                        >
                            <div className='newTaskFormSecondInnerDiv1' onClick={handleOpenForScheduleDD}>
                                <img src={calendarRed} alt="" width={"18px"} />
                                <p>{dueDate ? formatDueDateForUi(dueDate) : 'Due Date'}</p>
                            </div>
                            <div className='divForCancelDueDate' onClick={cancelDueDateFromEdit}>
                                <img src={CANCEL} alt="" width={"10px"} />
                            </div>
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
              <CustomCalendar onCloseModalCC={handleCloseCalendarForScheduleDD} onSetDateTime={handleSetDueDate}  />
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
                                                <span >{value}</span>
                                            </>
                                        )}
                                        {!value && <span style={{ display: "flex" }}><img src={TASKTYPE} style={{ marginRight: 8, width: 18, height: 18, marginLeft: -16 }} />Task Type </span>}
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
                    <div className="newTaskFormInnerDiv commonMargin">

                        {/* reminder */}
                        <div className="newTaskFormInnerDiv3 commonMargin" >
                            <div className='newTaskFormSecondInnerDiv1' onClick={handleOpenForScheduleRM}>
                                <img src={redReminder} width={"18px"} alt="" />
                                <p> {reminder ? formatDueDateForUi(reminder) : 'Reminder'}</p>
                            </div>
                            <div className='divForCancelDueDate' onClick={cancelReminderFromEdit}>
                                <img src={CANCEL} alt="" width={"10px"} />
                            </div>

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
                                <CustomCalendar onCloseModalCC={handleCloseCalendarForScheduleRM} onSetDateTime={handleSetReminder} />
                            </div>
                        </Modal>
                        <div></div>
                    </div>

                    <div id="borderLineLP"></div>

                    {/* submit button */}
                    <div className="ButtonDivs">
                        <button className="buttonCancel" type="button" onClick={handleCancelForm}><img src={CANCEL} alt="" /></button>
                        <button className={`${buttonClass}`} type="submit" ><img src={SEND} alt="" /></button>
                    </div>
                </div>

            </form>

        </>
    )
}

export default NewTaskEdit