/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const Modal = ({ restartGame }) => {
  const [render, setRender] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setRender(true);
    }, 1000);
  }, []);

  return (
    <div className="modalStyle" style={{ opacity: render ? 1 : 0}}>
        <div className="gameOverStyle"></div>
        <div className="tryAgainStyle" onClick={() => restartGame()}>Try Again</div>
    </div>
  );
}

export default Modal
