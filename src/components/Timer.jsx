import { useState, useEffect } from "react";

const Timer = () => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      let newTime = time + 1;
      setTime(newTime);
    }, 1000);
  }, [time]);

  return (
    <div className="timerStyle">
      {/*"⏱️ " + time  TODO debug the timer*/}
    </div>
  );
}

export default Timer
