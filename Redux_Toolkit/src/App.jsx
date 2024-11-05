import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { decrement, increament } from "./Reducers/CounterSlice";
import { darkTheme, lighTheme } from "./Reducers/ThemeSlice";
import { useEffect } from "react";
import { fetchData } from "./Reducers/Products";

function App() {
  const count = useSelector((state) => state.counter.count);
  const theme = useSelector((state) => state.theme.theme);
  const data = useSelector((state) => state.fetch.data);

  const dispatch = useDispatch();
  console.log(theme);
  const toggleTheme = () => {
    if (theme === "DARKTHEME") {
      dispatch(lighTheme());
    } else {
      dispatch(darkTheme());
    }
  };
  useEffect(() => {
    // Apply background and color styles to the document body
    if (theme === "DARKTHEME") {
      document.body.style.backgroundColor = "#000000";
      document.body.style.color = "#FFFFFF";
    } else {
      document.body.style.backgroundColor = "#FFFFFF";
      document.body.style.color = "#000000";
    }
  }, [theme]);

  useEffect(()=>{
    dispatch(fetchData())
  },[])

  return (
    <>
      <p>{count}</p>
      <button onClick={() => dispatch(increament(3))}>+</button>
      <button onClick={() => dispatch(decrement(3))}>-</button>
      <button onClick={toggleTheme}>ToogleTheme</button>
      {data &&
        data.length > 0 &&
        data.map((item) => (
          <>
            <p>{item.title}</p>
          </>
        ))}
    </>
  );
}

export default App;
