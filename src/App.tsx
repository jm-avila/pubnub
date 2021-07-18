import React, { useState, useEffect } from "react";
import usePubNub from "./hooks/usePubNub";
import "./App.css";

function App() {
  const [validColors] = useState(["white", "red", "green", "blue"]);
  const [color, setColor] = useState(validColors[0]);

  const [inputValue, setInputValue] = useState("");
  const [credential, messaging] = usePubNub();
  const [users] = useState([
    { name: "User 1", id: "49d623c1-4ea7-41d4-af9c-8cbd89a6b043" },
    { name: "User 2", id: "4efead11-19b6-4f6b-8085-57f9454827ae" },
  ]);

  const onEventSendMessage = () => {
    messaging.sendMessage(inputValue);
    setInputValue("");
  };

  const findUserName = (userId: string) =>
    users.find(({ id }) => id === userId)?.name;

  useEffect(() => {
    const updateColor = (v: string) => {
      const newColor = validColors.find((c) => c === v);
      if (newColor) setColor(newColor);
    };

    if (messaging.messages.length)
      updateColor(messaging.messages[messaging.messages.length - 1].message);
  }, [messaging.messages, validColors, setColor]);
  
  return (
    <div className="App" style={{ backgroundColor: color }}>
      <div className="col"></div>
      <div className="col main">
        <div>
          <h1>PubNub</h1>
        </div>
        {!credential.id ? (
          <div>
            <select
              value={credential.id}
              onChange={(event) => credential.setId(event.target.value)}
            >
              <option>No User</option>
              {users.map(({ name, id }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <h3>{findUserName(credential.id)}</h3>
          </div>
        )}
        <div>
          <input
            onKeyDown={(event) => {
              if (event.code === "Enter" && !!inputValue && credential.id)
                onEventSendMessage();
            }}
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />
          <button
            onClick={onEventSendMessage}
            disabled={!inputValue || !credential.id}
          >
            Send
          </button>
        </div>
        <div>
          <h4>Messages:</h4>
          <ul>
            {messaging.messages.map(({ publisher, message }, i) => (
              <li key={i}>{`${findUserName(publisher)}: ${message}`}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="col"></div>
    </div>
  );
}

export default App;
