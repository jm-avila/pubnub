import React, { useState } from "react";
import usePubNub from "./hooks/usePubNub";
import "./App.css";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [msgList, sendMessage] = usePubNub();

  const onEventSendMessage = () => {
    sendMessage(inputValue);
    setInputValue("");
  };

  return (
    <div className="App">
      <div>
        <h1>PubNub</h1>
      </div>
      <div>
        <input
          onKeyDown={(event) => {
            if (event.code === "Enter") onEventSendMessage();
          }}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <button onClick={onEventSendMessage}>Send</button>
      </div>
      <div>
        <h4>Messages:</h4>
        <ul>
          {msgList.map((msg, i) => (
            <li key={i}>{`${i + 1}: ${msg}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
