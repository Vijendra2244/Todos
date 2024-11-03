import "../css/nudges.css";
import CLOSESVG from "../assets/Nudges/closeSvg.svg";
import { useEffect } from "react";
import INTRODUCE from "../assets/Nudges/YesterdayReport.svg";
import { window_send_message } from "@/store";

interface NudgesProps {
  imageSrc?: string;
  width?: string;
  height?: string;
  titleName?: string;
  descrip?: string;
  button1?: string;
  button2?: string;
  showNudgesTip?: boolean;
  totalCatchups?: any;
  totalTasks?: any;
  onClose?: () => void;
  onButton1Click?: () => void;
  onButton2Click?: () => void;
}


const Nudges: React.FC<NudgesProps> = ({
  imageSrc = `${INTRODUCE}`,
  width = "200px",
  titleName ="Yesterday’s report",
  descrip = "You have added:",
  button1 = "catchup",
  button2 = "Tasks",
  totalCatchups = "2",
  totalTasks = "5",
  showNudgesTip = true,
  onClose,
  onButton1Click,
  onButton2Click }) => {

// const Nudges: React.FC<NudgesProps> = ({
//   imageSrc = `${INTRODUCE}`,
//   width = "200px",
//   titleName = "Introducing Catchup Later",
//   descrip = "Never Miss Important Emails Again!",
//   button1 = "got it",
//   button2 = "click",
//   totalCatchups = "",
//   totalTasks = "",
//   showNudgesTip = true,
//   onClose,
//   onButton1Click,
//   onButton2Click }) => {

  useEffect(() => {
    console.log("message sent nudges");
    window_send_message("parent", "handle_nudges_page_iframe_ready");
  }, []);


  const handleCancelNudgesContainer = () => {
    if (onClose) {
      onClose();
    } else {
      window_send_message("parent", "handle_cancel_nudges_div");
    }
  }

  // const handleGotItButton = () => {
  //   window_send_message("parent", "handle_cancel_nudges_div");
  // }


  const handleButton1Click = () => {
    if (onButton1Click) {
      onButton1Click();
    } else {
      window_send_message("parent", "handle_cancel_nudges_div");
    }
  }

  const handleButton2Click = () => {
    if (onButton2Click) {
      onButton2Click();
    } else {

    }
  }

  return (
    <div className="nudgesContainer">
      <div className="nudgesOuterDiv" style={{ width }}>
        <div className="imageDiv">
          <img src={imageSrc} width={"100%"} height={"100%"} alt="" />
        </div>
        <div className="closeSvgDiv" onClick={handleCancelNudgesContainer}>
          <img src={CLOSESVG} alt="" />
        </div>
        <div className="titleName">
          {titleName}
        </div>
        <div className="desc">
          {descrip}
          {
            totalTasks && totalCatchups &&
            <div className="totalTasks">
              <div>
                <span className="spanTotoalTasks">{totalTasks}</span> tasks
              </div>
              <div>
                <span className="spanTotoalTasks">{totalCatchups}</span> catchup later
              </div>
            </div>
          }
        </div>
        <div className="buttonsDivNG">
          {button1 && (
            <button className="button1NG" onClick={handleButton1Click}>
              {button1}
            </button>
          )}
          {button2 && (
            <button className="button2NG" onClick={handleButton2Click}>
              {button2}
            </button>
          )}
        </div>
      </div>
      {showNudgesTip && <div className="nudgesTip"></div>}
    </div>
  );
};

export default Nudges;
