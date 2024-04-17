import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Halving() {
  const { t } = useTranslation();
  const [timerData, setTimerData] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const second = 1000,
      minute = second * 60,
      hour = minute * 60,
      day = hour * 24;
    const countDown = new Date("April 21, 2024 18:01:00 UTC").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDown - now;

      const days = Math.floor(distance / day);
      const hours = Math.floor((distance % day) / hour);
      const minutes = Math.floor((distance % hour) / minute);
      const seconds = Math.floor((distance % minute) / second);

      setTimerData({ days, hours, minutes, seconds });
    }, second);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="flex justify-start items-center font-semibold w-[300px]">
      {t("bitcoinHalving") + ": "}
      <h1 className="ml-2">
        {timerData.days +
          "D " +
          timerData.hours +
          "H " +
          timerData.minutes +
          "M " +
          timerData.seconds +
          "S"}
      </h1>
    </div>
  );
}
