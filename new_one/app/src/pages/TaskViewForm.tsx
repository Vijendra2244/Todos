import React, { useState } from 'react';
import { Tasks } from './SideBar'; // Ensure this import path is correct
import myTask from "../assets/myTask.svg";
import followUp from "../assets/followUp.svg";
import other from "../assets/other.svg";
import "../css/taskform.css";
import { Button, Select, TextField } from "@mui/material";
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from "@mui/system";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs'; // Import dayjs
// import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

interface TaskEditFormProps {
  task: Tasks;
  onCancelView: () => void;
}

const Textarea = styled(BaseTextareaAutosize)(
  () => `
  box-sizing: border-box;
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

// Title custom properties
const CustomTextField = styled(TextField)({
});

//dropdown
const CustomSelect = styled(Select)({

});

const TaskViewForm: React.FC<TaskEditFormProps> = ({ task, onCancelView }) => {
  // Initialize state with task data, converting Date objects to Dayjs objects
  const [title] = useState<string>(task.title);
  const [selectedOption] = useState<string>(task.taskType.taskType); // Assuming taskType is an object with a name property
  const [reminderDate] = useState<dayjs.Dayjs | null>(task.setReminders[0] ? dayjs(task.setReminders[0].reminderTimestamp) : null);
  const [dueDate] = useState<dayjs.Dayjs | null>(task.deadline ? dayjs(task.deadline) : null);
  const [notes] = useState<string>(task.notes);


  return (
    <div className="outerDiv" style={{ backgroundColor: "white", width: "85%" }}>
      <form>
        <h3 style={{ marginBottom: "30px" }}></h3>

        <div className="forMargin titleDiv">
          <CustomTextField className="titleDivTextField"
            label="Title"
            variant="outlined"
            disabled
            value={title}
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
          >{title.length}/50</div>
        </div>


        {/* notes */}
        <div>
          <Textarea className="textAreaNote"
            maxRows={6}
            minRows={3}
            value={notes}
            disabled
            aria-label="maximum height"
            placeholder="Notes"
            maxLength={200}
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


        {/* dropdown */}
        {/* <div>
        <Tooltip title="Task Type">
          <div className="forMargin custom-select">
            <CustomSelect
              className="selectDivCustomSelect"
              value={selectedOption}
              displayEmpty
              variant="standard"
              renderValue={(value) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {typeof value === 'string' && (
                    <>
                      {value === 'My Tasks' && <img src={myTask} alt="My Tasks" style={{ width: 20, height: 20 }} />}
                      {value === 'Follow Up' && <img src={followUp} alt="Follow Up" style={{ width: 20, height: 20 }} />}
                      {value === 'Other' && <img src={other} alt="Other" style={{ width: 20, height: 20 }} />}
                      <span style={{ marginLeft: '8px' }}>{value}</span>
                    </>
                  )}
                 
                </div>
              )}>
            </CustomSelect>
          </div>
          </Tooltip>
        </div> */}


        <div>
          <div className="forMarginn custom-select">
            <CustomSelect
              className="selectDivCustomSelect"
              value={selectedOption}
              displayEmpty
              disabled
              variant="outlined"
              renderValue={(value) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {typeof value === 'string' && (
                    <>
                      {value === 'My Tasks' && <img src={myTask} alt="My Tasks" style={{ width: 20, height: 20, marginRight: "5px" }} />}
                      {value === 'Follow Up' && <img src={followUp} alt="Follow Up" style={{ width: 20, height: 20, marginRight: "5px" }} />}
                      {value === 'Other' && <img src={other} alt="Other" style={{ width: 20, height: 20, marginRight: "5px" }} />}
                      <span style={{ marginLeft: '8px' }}>{value}</span>
                    </>
                  )}

                </div>
              )}>
            </CustomSelect>
          </div>
        </div>



        {/* setreminder */}
        <div className="forMarginn setReminderDiv">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              // variant="standard"
              className="setReminderPicker"
              label="Reminder"
              disabled
              value={reminderDate}
              viewRenderers={{
                hours: () => null, // Empty function to prevent rendering hours view
                minutes: () => null, // Empty function to prevent rendering minutes view
                seconds: () => null,
              }}
            />
          </LocalizationProvider>
        </div>

        {/* due date */}
        <div className="forMargin">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              className="dueDatePciker"
              label="Deadline"
              value={dueDate}
              disabled
              viewRenderers={{
                hours: () => null, // Empty function to prevent rendering hours view
                minutes: () => null, // Empty function to prevent rendering minutes view
                seconds: () => null,
              }}
            />
          </LocalizationProvider>
        </div>

        {/* submit */}
        <div className="forMargin submitDiv">
          <Button
            type="button"
            color="primary"
            className="buttons submit"
            onClick={onCancelView}
            variant='contained'
          > close </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskViewForm;
