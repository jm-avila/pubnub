import { useState, useEffect } from "react";
import PubNub from "pubnub";

const { REACT_APP_PUB_KEY, REACT_APP_SUB_KEY } = process.env;
const CHANNEL = "msg";

function usePubNub(): [string[], (txt: string) => void] {
  const setPubNub = () => {
    if (!REACT_APP_PUB_KEY || !REACT_APP_SUB_KEY)
      throw new Error("Missing credential!!!");
    return new PubNub({
      publishKey: REACT_APP_PUB_KEY,
      subscribeKey: REACT_APP_SUB_KEY,
    });
  };

  const [pubnub] = useState(setPubNub());
  const [msgList, setMsgList] = useState<string[]>([]);

  useEffect(() => {
    if (!pubnub) return;

    const messageHandler = (msg: PubNub.MessageEvent) => {
      setMsgList((prevState) => [...prevState, msg.message]);
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
    pubnub.publish({
      channel: CHANNEL,
      message,
    });
  };

  return [msgList, sendMessage];
}

export default usePubNub;
