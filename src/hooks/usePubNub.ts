import { useState, useEffect } from "react";
import PubNub from "pubnub";

const { REACT_APP_PUB_KEY, REACT_APP_SUB_KEY } = process.env;
const CHANNEL = "msg";

interface Credential {
  id?: string;
  setId: (id: string) => void;
}

interface Messaging {
  messages: Message[];
  sendMessage: (txt: string) => void;
}

interface Message {
  publisher: string;
  message: string;
}

function usePubNub(): [Credential, Messaging] {
  const [userUuid, setUserUuid] = useState<string>();
  const [pubnub, setPubnub] = useState<PubNub>();
  const [msgList, setMsgList] = useState<Message[]>([]);

  useEffect(() => {
    if (!pubnub) return;

    const messageHandler = (msgEvent: PubNub.MessageEvent) => {
      const { publisher, message } = msgEvent;
      setMsgList((prevState) => [
        ...prevState,
        {
          publisher,
          message,
        },
      ]);
    };

    pubnub.addListener({
      message: messageHandler,
    });

    pubnub.subscribe({ channels: [CHANNEL] });

    return () => {
      pubnub.removeListener({ message: messageHandler });
    };
  }, [pubnub]);

  const sendMessage = (message: string) => {
    pubnub?.publish({
      channel: CHANNEL,
      message,
    });
  };

  const establishConnection = (uuid: string) => {
    if (!REACT_APP_PUB_KEY || !REACT_APP_SUB_KEY)
      throw new Error("Missing credential!!!");
    return new PubNub({
      publishKey: REACT_APP_PUB_KEY,
      subscribeKey: REACT_APP_SUB_KEY,
      uuid,
    });
  };

  useEffect(() => {
    if (userUuid) setPubnub(establishConnection(userUuid));
  }, [userUuid, setPubnub]);

  return [
    { id: userUuid, setId: setUserUuid },
    { messages: msgList, sendMessage },
  ];
}

export default usePubNub;
