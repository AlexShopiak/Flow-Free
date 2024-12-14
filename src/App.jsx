import "./App.css";
import Board from "./components/Board.jsx";
import Timer from "./components/Timer.jsx";

const App = () => {
  
  return (
    <div className="appStyle">
      <div>
        <Timer/>
        <Board/>
      </div>
    </div>
  );
}

export default App;
