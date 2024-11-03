import {
  Box,
  Select,
  Skeleton,
  Tooltip,
  MenuItem,
  Popper,
  MenuList,
  Popover,
  Typography,
  CircularProgress,
  Modal,
  Paper,
} from "@mui/material";
// import addSymbol from "../assets/addSymbol.svg";
import ADDTASKFLOAT from "../assets/LandingPage/AddTaskFloat.svg";
import { window_send_message } from "@/store";
import { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import calendarRed from "../assets/calendarRed.svg";
import axios from "axios";
import TaskFilters from "@/components/TaskFilters";
import MAILIMG from "../assets/outersidebar/mailLogo.svg";
import BACKIMG from "../assets/outersidebar/backImage.svg";
import CustomizedSnackbar from "@/snackBar/customizedSnackBar";
import editSvg from "../assets/edit.svg";
import deleteSvg from "../assets/delete.svg";
import { Tasks } from "./SideBar";
import { TESTING_URL } from "@/ApiLinks";
import DONE from "../assets/sidebar/done.svg";
import INPROGRESS from "../assets/sidebar/inprogress.svg";
import TODO from "../assets/sidebar/todo.svg";
import NewTaskForm from "./NewTaskForm";
import BLUETASK from "../assets/LandingPage/blueTask.svg";
import BLUECATCHUP from "../assets/LandingPage/blueCatcchup.svg";
import CatchupMails from "@/components/CatchupMails";
// import TaskViewForm from "./TaskViewForm";
import THREEDOT from "../assets/sidebar/ThreeDots.svg";
import OPENFORM from "../assets/sidebar/openForm.svg";
import NewTaskEdit from "./NewTaskEdit";
import "../css/Landingpage.css";
import styles from "../css/LandingPage.module.css";
import TaskEditForm from "./TaskEditForm";
import TASKGIF from "../assets/LandingPage/TaskGif.gif";
import BACKTOMAIL from "../assets/LandingPage/backToMail.svg";
import DROPDOWN from "../assets/LandingPage/dropDown.svg";
import DROPSIDE from "../assets/LandingPage/dropSide.svg";
import CALENDARSVG from "../assets/LandingPage/calendar.svg";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Nudges from "@/components/Nudges";
import YESTERDAYREPORT from "../assets/Nudges/YesterdayReport.svg";
import LocalStorageItem from "@/utils/util";
import { GrTask } from "react-icons/gr";
import { PiSquaresFourBold } from "react-icons/pi";
import { MdOutlineCalendarMonth } from "react-icons/md";
import Checkbox from "@mui/material/Checkbox";

interface Task {
  id: number;
  title: string;
  deadline: Date;
  setReminders: { id: number; reminderTimestamp: string }[];
  taskType: { id: number; taskType: string };
  notes: any;
  taskStatus: { id: number; taskStatusName: string };
  progress: number;
  createdDate: string;
  standardEmailId: string;
  description: string;
  mailUrl: string;
}

interface Filters {
  statusIds?: string;
  typeIds?: string;
  progress?: string;
  standardEmailId?: string;
}

const LandingPage = ({ onGoToPreviousPage, commingFromPrevComponent }: any) => {
  const [taskForm, setTaskForm] = useState(false);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [filtersShow, setFiltersShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [openCatchUpAddedMails, setOpenCatchUpAddedMails] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false); //snackbar
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const [addTask, setAddTask] = useState(false);

  //snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSnackbar = (message: string, severity: any) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const openCatchupTab = () => {
    // window_send_message("parent", "handle_openCatchupTab");
    setOpenCatchUpAddedMails(true);
  };

  const handleBackToLP = () => {
    setOpenCatchUpAddedMails(false);
  };

  const handleAdd = () => {
    // setTaskForm(true);
    setAddTask(true);
    const newTaskForm = document.getElementById("newTaskFormScroll");
    if (newTaskForm) {
      newTaskForm.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const handleCancel = () => {
    setTaskForm(false);
  };

  const showFilters = () => {
    setFiltersShow(true);
  };

  const formattedCurrentDate = (dateString: any) => {
    const utcDate = new Date(dateString); // Parse the date string
    const utcDateString = utcDate.toISOString(); // Convert to UTC string
    return new Date(utcDateString).toLocaleString("en-US", {
      // Convert back to Date object in UTC
      timeZone: "UTC", // Set time zone to UTC
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  async function openParticularMail(messageId: any) {
    console.log("mailURL in LP", messageId);
    await window_send_message(
      "parent",
      "handle_open_particular_mail",
      messageId
    );
  }

  // one is for alltasks and another is for completed tasks
  const [selectedStatusMap, setSelectedStatusMap] = useState<{
    [key: number]: string;
  }>({});
  const [selectedStatusMap2, setSelectedStatusMap2] = useState<{
    [key: number]: string;
  }>({});
  const [showCompletedList, setShowCompletedList] = useState(false);
  const [fetchedCompletedTasks, setFetchedCompletedTasks] = useState<Task[]>(
    [] || null
  );
  const [clickedOnCompleted, setClickedOnCompleted] = useState(false);

  const fetchAllCompletedTasks = async () => {
    try {
      let res = await fetch(`${TESTING_URL}/api/v1/tasks/completed`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: LocalStorageItem(),
        },
      });
      let result = await res.json();
      if (result && result.length > 0) {
        setFetchedCompletedTasks(result);
        initializeSelectedStatus2(result);
      } else {
        setFetchedCompletedTasks([]);
      }
    } catch (err) {
      console.error("falied to fetch all completed tasks", err);
    }
  };

  const initializeSelectedStatus2 = (tasks: any[]) => {
    const initialSelectedStatusMap2: { [key: number]: string } = {};
    tasks.forEach((task: any) => {
      initialSelectedStatusMap2[task.id] =
        task.taskStatus.id === 1
          ? "inProgress"
          : task.taskStatus.id === 3
          ? "Todo"
          : "completed";
    });
    setSelectedStatusMap2(initialSelectedStatusMap2);
  };

  const initializeSelectedStatus = (tasks: any[]) => {
    const initialSelectedStatusMap: { [key: number]: string } = {};
    tasks.forEach((task: any) => {
      initialSelectedStatusMap[task.id] =
        task.taskStatus.id === 1
          ? "inProgress"
          : task.taskStatus.id === 3
          ? "Todo"
          : "completed";
    });
    setSelectedStatusMap(initialSelectedStatusMap);
  };

  const handleStatusChange = (taskId: any, selectedStatus: any) => {
    setSelectedStatusMap((prevState) => ({
      ...prevState,
      [taskId]: selectedStatus,
    }));
    if (selectedStatus === "completed" || selectedStatus === "COMPLETED") {
      handleCheckBox(taskId);
    } else {
      handleChangeToInProgress(taskId);
    }
  };

  const handleStatusChange2 = (taskId: any, selectedStatus: any) => {
    setSelectedStatusMap2((prevState) => ({
      ...prevState,
      [taskId]: selectedStatus,
    }));
    if (selectedStatus === "completed" || selectedStatus === "COMPLETED") {
      handleCheckBox2(taskId);
    } else {
      handleChangeToInProgress2(taskId);
    }
  };

  const handleCheckBox2 = async (taskId: number) => {
    console.log(taskId);
    handleSnackbar("Task already completed!!", "success"); //snackBar
    // try {
    //   const response = await fetch(`${TESTING_URL}/api/v1/tasks/complete?taskId=${taskId}`, {
    //     method: 'GET',
    //     headers: {
    //       'Authorization': LocalStorageItem()
    //     }
    //   });
    //   const res = await response.json();
    //   console.log("handleCheck res", res);
    //   if (res.taskStatus.id == 2) {
    //     console.log("Task completed successfully",);
    //     setFetchedCompletedTasks((prevTasks) => prevTasks?.filter((eachTask) => eachTask.id !== taskId));
    //     setSelectedStatusMap2((prevMap) => ({
    //       ...prevMap,
    //       [taskId]: res.taskStatus.taskStatusName
    //     }));
    //     setAllTasks((prevCompletedTasks) => [...prevCompletedTasks, res]);
    //     handleSnackbar("Task completed!!", "success");  //snackBar
    //   }
    //   else if (res.taskStatus.id == 4) {
    //     // fetchAllTasks();
    //     setFetchedCompletedTasks((prevTasks) => prevTasks?.filter((eachTask) => eachTask.id !== taskId));
    //     handleSnackbar("Task Overdue", "warning");  //snackBar
    //   }
    // } catch (error) {
    //   handleSnackbar("Error completing task", "error");  //snackBar
    //   console.error("Network error:", error);
    // }
  };

  const handleCheckBox = async (taskId: number) => {
    try {
      const response = await fetch(
        `${TESTING_URL}/api/v1/tasks/complete?taskId=${taskId}`,
        {
          method: "GET",
          headers: {
            Authorization: LocalStorageItem(),
          },
        }
      );
      const res = await response.json();
      console.log("handleCheck res", res);

      if (res.taskStatus.id == 2) {
        console.log("Task completed successfully");
        // setSelectedStatusMap((prevMap) => ({
        //   ...prevMap,
        //   [taskId]: res.taskStatus.taskStatusName
        // }));
        setAllTasks((prevTasks) =>
          prevTasks?.filter((eachTask) => eachTask.id !== taskId)
        );
        setSelectedStatusMap2((prevMap) => ({
          ...prevMap,
          [taskId]: res.taskStatus.taskStatusName,
        }));
        setFetchedCompletedTasks((prevCompletedTasks) => [
          ...prevCompletedTasks,
          res,
        ]);
        handleSnackbar("Task completed!!", "success"); //snackBar
      } else if (res.taskStatus.id == 4) {
        // fetchAllTasks();
        setAllTasks((prevTasks) =>
          prevTasks?.filter((eachTask) => eachTask.id !== taskId)
        );
        handleSnackbar("Task Overdue", "warning"); //snackBar
      }
    } catch (error) {
      handleSnackbar("Error completing task", "error"); //snackBar
      console.error("Network error:", error);
    }
  };

  const handleChangeToInProgress2 = async (taskId: any) => {
    try {
      const response = await fetch(
        `${TESTING_URL}/api/v1/tasks/status?taskId=${taskId}&masterTaskStatusId=1`,
        {
          method: "PUT",
          headers: {
            Authorization: LocalStorageItem(),
          },
        }
      );
      const res = await response.json();
      if (res) {
        console.log("Task converted to in progress successfully", res);
        // fetchAllTasks();
        // fetchAllCompletedTasks();
        setFetchedCompletedTasks((prevCompletedTasks) =>
          prevCompletedTasks?.filter((task) => task.id !== taskId)
        );
        setAllTasks((prevTask) => [...prevTask, res]);
        setSelectedStatusMap((prevMap) => ({
          ...prevMap,
          [taskId]: res.taskStatus.taskStatusName,
        }));
      } else {
        console.log(
          "Failed to convert to Inprogress task progress:",
          response.statusText
        );
      }
    } catch (error) {
      console.log("Error converting to inprogress", error);
    }
  };

  const handleChangeToInProgress = async (taskId: any) => {
    try {
      const response = await fetch(
        `${TESTING_URL}/api/v1/tasks/status?taskId=${taskId}&masterTaskStatusId=1`,
        {
          method: "PUT",
          headers: {
            Authorization: LocalStorageItem(),
          },
        }
      );
      const res = await response.json();
      console.log("change in progress line 365");
      if (res) {
        console.log("Task converted to in progress successfully", res);
        setSelectedStatusMap((prevMap) => ({
          ...prevMap,
          [taskId]: res.taskStatus.taskStatusName,
        }));
      } else {
        console.log(
          "Failed to convert to Inprogress task progress:",
          response.statusText
        );
      }
    } catch (error) {
      console.log("Error converting to inprogress", error);
    }
  };

  const fetchAllTasks = async (filters?: Filters) => {
    console.log("filters?", filters);
    try {
      setLoading(true);
      let url = `${TESTING_URL}/api/v1/tasks/user`; // Default API URL
      console.log("filterssss", filters);

      // Check if any filter parameter contains a non-empty value
      const hasNonEmptyFilter = Object.values(filters || {}).some((value) => {
        return value !== "";
      });

      // Construct the URL parameters string if at least one filter parameter has a non-empty value
      if (hasNonEmptyFilter) {
        url = `${TESTING_URL}/api/v1/tasks/filters?`;

        // Manually construct the URL parameters string
        const params = Object.entries(filters || {})
          .filter(([_, value]) => value !== undefined && value !== "")
          .map(([key, value]) => `${key}=${value}`)
          .join("&");

        url += params;
        console.log("url", url);
      }
      const response = await axios.get(url, {
        headers: {
          Authorization: LocalStorageItem(),
        },
      });
      setLoading(false);
      if (response.data) {
        setAllTasks(response.data);
        initializeSelectedStatus(response.data);
      }
    } catch (err) {
      setLoading(false);
      console.log("error fetching all tasks", err);
    }
  };

  //edit tasks
  const [___, setSelectedTask] = useState<Tasks | null>(null);
  // const [isEditing, setIsEditing] = useState<boolean>(false);

  const [deletePopoverAnchor, setDeletePopoverAnchor] = useState(null); //delete popover
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  useEffect(() => {
    fetchAllTasks();
  }, []);

  //catchup email count
  const [catchupEmailCount, setCatchupEmailCount] = useState(0);

  function handleCompltete() {
    setShowCompletedList(!showCompletedList);
    setClickedOnCompleted(!clickedOnCompleted);
    setTimeout(() => {
      const newTaskForm = document.getElementById("iii");
      if (newTaskForm) {
        newTaskForm.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        console.error('Element with id "iii" not found.');
      }
    }, 50);
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchAndCountCatchupMails();
      await fetchAllCompletedTasks();
    };

    fetchData();
  }, []);

  const fetchAndCountCatchupMails = async () => {
    console.log("called fetchAndCountCatchupMails");
    try {
      let res = await fetch(
        `${TESTING_URL}/api/v1/emails/catch-up-later-emails/users`,
        {
          headers: {
            Authorization: LocalStorageItem(),
          },
        }
      );
      const data = await res.json();
      if (data.length > 0) {
        setCatchupEmailCount(data.length);
      } else {
        setCatchupEmailCount(0);
      }
    } catch (err) {
      console.error("fetchAndCountCatchupMails", err);
    }
  };

  const handleCancelView = () => {
    setSelectedTask(null);
    fetchAllTasks();
    // setIsEditing(false);
    setTaskToEdit(null);
  };

  //for delete popover
  const handleOpenDeletePopover = (taskId: any) => (event: any) => {
    setDeletingTaskId(taskId);
    setDeletePopoverAnchor(event.currentTarget);
  };

  const handleCloseDeletePopover = () => {
    setAnchorElOfThreeDots(null);
    setOpenPopOfThreeDots(false);
    setDeletePopoverAnchor(null);
    setDeletingTaskId(null);
  };

  const handleConfirmDelete = async () => {
    try {
      setButtonLoading(true);
      const response = await fetch(
        `${TESTING_URL}/api/v1/tasks?taskId=${deletingTaskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: LocalStorageItem(),
          },
        }
      );
      const resDtata = await response.json();
      console.log("res Delete", deletingTaskId, resDtata);
      setAllTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== deletingTaskId)
      );
      setFetchedCompletedTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== deletingTaskId)
      );
      handleCloseDeletePopover();
      handleSnackbar("Task deleted", "success");
      setButtonLoading(false);
    } catch (err) {
      setButtonLoading(false);
      handleSnackbar("Failed to deletete the task", "error");
      console.log("error deleting task", err);
    }
  };

  const formatDeadlineForUi = (deadline: any) => {
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);

    // Check if the deadline is today
    if (
      deadlineDate.getDate() === currentDate.getDate() &&
      deadlineDate.getMonth() === currentDate.getMonth() &&
      deadlineDate.getFullYear() === currentDate.getFullYear()
    ) {
      return `Today ${deadlineDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    // Check if the deadline is tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(currentDate.getDate() + 1);
    if (
      deadlineDate.getDate() === tomorrow.getDate() &&
      deadlineDate.getMonth() === tomorrow.getMonth() &&
      deadlineDate.getFullYear() === tomorrow.getFullYear()
    ) {
      return `Tomorrow ${deadlineDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    // Check if the deadline is within one week
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(currentDate.getDate() + 7);
    if (deadlineDate > currentDate && deadlineDate <= oneWeekFromNow) {
      return `${deadlineDate.toLocaleDateString("en-US", {
        weekday: "long",
      })} ${deadlineDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    // Deadline is not within this week
    return `${deadlineDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    })}, ${deadlineDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const handleFilterChange = (filters: any) => {
    fetchAllTasks(filters);
  };

  const closeTaskFormFn = () => {
    setAddTask(false);
  };

  const toRender = () => {
    // setFlag((!flag));
  };

  const handleNewTaskAdded = (newTask: Task) => {
    setAllTasks((prevTasks) => [...prevTasks, newTask]);
    setSelectedStatusMap((prevMap) => ({
      ...prevMap,
      [newTask.id]: newTask.taskStatus.taskStatusName,
    }));
  };

  // State variable to track hovered task ID
  const [hoveredTaskId, setHoveredTaskId] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);

  // Function to handle task card hover
  const handleTaskCardHover = (taskId: any) => {
    setHoveredTaskId(taskId);
  };

  // Function to handle task card unhover
  const handleTaskCardUnhover = () => {
    setHoveredTaskId(null);
    setOpenPopOfThreeDots(false);
    //to cancel the popover of the delete
    setDeletePopoverAnchor(null);
    setDeletingTaskId(null);
  };

  // console.log("hoveredTaskId", hoveredTaskId);

  const [openPopOfThreeDots, setOpenPopOfThreeDots] = useState(false);
  const [anchorElOfThreeDots, setAnchorElOfThreeDots] = useState(null);
  const [editTaskId, setEditTaskId] = useState<Tasks | null>(null);

  // Function to toggle Popper and set anchor element
  const handleToggleToShowThreeDots = (taskId: any, event: any) => {
    setOpenPopOfThreeDots(openPopOfThreeDots === taskId ? null : taskId);
    setAnchorElOfThreeDots(event.currentTarget);
  };

  const handleEditTaskNew = (task: Tasks) => {
    setOpenPopOfThreeDots(false);
    setAnchorElOfThreeDots(null);
    setEditTaskId(task);
  };

  const closeTaskFormEdit = () => {
    setEditTaskId(null);
  };

  const submitTaskFormEdit = () => {
    setEditTaskId(null);
    // fetchAllTasks();
  };

  const [taskToEdit, setTaskToEdit] = useState<Tasks | null>(null); // State to hold task to edit
  const [openModal, setOpenModal] = useState(false); // State variable for the modal

  // Function to handle opening the modal
  const handleOpenTaskForm = (task: Tasks) => {
    setTaskToEdit(task);
    setOpenPopOfThreeDots(false);
    setHoveredTaskId(null);
    setOpenModal(true);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Group tasks by their created date
  const groupedTasksByDate: { [key: string]: Task[] } = {};

  allTasks.forEach((task) => {
    const date = formattedCurrentDate(task.createdDate);
    if (!groupedTasksByDate[date]) {
      groupedTasksByDate[date] = [task];
    } else {
      groupedTasksByDate[date].push(task);
    }
  });

  const [showBackToMail, setShowBackToMail] = useState(false);

  useEffect(() => {
    setShowBackToMail(commingFromPrevComponent);
  }, [commingFromPrevComponent]);

  // header date picker(scroll)
  const [headerDateTimePickerValue, setHeaderDateTimePickerValue] =
    useState<dayjs.Dayjs | null>(null);

  // all those states are create by vijendra
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(allTasks);
  const [showAllTasks, setShowAllTasks] = useState<boolean>(false);
  const [isDateSelected, setIsdateSelected] = useState<boolean>(false);
  const [visibility, setVisibility] = useState<boolean>(false);
  // Inside this use effect I need to change something done by vijendra
  // whenever date is change in needs to scroll to that date
  useEffect(() => {
    if (headerDateTimePickerValue && !showAllTasks) {
      const selectedDateFormat = dayjs(
        headerDateTimePickerValue.toDate()
      ).format("ddd, MMM DD, YYYY");
      const dateString = Object.keys(groupedTasksByDate).find(
        (date) => date === selectedDateFormat
      );

      if (dateString) {
        setFilteredTasks(groupedTasksByDate[dateString] || []);
      } else {
        setFilteredTasks([]);
      }
    } else {
      setFilteredTasks(allTasks);
    }
  }, [headerDateTimePickerValue, showAllTasks, filteredTasks]);

  const handleShowAllTasks = () => {
    setShowAllTasks(true);
    setVisibility(true);
  };
  const handleHideAllTasks = () => {
    setShowAllTasks(true);
    setVisibility(false);
  };

  // Function to convert date strings to JavaScript Date objects
  const toDate = (dateString: string) => {
    const parts = dateString.split(" ");
    const months: { [key: string]: number } = {
      // Explicitly specify the type
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };
    const monthAbbreviation = parts[1];
    const month = months[monthAbbreviation]; // Get the corresponding number value for the month
    const day = parseInt(parts[2]);
    const year = parseInt(parts[3]);
    return new Date(year, month, day);
  };

  // to sort dates and display
  const sortedDates = Object.keys(groupedTasksByDate).sort((a, b) => {
    const dateA = toDate(a);
    const dateB = toDate(b);
    // Explicitly cast to number to satisfy TypeScript's type checking
    return Number(dateB) - Number(dateA);
  });

  //nudges
  const [showNudge, setShowNudge] = useState(false);
  const [hasShownToday, setHasShownToday] = useState(
    localStorage.getItem("nudgeShownToday") == "true"
  );

  useEffect(() => {
    if (showNudge) {
      window_send_message("parent", "show_nudge_yesterday_report");
    }
  }, [showNudge]);

  useEffect(() => {
    const currentTime = new Date();
    const triggerTime = new Date();
    triggerTime.setHours(9, 0, 0, 0); // Set to 9 AM

    // Check if it's past 9 AM and the nudge hasn't been shown today
    if (currentTime >= triggerTime && !hasShownToday) {
      setShowNudge(true);
      setHasShownToday(true);
      localStorage.setItem("nudgeShownToday", "true"); // Mark as shown today
    }

    // Reset the flag at midnight
    const resetTime = new Date();
    resetTime.setHours(24, 0, 0, 0); // Midnight
    const timeoutId = setTimeout(() => {
      setHasShownToday(false);
      localStorage.removeItem("nudgeShownToday");
    }, resetTime.getTime() - currentTime.getTime());

    // Cleanup function to clear the timeout if the component unmounts before midnight
    return () => clearTimeout(timeoutId);
  }, [hasShownToday]);

  const handleCustomClose = () => {
    console.log("Custom close handler");
    setShowNudge(!showNudge);
  };

  const handleCustomButton1Click = () => {
    setShowNudge(!showNudge);
    setOpenCatchUpAddedMails(true);
  };

  const handleCustomButton2Click = () => {
    console.log("Custom button 2 click handler");
    setShowNudge(!showNudge);
  };

  function setFetchedTasks(value: any) {
    setAllTasks(value);
  }

  return (
    <div className="landingOuterDiv">
      <CustomizedSnackbar
        open={snackbarOpen}
        handleClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />

      {showNudge && (
        <div className="nudgesDivLP">
          <Nudges
            imageSrc={YESTERDAYREPORT}
            width="200px"
            titleName="Yesterday’s report"
            button1="catchup"
            button2="Tasks"
            descrip="You have added:"
            totalTasks="5"
            totalCatchups="2"
            onClose={handleCustomClose}
            showNudgesTip={false}
            onButton1Click={handleCustomButton1Click}
            onButton2Click={handleCustomButton2Click}
          />
        </div>
      )}

      {!showBackToMail && (
        <Tooltip title="Back to mail">
          <div className="backToHome" onClick={onGoToPreviousPage}>
            <img src={BACKTOMAIL} alt="" />
          </div>
        </Tooltip>
      )}

      {openCatchUpAddedMails ? (
        <CatchupMails
          handleBackToLP={handleBackToLP}
          showBackToMail={showBackToMail}
        />
      ) : taskForm ? (
        <TaskForm onCancel={handleCancel} />
      ) : (
        <>
          {filtersShow ? (
            <TaskFilters onFilterChange={handleFilterChange} />
          ) : (
            <div className="fisstTopOuterDiv" id="newTaskFormScroll">
              <div className="firstDivInnerButtonDiv">
                <button
                  className="firstButton firstUnique"
                  onClick={showFilters}
                >
                  <img src={BLUETASK} alt="" />
                  <p>Total Tasks</p>
                  <p>{allTasks?.length + fetchedCompletedTasks?.length}</p>
                  <p>Added</p>
                </button>

                <button
                  className="firstButton secondUnique"
                  onClick={openCatchupTab}
                >
                  <img src={BLUECATCHUP} alt="" />
                  <p>Catch Up Later</p>
                  <p>{catchupEmailCount}</p>
                  <p>mails</p>
                </button>
              </div>
              <div>
                {!addTask && (
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    mt={"1.3rem"}
                    borderRadius={"5px"}
                    mb={"0.5rem"}
                  >
                    <Tooltip title="Add Task">
                      <div onClick={handleAdd} className="add_task_button">
                        <img src={ADDTASKFLOAT} alt="" />
                      </div>
                    </Tooltip>
                  </Box>
                )}
              </div>
              <div id="newTaskFormScroll">
                {addTask && (
                  <div style={{ marginRight: "4px", marginLeft: "-5px" }}>
                    <NewTaskForm
                      closeTaskForm={closeTaskFormFn}
                      toRender={toRender}
                      handleNewTaskAdded={handleNewTaskAdded}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          {filtersShow && (
            <div className="pocketOuter">
              <Tooltip title="back">
                <button
                  onClick={() => setFiltersShow(false)}
                  className="backButton"
                >
                  <img src={BACKIMG} alt="" />
                </button>
              </Tooltip>
            </div>
          )}

          {
            //1
            loading ? (
              <>
                <Skeleton
                  animation="wave"
                  width={280}
                  height={170}
                  style={{ marginLeft: "10px" }}
                />
                <Skeleton
                  animation="wave"
                  width={280}
                  height={170}
                  style={{ marginLeft: "10px", marginTop: "-30px" }}
                />
                <Skeleton
                  animation="wave"
                  width={280}
                  height={170}
                  style={{ marginLeft: "10px", marginTop: "-30px" }}
                />
              </>
            ) : (
              <>
                <div>
                  {allTasks?.length > 0 && (
                    <div className="showCalendarAtTop">
                      {/* inside this also I am  addign new states ---vijendra */}
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div className="datePickerWithButton">
                          <div className="parent_for_calender">
                            <DatePicker
                              //     className={`${styles["muiDateCalendar-root"]}
                              // ${styles["css-1q04gal-MuiDateCalendar-root"]}
                              // `}
                              value={headerDateTimePickerValue}
                              onChange={(newValue: any) => {
                                setHeaderDateTimePickerValue(newValue);
                                setShowAllTasks(false);
                                setIsdateSelected(!isDateSelected);
                              }}
                              format="DD MMMM, YYYY"
                              sx={{
                                fieldset: {
                                  borderColor: "transparent",
                                  borderTopWidth: 1,
                                  borderRightWidth: 1,
                                  borderBottomWidth: 1,
                                  borderLeftWidth: 1,
                                },
                                "&:hover": {
                                  fieldset: { borderColor: "transparent" },
                                  ".MuiOutlinedInput-notchedOutline": {
                                    borderColor: "transparent",
                                    border: "none",
                                  },
                                },
                                "& input::placeholder": {
                                  textColor: "#2196f3",
                                  fontSize: 14,
                                },
                                input: {
                                  color: "grey",
                                  fontSize: 11,
                                  textAlign: "left",
                                  fontWeight: "600",
                                  position: "relative",
                                  left: "14px",
                                  display: isDateSelected ? "block" : "none",
                                },
                                "& .MuiIconButton-root": {
                                  display: isDateSelected ? "none" : "block",
                                  border: "none",
                                  outline: "none",
                                  "&:focus, &:hover, &:active": {
                                    border: "none",
                                    outline: "none",
                                  },
                                },
                                "& .MuiInputBase-root": {
                                  height: 30,
                                  gap: "8px",
                                  flexDirection: { flexDirection: "row" },
                                },
                              }}
                              slotProps={{
                                textField: {
                                  size: "medium",
                                  fullWidth: true,
                                  required: false,
                                  autoFocus: false,
                                  error: false,
                                },
                                openPickerIcon: {
                                  component: () => (
                                    <img
                                      width="20px"
                                      height="20px"
                                      src={CALENDARSVG}
                                      style={{
                                        display: isDateSelected
                                          ? "none"
                                          : "block",
                                        border: "none",
                                        outline: "none",
                                      }}
                                    />
                                  ),
                                },
                              }}
                            />

                            <button
                              className="close_btn_for_date"
                              onClick={() => {
                                setIsdateSelected(!isDateSelected);
                              }}
                            >
                              X
                            </button>

                            <p
                              className="calenderIcon"
                              style={{
                                display: isDateSelected ? "block" : "none",
                              }}
                            >
                              <MdOutlineCalendarMonth />
                            </p>
                          </div>
                          <button
                            onClick={handleShowAllTasks}
                            className={
                              visibility
                                ? "circularButtonSecond"
                                : "circularButton"
                            }
                          >
                            <GrTask />
                          </button>

                          <button
                            onClick={handleHideAllTasks}
                            className={
                              visibility ? "secondBtnHide" : "secondBtn"
                            }
                          >
                            <PiSquaresFourBold />
                          </button>
                          <p
                            style={{
                              display: isDateSelected ? "block" : "none",
                            }}
                            className="borderDate"
                          ></p>
                        </div>
                      </LocalizationProvider>
                    </div>
                  )}

                  {sortedDates.length > 0 ? (
                    visibility ? (
                      <div>
                        {sortedDates.map((date) => (
                          <div
                            key={date}
                            id={`date-${date.replace(/ /g, "-")}`}
                          >
                            {isDateSelected ? null : (
                              <div className="createdDateShowList">{date}</div>
                            )}
                            {/* {additing some things heree by vijendra} */}

                            {groupedTasksByDate[date].map((ele) => (
                              <div key={ele.id}>
                                <div
                                  className={`taskOuterDivList`}
                                  key={ele.id}
                                  onMouseEnter={() => {
                                    handleTaskCardHover(ele.id);
                                  }}
                                  onMouseLeave={handleTaskCardUnhover}
                                >
                                  {editTaskId?.id == ele.id ? (
                                    <NewTaskEdit
                                      task={editTaskId}
                                      closeTaskFormEdit={closeTaskFormEdit}
                                      submitTaskFormEdit={submitTaskFormEdit}
                                      setFetchedTasks={setFetchedTasks}
                                    />
                                  ) : (
                                    <>
                                      {/* firstInnerDiv */}
                                      <div className="firstInnerDivLP">
                                        <div className="tasksParent">
                                          <Checkbox
                                            color="success"
                                            size="small"
                                            onClick={() =>
                                              handleCheckBox(ele.id)
                                            }
                                          />

                                          <div>{ele.title}</div>
                                        </div>

                                        {hoveredTaskId === ele.id && (
                                          <>
                                            <div
                                              className={`ThreeDotsDivvList ${styles.threeDotsDivLP}`}
                                              onClick={(event) =>
                                                handleToggleToShowThreeDots(
                                                  ele.id,
                                                  event
                                                )
                                              }
                                            >
                                              <img src={THREEDOT} alt="" />
                                            </div>

                                            {openPopOfThreeDots && (
                                              <Popper
                                                open={openPopOfThreeDots}
                                                anchorEl={anchorElOfThreeDots}
                                                placement="left-start"
                                              >
                                                <Paper>
                                                  <MenuList>
                                                    <MenuItem
                                                      className="MenuListOfThreeDots"
                                                      onClick={() =>
                                                        handleEditTaskNew(ele)
                                                      }
                                                    >
                                                      <img
                                                        src={editSvg}
                                                        className="PopperImage"
                                                        alt=""
                                                      />{" "}
                                                      Edit
                                                    </MenuItem>
                                                    <MenuItem
                                                      className="MenuListOfThreeDots"
                                                      onClick={() =>
                                                        handleOpenTaskForm(ele)
                                                      }
                                                    >
                                                      <img
                                                        src={OPENFORM}
                                                        className="PopperImage"
                                                        alt=""
                                                      />
                                                      Open Form
                                                    </MenuItem>
                                                    <MenuItem
                                                      className="MenuListOfThreeDots DeleteMenulistDiv"
                                                      onClick={handleOpenDeletePopover(
                                                        ele.id
                                                      )}
                                                    >
                                                      <img
                                                        src={deleteSvg}
                                                        className="PopperImage"
                                                        alt=""
                                                      />{" "}
                                                      Delete
                                                    </MenuItem>
                                                  </MenuList>
                                                </Paper>
                                              </Popper>
                                            )}
                                            {/* popover for delete */}
                                            <Popover
                                              open={Boolean(
                                                deletePopoverAnchor
                                              )}
                                              anchorEl={deletePopoverAnchor}
                                              onClose={handleCloseDeletePopover}
                                              anchorOrigin={{
                                                vertical: "bottom",
                                                horizontal: "right",
                                              }}
                                              transformOrigin={{
                                                vertical: "top",
                                                horizontal: "right",
                                              }}
                                              PaperProps={{
                                                style: {
                                                  boxShadow:
                                                    "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                                },
                                              }}
                                            >
                                              <Box
                                                p={2}
                                                className="outerBoxOfDelete"
                                              >
                                                <Typography>
                                                  Confirm task deletion?
                                                </Typography>
                                                <Box className="cancelTaskDiv">
                                                  <button
                                                    onClick={
                                                      handleCloseDeletePopover
                                                    }
                                                    className="cancelButton"
                                                  >
                                                    Cancel
                                                  </button>
                                                  <button
                                                    className="deleteButton"
                                                    onClick={
                                                      handleConfirmDelete
                                                    }
                                                    disabled={buttonLoading}
                                                  >
                                                    {buttonLoading ? (
                                                      <CircularProgress
                                                        size={20}
                                                        style={{
                                                          color: "white",
                                                          marginTop: "2px",
                                                        }}
                                                      />
                                                    ) : (
                                                      "Delete"
                                                    )}
                                                  </button>
                                                </Box>
                                              </Box>
                                            </Popover>
                                          </>
                                        )}

                                        {taskToEdit && (
                                          <Modal
                                            open={openModal}
                                            onClose={handleCloseModal}
                                            aria-labelledby="form-modal"
                                            aria-describedby="form-modal-description"
                                            closeAfterTransition
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              backgroundColor: "lightGrey",
                                            }}
                                            components={
                                              {
                                                // Backdrop: CustomBackdrop2,
                                              }
                                            }
                                          >
                                            <div style={{ width: "95%" }}>
                                              {/* {taskToEdit ? <TaskViewForm task={taskToEdit} onCancelView={handleCancelView} /> : <></>} */}
                                              {taskToEdit ? (
                                                <TaskEditForm
                                                  task={taskToEdit}
                                                  onCancelView={
                                                    handleCancelView
                                                  }
                                                />
                                              ) : (
                                                <></>
                                              )}
                                            </div>
                                          </Modal>
                                        )}
                                      </div>
                                      {ele.mailUrl && ele.description && (
                                        <div id="borderLineLPList"></div>
                                      )}
                                      {ele.mailUrl && ele.description ? (
                                        <Tooltip title="open this mail">
                                          <div
                                            className="mailSubjectDesc"
                                            style={{
                                              boxShadow: "none",
                                              backgroundColor:
                                                "rgb(252, 249, 249)",
                                              width: "96%",
                                              marginLeft: "0.7rem",
                                              marginTop: "-0.3rem",
                                            }}
                                            onClick={() =>
                                              openParticularMail(ele.mailUrl)
                                            }
                                          >
                                            <div>
                                              <img src={MAILIMG} alt="" />
                                            </div>
                                            <div>{ele.description}</div>
                                          </div>
                                        </Tooltip>
                                      ) : (
                                        ""
                                      )}
                                    </>
                                  )}
                                </div>
                                <div id="borderLineLPD"></div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : isDateSelected ? (
                      <div className="AllTasks">
                        {filteredTasks.map((ele) => (
                          <div
                            className={`taskOuterDiv`}
                            key={ele.id}
                            onMouseEnter={() => {
                              handleTaskCardHover(ele.id);
                            }}
                            onMouseLeave={handleTaskCardUnhover}
                          >
                            {editTaskId?.id == ele.id ? (
                              <NewTaskEdit
                                task={editTaskId}
                                closeTaskFormEdit={closeTaskFormEdit}
                                submitTaskFormEdit={submitTaskFormEdit}
                                setFetchedTasks={setFetchedTasks}
                              />
                            ) : (
                              <>
                                {/* firstInnerDiv */}
                                <div className="firstInnerDivLP">
                                  <div>{ele.title}</div>

                                  {hoveredTaskId === ele.id && (
                                    <>
                                      <div
                                        className={`ThreeDotsDivv ${styles.threeDotsDivLP}`}
                                        onClick={(event) =>
                                          handleToggleToShowThreeDots(
                                            ele.id,
                                            event
                                          )
                                        }
                                      >
                                        <img src={THREEDOT} alt="" />
                                      </div>

                                      {openPopOfThreeDots && (
                                        <Popper
                                          open={openPopOfThreeDots}
                                          anchorEl={anchorElOfThreeDots}
                                          placement="left-start"
                                        >
                                          <Paper>
                                            <MenuList>
                                              <MenuItem
                                                className="MenuListOfThreeDots"
                                                onClick={() =>
                                                  handleEditTaskNew(ele)
                                                }
                                              >
                                                <img
                                                  src={editSvg}
                                                  className="PopperImage"
                                                  alt=""
                                                />{" "}
                                                Edit
                                              </MenuItem>
                                              <MenuItem
                                                className="MenuListOfThreeDots"
                                                onClick={() =>
                                                  handleOpenTaskForm(ele)
                                                }
                                              >
                                                <img
                                                  src={OPENFORM}
                                                  className="PopperImage"
                                                  alt=""
                                                />
                                                Open Form
                                              </MenuItem>
                                              <MenuItem
                                                className="MenuListOfThreeDots DeleteMenulistDiv"
                                                onClick={handleOpenDeletePopover(
                                                  ele.id
                                                )}
                                              >
                                                <img
                                                  src={deleteSvg}
                                                  className="PopperImage"
                                                  alt=""
                                                />{" "}
                                                Delete
                                              </MenuItem>
                                            </MenuList>
                                          </Paper>
                                        </Popper>
                                      )}
                                      {/* popover for delete */}
                                      <Popover
                                        open={Boolean(deletePopoverAnchor)}
                                        anchorEl={deletePopoverAnchor}
                                        onClose={handleCloseDeletePopover}
                                        anchorOrigin={{
                                          vertical: "bottom",
                                          horizontal: "right",
                                        }}
                                        transformOrigin={{
                                          vertical: "top",
                                          horizontal: "right",
                                        }}
                                        PaperProps={{
                                          style: {
                                            boxShadow:
                                              "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                          },
                                        }}
                                      >
                                        <Box p={2} className="outerBoxOfDelete">
                                          <Typography>
                                            Confirm task deletion?
                                          </Typography>
                                          <Box className="cancelTaskDiv">
                                            <button
                                              onClick={handleCloseDeletePopover}
                                              className="cancelButton"
                                            >
                                              Cancel
                                            </button>
                                            <button
                                              className="deleteButton"
                                              onClick={handleConfirmDelete}
                                              disabled={buttonLoading}
                                            >
                                              {buttonLoading ? (
                                                <CircularProgress
                                                  size={20}
                                                  style={{
                                                    color: "white",
                                                    marginTop: "2px",
                                                  }}
                                                />
                                              ) : (
                                                "Delete"
                                              )}
                                            </button>
                                          </Box>
                                        </Box>
                                      </Popover>
                                    </>
                                  )}

                                  {taskToEdit && (
                                    <Modal
                                      open={openModal}
                                      onClose={handleCloseModal}
                                      aria-labelledby="form-modal"
                                      aria-describedby="form-modal-description"
                                      closeAfterTransition
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "lightGrey",
                                      }}
                                      components={
                                        {
                                          // Backdrop: CustomBackdrop2,
                                        }
                                      }
                                    >
                                      <div style={{ width: "95%" }}>
                                        {/* {taskToEdit ? <TaskViewForm task={taskToEdit} onCancelView={handleCancelView} /> : <></>} */}
                                        {taskToEdit ? (
                                          <TaskEditForm
                                            task={taskToEdit}
                                            onCancelView={handleCancelView}
                                          />
                                        ) : (
                                          <></>
                                        )}
                                      </div>
                                    </Modal>
                                  )}
                                </div>

                                <div className="secondInnerDivLP">
                                  <div className="secondInnerDivLP2">
                                    <Select
                                      className="selectTaskTypee"
                                      value={selectedStatusMap[ele.id]}
                                      onChange={(e) =>
                                        handleStatusChange(
                                          ele.id,
                                          e.target.value
                                        )
                                      }
                                      sx={{
                                        boxShadow: "none",
                                        ".MuiOutlinedInput-notchedOutline": {
                                          border: 0,
                                        },
                                        "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                                          {
                                            border: 0,
                                          },
                                        "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                                          {
                                            border: 0,
                                          },
                                        // border: '1px solid black',
                                        borderRadius: "4px",
                                      }}
                                      renderValue={
                                        (selected) =>
                                          selected === "Todo" ||
                                          selected === "TODO" ? (
                                            <span className="imageOfStatus">
                                              <img
                                                src={TODO}
                                                alt=""
                                                style={{
                                                  marginRight: "8px",
                                                }}
                                              />
                                              To-do
                                            </span>
                                          ) : selected === "inProgress" ||
                                            selected === "IN PROGRESS" ||
                                            selected === "In Progress" ? (
                                            <span className="imageOfStatus">
                                              <img
                                                src={INPROGRESS}
                                                alt=""
                                                style={{
                                                  marginRight: "8px",
                                                }}
                                              />
                                              In Progress
                                            </span>
                                          ) : selected === "completed" ||
                                            selected === "COMPLETED" ? (
                                            <span className="imageOfStatus">
                                              <img
                                                src={DONE}
                                                alt=""
                                                style={{
                                                  marginRight: "8px",
                                                }}
                                              />
                                              Completed
                                            </span>
                                          ) : (
                                            ""
                                          )
                                        //   <span className="imageOfStatus">
                                        //   <img src={TODO} alt="" style={{ marginRight: '8px' }} />To-do
                                        // </span>
                                      }
                                    >
                                      <MenuItem
                                        value="Todo"
                                        disabled
                                        className="MenuItem"
                                      >
                                        <img src={TODO} alt="" />
                                        To-do
                                      </MenuItem>
                                      <MenuItem
                                        value="inProgress"
                                        className="MenuItem"
                                      >
                                        <img src={INPROGRESS} alt="" />
                                        In Progress
                                      </MenuItem>
                                      <MenuItem
                                        value="completed"
                                        className="MenuItem"
                                      >
                                        <img src={DONE} alt="" /> Completed
                                      </MenuItem>
                                    </Select>
                                  </div>

                                  <div className="secondInnerDivLP1">
                                    {ele.deadline && (
                                      <>
                                        <img
                                          src={calendarRed}
                                          width={"16px"}
                                          alt=""
                                        />
                                        <span className="ThirdInnerDivTitle1">
                                          {formatDeadlineForUi(ele.deadline)}
                                        </span>
                                      </>
                                    )}
                                  </div>

                                  <div></div>
                                </div>

                                {ele.mailUrl && ele.description && (
                                  <div id="borderLineLP"></div>
                                )}

                                {ele.mailUrl && ele.description ? (
                                  <Tooltip title="open this mail">
                                    <div
                                      className="mailSubjectDesc"
                                      onClick={() =>
                                        openParticularMail(ele.mailUrl)
                                      }
                                    >
                                      <div>
                                        <img src={MAILIMG} alt="" />
                                      </div>
                                      <div>{ele.description}</div>
                                    </div>
                                  </Tooltip>
                                ) : (
                                  ""
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>
                        {sortedDates.map((date) => (
                          <div
                            key={date}
                            id={`date-${date.replace(/ /g, "-")}`}
                          >
                            {/* {additing some things heree by vijendra} */}
                            {isDateSelected ? null : (
                              <div className="createdDateShow">{date}</div>
                            )}

                            {groupedTasksByDate[date].map((ele) => (
                              <div className="AllTasks" key={ele.id}>
                                <div
                                  className={`taskOuterDiv`}
                                  key={ele.id}
                                  onMouseEnter={() => {
                                    handleTaskCardHover(ele.id);
                                  }}
                                  onMouseLeave={handleTaskCardUnhover}
                                >
                                  {editTaskId?.id == ele.id ? (
                                    <NewTaskEdit
                                      task={editTaskId}
                                      closeTaskFormEdit={closeTaskFormEdit}
                                      submitTaskFormEdit={submitTaskFormEdit}
                                      setFetchedTasks={setFetchedTasks}
                                    />
                                  ) : (
                                    <>
                                      {/* firstInnerDiv */}
                                      <div className="firstInnerDivLP">
                                        <div>{ele.title}</div>

                                        {hoveredTaskId === ele.id && (
                                          <>
                                            <div
                                              className={`ThreeDotsDivv ${styles.threeDotsDivLP}`}
                                              onClick={(event) =>
                                                handleToggleToShowThreeDots(
                                                  ele.id,
                                                  event
                                                )
                                              }
                                            >
                                              <img src={THREEDOT} alt="" />
                                            </div>

                                            {openPopOfThreeDots && (
                                              <Popper
                                                open={openPopOfThreeDots}
                                                anchorEl={anchorElOfThreeDots}
                                                placement="left-start"
                                              >
                                                <Paper>
                                                  <MenuList>
                                                    <MenuItem
                                                      className="MenuListOfThreeDots"
                                                      onClick={() =>
                                                        handleEditTaskNew(ele)
                                                      }
                                                    >
                                                      <img
                                                        src={editSvg}
                                                        className="PopperImage"
                                                        alt=""
                                                      />{" "}
                                                      Edit
                                                    </MenuItem>
                                                    <MenuItem
                                                      className="MenuListOfThreeDots"
                                                      onClick={() =>
                                                        handleOpenTaskForm(ele)
                                                      }
                                                    >
                                                      <img
                                                        src={OPENFORM}
                                                        className="PopperImage"
                                                        alt=""
                                                      />
                                                      Open Form
                                                    </MenuItem>
                                                    <MenuItem
                                                      className="MenuListOfThreeDots DeleteMenulistDiv"
                                                      onClick={handleOpenDeletePopover(
                                                        ele.id
                                                      )}
                                                    >
                                                      <img
                                                        src={deleteSvg}
                                                        className="PopperImage"
                                                        alt=""
                                                      />{" "}
                                                      Delete
                                                    </MenuItem>
                                                  </MenuList>
                                                </Paper>
                                              </Popper>
                                            )}
                                            {/* popover for delete */}
                                            <Popover
                                              open={Boolean(
                                                deletePopoverAnchor
                                              )}
                                              anchorEl={deletePopoverAnchor}
                                              onClose={handleCloseDeletePopover}
                                              anchorOrigin={{
                                                vertical: "bottom",
                                                horizontal: "right",
                                              }}
                                              transformOrigin={{
                                                vertical: "top",
                                                horizontal: "right",
                                              }}
                                              PaperProps={{
                                                style: {
                                                  boxShadow:
                                                    "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                                },
                                              }}
                                            >
                                              <Box
                                                p={2}
                                                className="outerBoxOfDelete"
                                              >
                                                <Typography>
                                                  Confirm task deletion?
                                                </Typography>
                                                <Box className="cancelTaskDiv">
                                                  <button
                                                    onClick={
                                                      handleCloseDeletePopover
                                                    }
                                                    className="cancelButton"
                                                  >
                                                    Cancel
                                                  </button>
                                                  <button
                                                    className="deleteButton"
                                                    onClick={
                                                      handleConfirmDelete
                                                    }
                                                    disabled={buttonLoading}
                                                  >
                                                    {buttonLoading ? (
                                                      <CircularProgress
                                                        size={20}
                                                        style={{
                                                          color: "white",
                                                          marginTop: "2px",
                                                        }}
                                                      />
                                                    ) : (
                                                      "Delete"
                                                    )}
                                                  </button>
                                                </Box>
                                              </Box>
                                            </Popover>
                                          </>
                                        )}

                                        {taskToEdit && (
                                          <Modal
                                            open={openModal}
                                            onClose={handleCloseModal}
                                            aria-labelledby="form-modal"
                                            aria-describedby="form-modal-description"
                                            closeAfterTransition
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              backgroundColor: "lightGrey",
                                            }}
                                            components={
                                              {
                                                // Backdrop: CustomBackdrop2,
                                              }
                                            }
                                          >
                                            <div style={{ width: "95%" }}>
                                              {/* {taskToEdit ? <TaskViewForm task={taskToEdit} onCancelView={handleCancelView} /> : <></>} */}
                                              {taskToEdit ? (
                                                <TaskEditForm
                                                  task={taskToEdit}
                                                  onCancelView={
                                                    handleCancelView
                                                  }
                                                />
                                              ) : (
                                                <></>
                                              )}
                                            </div>
                                          </Modal>
                                        )}
                                      </div>

                                      <div className="secondInnerDivLP">
                                        <div className="secondInnerDivLP2">
                                          <Select
                                            className="selectTaskTypee"
                                            value={selectedStatusMap[ele.id]}
                                            onChange={(e) =>
                                              handleStatusChange(
                                                ele.id,
                                                e.target.value
                                              )
                                            }
                                            sx={{
                                              boxShadow: "none",
                                              ".MuiOutlinedInput-notchedOutline":
                                                { border: 0 },
                                              "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                                                {
                                                  border: 0,
                                                },
                                              "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                                                {
                                                  border: 0,
                                                },
                                              // border: '1px solid black',
                                              borderRadius: "4px",
                                            }}
                                            renderValue={
                                              (selected) =>
                                                selected === "Todo" ||
                                                selected === "TODO" ? (
                                                  <span className="imageOfStatus">
                                                    <img
                                                      src={TODO}
                                                      alt=""
                                                      style={{
                                                        marginRight: "8px",
                                                      }}
                                                    />
                                                    To-do
                                                  </span>
                                                ) : selected === "inProgress" ||
                                                  selected === "IN PROGRESS" ||
                                                  selected === "In Progress" ? (
                                                  <span className="imageOfStatus">
                                                    <img
                                                      src={INPROGRESS}
                                                      alt=""
                                                      style={{
                                                        marginRight: "8px",
                                                      }}
                                                    />
                                                    In Progress
                                                  </span>
                                                ) : selected === "completed" ||
                                                  selected === "COMPLETED" ? (
                                                  <span className="imageOfStatus">
                                                    <img
                                                      src={DONE}
                                                      alt=""
                                                      style={{
                                                        marginRight: "8px",
                                                      }}
                                                    />
                                                    Completed
                                                  </span>
                                                ) : (
                                                  ""
                                                )
                                              //   <span className="imageOfStatus">
                                              //   <img src={TODO} alt="" style={{ marginRight: '8px' }} />To-do
                                              // </span>
                                            }
                                          >
                                            <MenuItem
                                              value="Todo"
                                              disabled
                                              className="MenuItem"
                                            >
                                              <img src={TODO} alt="" />
                                              To-do
                                            </MenuItem>
                                            <MenuItem
                                              value="inProgress"
                                              className="MenuItem"
                                            >
                                              <img src={INPROGRESS} alt="" />
                                              In Progress
                                            </MenuItem>
                                            <MenuItem
                                              value="completed"
                                              className="MenuItem"
                                            >
                                              <img src={DONE} alt="" />{" "}
                                              Completed
                                            </MenuItem>
                                          </Select>
                                        </div>

                                        <div className="secondInnerDivLP1">
                                          {ele.deadline && (
                                            <>
                                              <img
                                                src={calendarRed}
                                                width={"16px"}
                                                alt=""
                                              />
                                              <span className="ThirdInnerDivTitle1">
                                                {formatDeadlineForUi(
                                                  ele.deadline
                                                )}
                                              </span>
                                            </>
                                          )}
                                        </div>

                                        <div></div>
                                      </div>

                                      {ele.mailUrl && ele.description && (
                                        <div id="borderLineLP"></div>
                                      )}

                                      {ele.mailUrl && ele.description ? (
                                        <Tooltip title="open this mail">
                                          <div
                                            className="mailSubjectDesc"
                                            onClick={() =>
                                              openParticularMail(ele.mailUrl)
                                            }
                                          >
                                            <div>
                                              <img src={MAILIMG} alt="" />
                                            </div>
                                            <div>{ele.description}</div>
                                          </div>
                                        </Tooltip>
                                      ) : (
                                        ""
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    <div className="emptyMailsInLP">
                      <div>
                        <img src={TASKGIF} alt="" />
                        <div className="emptyMailsInLPInnerDiv">
                          <p>
                            It's a calm day on this page, no activity at the
                            moment.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* complerted tasks */}

                <div
                  className={showCompletedList ? "outerLPClicked" : "outerLP"}
                >
                  {
                    // fetchedCompletedTasks.length > 0 &&
                    <div className="completedDropDown">
                      <div className="middleLine"></div>
                      <div className="completedDivLP" onClick={handleCompltete}>
                        {clickedOnCompleted ? (
                          <img src={DROPDOWN} alt="" />
                        ) : (
                          <img src={DROPSIDE} alt="" />
                        )}
                        <p>completed ({fetchedCompletedTasks.length})</p>
                      </div>
                    </div>
                  }

                  {showCompletedList && (
                    <div id="iii">
                      {fetchedCompletedTasks?.map((ele) => (
                        <div key={ele.id}>
                          {/* added by Vijendra from  here  */}
                          {visibility ? (
                            <div key={ele.id}>
                              <div
                                className={`taskOuterDivList`}
                                key={ele.id}
                                onMouseEnter={() => {
                                  handleTaskCardHover(ele.id);
                                }}
                                onMouseLeave={handleTaskCardUnhover}
                              >
                                {editTaskId?.id == ele.id ? (
                                  <NewTaskEdit
                                    task={editTaskId}
                                    closeTaskFormEdit={closeTaskFormEdit}
                                    submitTaskFormEdit={submitTaskFormEdit}
                                    setFetchedTasks={setFetchedTasks}
                                  />
                                ) : (
                                  <>
                                    {/* firstInnerDiv */}
                                    <div className="firstInnerDivLP">
                                      <div className="tasksParent">
                                        <Checkbox
                                          color="success"
                                          size="small"
                                          checked
                                          onClick={() =>
                                            handleChangeToInProgress2(ele.id)
                                          }
                                        />

                                        <div>{ele.title}</div>
                                      </div>

                                      {hoveredTaskId === ele.id && (
                                        <>
                                          <div
                                            className={`ThreeDotsDivv ${styles.threeDotsDivLP}`}
                                            onClick={(event) =>
                                              handleToggleToShowThreeDots(
                                                ele.id,
                                                event
                                              )
                                            }
                                          >
                                            <img src={THREEDOT} alt="" />
                                          </div>

                                          {openPopOfThreeDots && (
                                            <Popper
                                              open={openPopOfThreeDots}
                                              anchorEl={anchorElOfThreeDots}
                                              placement="left-start"
                                            >
                                              <Paper>
                                                <MenuList>
                                                  <MenuItem
                                                    className="MenuListOfThreeDots"
                                                    onClick={() =>
                                                      handleEditTaskNew(ele)
                                                    }
                                                  >
                                                    <img
                                                      src={editSvg}
                                                      className="PopperImage"
                                                      alt=""
                                                    />{" "}
                                                    Edit
                                                  </MenuItem>
                                                  <MenuItem
                                                    className="MenuListOfThreeDots"
                                                    onClick={() =>
                                                      handleOpenTaskForm(ele)
                                                    }
                                                  >
                                                    <img
                                                      src={OPENFORM}
                                                      className="PopperImage"
                                                      alt=""
                                                    />
                                                    Open Form
                                                  </MenuItem>
                                                  <MenuItem
                                                    className="MenuListOfThreeDots DeleteMenulistDiv"
                                                    onClick={handleOpenDeletePopover(
                                                      ele.id
                                                    )}
                                                  >
                                                    <img
                                                      src={deleteSvg}
                                                      className="PopperImage"
                                                      alt=""
                                                    />{" "}
                                                    Delete
                                                  </MenuItem>
                                                </MenuList>
                                              </Paper>
                                            </Popper>
                                          )}
                                          {/* popover for delete */}
                                          <Popover
                                            open={Boolean(deletePopoverAnchor)}
                                            anchorEl={deletePopoverAnchor}
                                            onClose={handleCloseDeletePopover}
                                            anchorOrigin={{
                                              vertical: "bottom",
                                              horizontal: "right",
                                            }}
                                            transformOrigin={{
                                              vertical: "top",
                                              horizontal: "right",
                                            }}
                                            PaperProps={{
                                              style: {
                                                boxShadow:
                                                  "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                              },
                                            }}
                                          >
                                            <Box
                                              p={2}
                                              className="outerBoxOfDelete"
                                            >
                                              <Typography>
                                                Confirm task deletion?
                                              </Typography>
                                              <Box className="cancelTaskDiv">
                                                <button
                                                  onClick={
                                                    handleCloseDeletePopover
                                                  }
                                                  className="cancelButton"
                                                >
                                                  Cancel
                                                </button>
                                                <button
                                                  className="deleteButton"
                                                  onClick={handleConfirmDelete}
                                                  disabled={buttonLoading}
                                                >
                                                  {buttonLoading ? (
                                                    <CircularProgress
                                                      size={20}
                                                      style={{
                                                        color: "white",
                                                        marginTop: "2px",
                                                      }}
                                                    />
                                                  ) : (
                                                    "Delete"
                                                  )}
                                                </button>
                                              </Box>
                                            </Box>
                                          </Popover>
                                        </>
                                      )}

                                      {taskToEdit && (
                                        <Modal
                                          open={openModal}
                                          onClose={handleCloseModal}
                                          aria-labelledby="form-modal"
                                          aria-describedby="form-modal-description"
                                          closeAfterTransition
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: "lightGrey",
                                          }}
                                          components={
                                            {
                                              // Backdrop: CustomBackdrop2,
                                            }
                                          }
                                        >
                                          <div style={{ width: "95%" }}>
                                            {/* {taskToEdit ? <TaskViewForm task={taskToEdit} onCancelView={handleCancelView} /> : <></>} */}
                                            {taskToEdit ? (
                                              <TaskEditForm
                                                task={taskToEdit}
                                                onCancelView={handleCancelView}
                                              />
                                            ) : (
                                              <></>
                                            )}
                                          </div>
                                        </Modal>
                                      )}
                                    </div>
                                    {ele.mailUrl && ele.description && (
                                      <div id="borderLineLPList"></div>
                                    )}
                                    {ele.mailUrl && ele.description ? (
                                      <Tooltip title="open this mail">
                                        <div
                                          className="mailSubjectDesc"
                                          style={{
                                            boxShadow: "none",
                                            backgroundColor:
                                              "rgb(252, 249, 249)",
                                            width: "96%",
                                            marginLeft: "0.7rem",
                                            marginTop: "-0.3rem",
                                          }}
                                          onClick={() =>
                                            openParticularMail(ele.mailUrl)
                                          }
                                        >
                                          <div>
                                            <img src={MAILIMG} alt="" />
                                          </div>
                                          <div>{ele.description}</div>
                                        </div>
                                      </Tooltip>
                                    ) : (
                                      ""
                                    )}
                                  </>
                                )}
                              </div>
                              <div id="borderLineLPD"></div>
                            </div>
                          ) : (
                            <div
                              className={`taskOuterDiv`}
                              key={ele.id}
                              onMouseEnter={() => {
                                handleTaskCardHover(ele.id);
                              }}
                              onMouseLeave={handleTaskCardUnhover}
                            >
                              {editTaskId?.id == ele.id ? (
                                <NewTaskEdit
                                  task={editTaskId}
                                  closeTaskFormEdit={closeTaskFormEdit}
                                  submitTaskFormEdit={submitTaskFormEdit}
                                  setFetchedTasks={setFetchedTasks}
                                />
                              ) : (
                                <>
                                  {/* firstInnerDiv */}
                                  <div className="firstInnerDivLP">
                                    <div>{ele.title}</div>

                                    {hoveredTaskId === ele.id && (
                                      <>
                                        <div
                                          className={`ThreeDotsDiv ${styles.threeDotsDivLP}`}
                                          onClick={(event) =>
                                            handleToggleToShowThreeDots(
                                              ele.id,
                                              event
                                            )
                                          }
                                        >
                                          <img src={THREEDOT} alt="" />
                                        </div>

                                        {openPopOfThreeDots && (
                                          <Popper
                                            open={openPopOfThreeDots}
                                            anchorEl={anchorElOfThreeDots}
                                            placement="left-start"
                                          >
                                            <Paper>
                                              <MenuList>
                                                <MenuItem
                                                  className="MenuListOfThreeDots"
                                                  onClick={() =>
                                                    handleEditTaskNew(ele)
                                                  }
                                                >
                                                  <img
                                                    src={editSvg}
                                                    className="PopperImage"
                                                    alt=""
                                                  />{" "}
                                                  Edit
                                                </MenuItem>
                                                <MenuItem
                                                  className="MenuListOfThreeDots"
                                                  onClick={() =>
                                                    handleOpenTaskForm(ele)
                                                  }
                                                >
                                                  <img
                                                    src={OPENFORM}
                                                    className="PopperImage"
                                                    alt=""
                                                  />
                                                  Open Form
                                                </MenuItem>
                                                <MenuItem
                                                  className="MenuListOfThreeDots DeleteMenulistDiv"
                                                  onClick={handleOpenDeletePopover(
                                                    ele.id
                                                  )}
                                                >
                                                  <img
                                                    src={deleteSvg}
                                                    className="PopperImage"
                                                    alt=""
                                                  />{" "}
                                                  Delete
                                                </MenuItem>
                                              </MenuList>
                                            </Paper>
                                          </Popper>
                                        )}
                                        {/* popover for delete */}
                                        <Popover
                                          open={Boolean(deletePopoverAnchor)}
                                          anchorEl={deletePopoverAnchor}
                                          onClose={handleCloseDeletePopover}
                                          anchorOrigin={{
                                            vertical: "bottom",
                                            horizontal: "right",
                                          }}
                                          transformOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                          }}
                                          PaperProps={{
                                            style: {
                                              boxShadow:
                                                "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                            },
                                          }}
                                        >
                                          <Box
                                            p={2}
                                            className="outerBoxOfDelete"
                                          >
                                            <Typography>
                                              Confirm task deletion?
                                            </Typography>
                                            <Box className="cancelTaskDiv">
                                              <button
                                                onClick={
                                                  handleCloseDeletePopover
                                                }
                                                className="cancelButton"
                                              >
                                                Cancel
                                              </button>
                                              <button
                                                className="deleteButton"
                                                onClick={handleConfirmDelete}
                                                disabled={buttonLoading}
                                              >
                                                {buttonLoading ? (
                                                  <CircularProgress
                                                    size={20}
                                                    style={{
                                                      color: "white",
                                                      marginTop: "2px",
                                                    }}
                                                  />
                                                ) : (
                                                  "Delete"
                                                )}
                                              </button>
                                            </Box>
                                          </Box>
                                        </Popover>
                                      </>
                                    )}

                                    {taskToEdit && (
                                      <Modal
                                        open={openModal}
                                        onClose={handleCloseModal}
                                        aria-labelledby="form-modal"
                                        aria-describedby="form-modal-description"
                                        closeAfterTransition
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          backgroundColor: "lightGrey",
                                        }}
                                        components={
                                          {
                                            // Backdrop: CustomBackdrop2,
                                          }
                                        }
                                      >
                                        <div style={{ width: "95%" }}>
                                          {/* {taskToEdit ? <TaskViewForm task={taskToEdit} onCancelView={handleCancelView} /> : <></>} */}
                                          {taskToEdit ? (
                                            <TaskEditForm
                                              task={taskToEdit}
                                              onCancelView={handleCancelView}
                                            />
                                          ) : (
                                            <></>
                                          )}
                                        </div>
                                      </Modal>
                                    )}
                                  </div>

                                  <div className="secondInnerDivLP">
                                    <div className="secondInnerDivLP2">
                                      <Select
                                        className="selectTaskTypee"
                                        value={selectedStatusMap2[ele.id]}
                                        onChange={(e) =>
                                          handleStatusChange2(
                                            ele.id,
                                            e.target.value
                                          )
                                        }
                                        sx={{
                                          boxShadow: "none",
                                          ".MuiOutlinedInput-notchedOutline": {
                                            border: 0,
                                          },
                                          "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                                            {
                                              border: 0,
                                            },
                                          "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                                            {
                                              border: 0,
                                            },
                                          // border: '1px solid black',
                                          borderRadius: "4px",
                                        }}
                                        renderValue={(selected) =>
                                          selected === "Todo" ||
                                          selected === "TODO" ? (
                                            <span className="imageOfStatus">
                                              <img
                                                src={TODO}
                                                alt=""
                                                style={{ marginRight: "8px" }}
                                              />
                                              To-do
                                            </span>
                                          ) : selected === "inProgress" ||
                                            selected === "IN PROGRESS" ||
                                            selected === "In Progress" ? (
                                            <span className="imageOfStatus">
                                              <img
                                                src={INPROGRESS}
                                                alt=""
                                                style={{ marginRight: "8px" }}
                                              />
                                              In Progress
                                            </span>
                                          ) : selected === "completed" ||
                                            selected === "COMPLETED" ? (
                                            <span className="imageOfStatus">
                                              <img
                                                src={DONE}
                                                alt=""
                                                style={{ marginRight: "8px" }}
                                              />
                                              Completed
                                            </span>
                                          ) : (
                                            <span className="imageOfStatus">
                                              <img
                                                src={DONE}
                                                alt=""
                                                style={{ marginRight: "8px" }}
                                              />
                                              Completed
                                            </span>
                                          )
                                        }
                                      >
                                        <MenuItem
                                          value="Todo"
                                          disabled
                                          className="MenuItem"
                                        >
                                          <img src={TODO} alt="" />
                                          To-do
                                        </MenuItem>
                                        <MenuItem
                                          value="inProgress"
                                          className="MenuItem"
                                        >
                                          <img src={INPROGRESS} alt="" />
                                          In Progress
                                        </MenuItem>
                                        <MenuItem
                                          value="completed"
                                          className="MenuItem"
                                        >
                                          <img src={DONE} alt="" /> Completed
                                        </MenuItem>
                                      </Select>
                                    </div>

                                    <div className="secondInnerDivLP1">
                                      {ele.deadline && (
                                        <>
                                          <img
                                            src={calendarRed}
                                            width={"16px"}
                                            alt=""
                                          />
                                          <span className="ThirdInnerDivTitle1">
                                            {formatDeadlineForUi(ele.deadline)}
                                          </span>
                                        </>
                                      )}
                                    </div>

                                    <div></div>
                                  </div>

                                  {ele.mailUrl && ele.description && (
                                    <div id="borderLineLP"></div>
                                  )}

                                  {ele.mailUrl && ele.description ? (
                                    <Tooltip title="open this mail">
                                      <div
                                        className="mailSubjectDesc"
                                        onClick={() =>
                                          openParticularMail(ele.mailUrl)
                                        }
                                      >
                                        <div>
                                          <img src={MAILIMG} alt="" />
                                        </div>
                                        <div>{ele.description}</div>
                                      </div>
                                    </Tooltip>
                                  ) : (
                                    ""
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )
          }
        </>
      )}
    </div>
  );
};

export default LandingPage;
