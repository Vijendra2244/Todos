import React, { useReducer, useRef, useState } from "react";
// const initialState = { count: 0 };
// function reducer(state = { initialState }, action) {
//   switch (action.type) {
//     case "increament":
//       return { count: state.count + action.payload };
//     case "decreament":
//       return { count: state.count - action.payload };
//     case "reset":
//       return { count: 0 };
//     default:
//       console.log("Unmatched type");
//   }
// }

function App() {
  // const [state, dispatch] = useReducer(reducer, initialState);
  // const curr = useRef();
  // const handleFocus = () => {
  //   curr.current.focus();
  // };
  // const countRef = useRef(0);

  // const handleClick = () => {
  //   countRef.current += 1;
  //   console.log(`Current count: ${countRef.current}`);
  // };
  // const [val, setVal] = useState("");
  // const changeTheTemp = () => {
  //   const formula = (val * 9) / 5 + 32;
  //   setVal(formula);
  // };
  // const changeTheTemp1 = () => {
  //   const formula = ((val - 32) * 5) / 9;
  //   setVal(formula.toFixed(2));
  // };

  const [task, setTask] = useState(["one", "two"]);
  const [newTask, setNewTask] = useState("");

  const handleAddTask = () => {
    setTask([...task, newTask]);
    setNewTask("")
  };
  const handleRemove = (t) => {
    setTask(task.filter((item) => item !== t));
  };
  return (
    <>
      {/* <p>
        {state.count}
        <button onClick={() => dispatch({ type: "increament", payload: 5 })}>
          +
        </button>
        <button onClick={() => dispatch({ type: "decreament", payload: 3 })}>
          -
        </button>
        <button onClick={() => dispatch({ type: "reset" })}>Reset</button>

        <input ref={curr} type="text" name="" id="" />
        <button onClick={handleFocus}>focus</button>
        <div>
          <button onClick={handleClick}>Increment Count</button>
        </div>
      </p> */}
      {/* <input
        type="text"
        value={val}
        onChange={(e) => {
          if (isNaN(e.target.value)){
            alert("Please enter a vlid number")
          }
          setVal(e.target.value)
        }}
        placeholder="Enter the values"
      />
      <p>{val}</p>
      <button onClick={changeTheTemp}>Convert to Celcius</button>
      <button onClick={changeTheTemp1}>Convert to Fahrenheit</button> */}

      <input
        type="text"
        placeholder="Add task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button onClick={handleAddTask}>Add task</button>
      {task.map((item, id) => {
        return (
          <div
            key={id}
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "1rem",
              marginTop: "10px",
            }}
          >
            <li>{item}</li>
            <button onClick={() => handleRemove(item)}>Remove</button>
          </div>
        );
      })}
    </>
  );
}

export default App;

// function App() {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => setCount((c) => c + 1), 1000);
//     return () => clearInterval(interval);
//   }, []);

//   return <div>{count}</div>;
// }

// function App() {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     document.title = `Count: ${count}`;
//   });

//   return <button onClick={() => setCount(count + 1)}>Increment</button>;
// }
// function App() {
//   const [number, setNumber] = useState(0);

//   useEffect(() => {
//     setNumber(5);
//   }, [number]);
//   return <div>{number}</div>;
// }

// function App() {
//   const [text, setText] = useState("Hello");

//   useEffect(() => {
//     setTimeout(() => setText("React"), 2000);
//     console.log(text)
//   }, [text]);

//   return <div>{text}</div>;
// }
// function App() {
//   const [flag, setFlag] = useState(true);

//   return (
//     <>
//       {flag ? <div>True</div> : <div>False</div>}
//       <button onClick={() => setFlag(!flag)}>Toggle</button>
//     </>
//   );
// }
