import React, { useEffect, useRef, useState } from "react";
import { Stack } from "react-bootstrap";

export default function Countdown(props) {
  const [day, month, year] = props.date.split("/").map(Number);
  const date = new Date(year, month - 1, day);
  //const date = new Date(props.date);

  const [time, setTime] = useState(getTimeUntil(new Date(date)));

  const timer = useRef();

  useEffect(() => {
    timer.current = setInterval(() => {
      setTime(getTimeUntil(date));
    }, 1000);
    //console.log(props.date);
    return () => clearInterval(timer.current);
  }, [date]);

  useEffect(() => {
    if (
      time.days === 0 &&
      time.hours === 0 &&
      time.minutes === 0 &&
      time.seconds === 0
    ) {
      clearInterval(timer.current);
    }
  }, [time]);

  function getTimeUntil(date) {
    const UTCnow = new Date();
    const localTime = UTCnow.getTime() - UTCnow.getTimezoneOffset() * 60000;
    const now = new Date(localTime);

    const diff = Math.max(date - now, 0); // difference in millisecs
    // const diff = date - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24)); // days
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  }

  const format = (time) => {
    let { days } = time;
    let { hours } = time;
    let { minutes } = time;
    if (days < 10) days = "0" + days;
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;

    return days + ":" + hours + ":" + minutes;
  };

  return (
    <div>
      {format(time).split(":")[0] != "NaN" ? (
        <Stack direction="horizontal" className="countdown" gap={3}>
          <div>
            <div className="digits">{format(time).split(":")[0]}</div>
            <p>Dagen</p>
          </div>
          <div className="vr" />
          <div>
            <div className="digits">{format(time).split(":")[1]}</div>
            <p className="">Uren</p>
          </div>
          <div className="vr" />
          <div>
            <div className="digits">{format(time).split(":")[2]}</div>
            <p>Minuten</p>
          </div>
        </Stack>
      ) : (
        "Calculating..."
      )}

      {/* <div>hour: {format(time).split(":")[1]}</div>
      <div>minutes: {format(time).split(":")[2]}</div> */}
    </div>
  );
}
