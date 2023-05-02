import { Container, Stack } from "react-bootstrap";

function Home() {
  return (
    <Container>
      <Stack direction="horizontal">
        <h1>Launch timeline</h1>
        <div className="ms-auto">vla vla</div>
      </Stack>
    </Container>
  );
}

export default Home;

// import React, { useEffect, useRef, useState } from "react";

// export default function Countdown({ countdownTimestamp }) {
//   const now = new Date();
//   const tomorrow = new Date(
//     now.getFullYear(),
//     now.getMonth(),
//     now.getDate() + 1
//   );
//   const timestampTomorrow = tomorrow.getTime();

//   const [countdown, setCountdown] = useState(0);

//   useEffect(() => {
//     const timerId = setInterval(() => {
//       updateRemainingTime(timestampTomorrow);
//     }, 1000);
//     return () => clearInterval(timerId);
//   }, [timestampTomorrow]);

//   function updateRemainingTime(time) {
//     console.log(time);
//   }

//   //   const format = (time) => {
//   //     // let days = Math.floor(time / (1000 * 60 * 60 * 24));
//   //     // let hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//   //     // let mins = Math.floor(time / 60);
//   //     // let secs = Math.floor(time - mins * 60);
//   //     // if (mins < 10) mins = "0" + mins;
//   //     // if (secs < 10) secs = "0" + secs;

//   //     // return days + "/" + hours + ":" + mins + ":" + secs;
//   //   };

//   function getTimeUntil(date) {
//     const now = new Date();
//     const diff = Math.max(date - now, 0); // get difference in milliseconds, never negative
//     const days = Math.floor(diff / (1000 * 60 * 60 * 24)); // convert milliseconds to days
//     const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // get remaining milliseconds after days, and convert to hours
//     const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)); // get remaining milliseconds after hours, and convert to minutes
//     return { days, hours, minutes };
//   }

//   return <div>Countdown: {getTimeUntil(timestampTomorrow)}</div>;
// }
