import React, { useEffect, useRef, useState } from "react";
import { Stack } from "react-bootstrap";

function Countdown(props) {
  const targetDate = parseDate(props.date);
  const [remainingTime, setRemainingTime] = useState(
    getRemainingTime(targetDate)
  );
  const timerRef = useRef();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setRemainingTime(getRemainingTime(targetDate));
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [targetDate]);

  useEffect(() => {
    const { days, hours, minutes, seconds } = remainingTime;
    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
      clearInterval(timerRef.current);
    }
  }, [timerRef.current]);

  function parseDate(dateString) {
    const [day, month, year] = dateString.split("/").map(Number);
    return new Date(year, month - 1, day);
  }

  function getRemainingTime(targetDate) {
    const now = new Date();
    const diff = Math.max(targetDate - now, 0);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  }

  function formatTime(time) {
    let { days, hours, minutes } = time;
    days = days < 10 ? "0" + days : days;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return `${days}:${hours}:${minutes}`;
  }

  const formattedTime = formatTime(remainingTime);

  const [daysPart, hoursPart, minutesPart] = formattedTime.split(":");

  return (
    <div>
      {Number.isNaN(Number(daysPart)) ? (
        "Calculating..."
      ) : (
        <Stack direction="horizontal" className="countdown" gap={3}>
          <div>
            <div className="digits">{daysPart}</div>
            <p>Dagen</p>
          </div>
          <div className="vr" />
          <div>
            <div className="digits">{hoursPart}</div>
            <p className="">Uren</p>
          </div>
          <div className="vr" />
          <div>
            <div className="digits">{minutesPart}</div>
            <p>Minuten</p>
          </div>
        </Stack>
      )}
    </div>
  );
}

export default React.memo(Countdown);
