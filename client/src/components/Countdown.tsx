import { useEffect, useState } from "react";
import { differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";

interface CountdownProps {
  targetDate: Date;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (now >= targetDate) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: differenceInDays(targetDate, now),
        hours: differenceInHours(targetDate, now) % 24,
        minutes: differenceInMinutes(targetDate, now) % 60
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="text-center px-4">
      <div className="text-4xl md:text-6xl font-serif text-white mb-2">{value}</div>
      <div className="text-sm uppercase tracking-wider text-white/60">{label}</div>
    </div>
  );

  return (
    <div className="flex justify-center items-center gap-8 py-12">
      <CountdownUnit value={timeLeft.days} label="Days" />
      <CountdownUnit value={timeLeft.hours} label="Hours" />
      <CountdownUnit value={timeLeft.minutes} label="Minutes" />
    </div>
  );
}
