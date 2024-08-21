import { useState } from "react";
import { Clock } from "lucide-react";

interface ScheduleItem {
  time: string;
  endTime: string;
  title: string;
  color: string;
}

const ScheduleApp = () => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([
    { time: "06:00", endTime: "08:00", title: "Sleep", color: "bg-purple-200" },
    {
      time: "08:00",
      endTime: "09:00",
      title: "Meditate",
      color: "bg-yellow-200",
    },
    {
      time: "12:00",
      endTime: "13:00",
      title: "Nap Window",
      color: "bg-green-200",
    },
    { time: "12:00", endTime: "13:00", title: "Reading", color: "bg-blue-200" },
    { time: "12:00", endTime: "13:00", title: "Lunch", color: "bg-red-200" },
    {
      time: "20:00",
      endTime: "21:00",
      title: "Wind Down",
      color: "bg-purple-200",
    },
    { time: "21:00", endTime: "22:00", title: "Sleep", color: "bg-purple-200" },
  ]);

  const convertTo12HourFormat = (time: string) => {
    const [hour, minutes] = time.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const adjustedHour = hour % 12 || 12;
    return `${adjustedHour}:${String(minutes).padStart(2, "0")} ${ampm}`;
  };

  const startTime = schedule[0].time;
  const endTime = schedule[schedule.length - 1].endTime;
  const startHour = parseInt(startTime.split(":")[0]);
  const endHour = parseInt(endTime.split(":")[0]);

  const times = Array.from({ length: endHour - startHour }, (_, i) => {
    const hour = String(startHour + i).padStart(2, "0");
    return `${hour}:00`;
  });

  const getEventPosition = (event: ScheduleItem) => {
    const startHourMinutes =
      parseInt(event.time.split(":")[0]) * 60 +
      parseInt(event.time.split(":")[1]);
    const endHourMinutes =
      parseInt(event.endTime.split(":")[0]) * 60 +
      parseInt(event.endTime.split(":")[1]);
    const start = (startHourMinutes - startHour * 60) / 60;
    const duration = (endHourMinutes - startHourMinutes) / 60;
    return { start, duration };
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-black min-h-screen">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Schedule</h2>
        <Clock size={32} className="text-white" />
      </div>
      <div className="grid grid-cols-1 gap-1 relative">
        {times.map((time, index) => {
          const [hourString, minuteString] =
            convertTo12HourFormat(time).split(" ");
          return (
            <div key={time} className="flex items-start py-2 h-16">
              <div className="w-16 text-right pr-2 text-white flex flex-col items-end">
                <span>{hourString}</span>
                <span className="text-xs">{minuteString}</span>
              </div>
              <div className="flex-1 relative">
                {schedule
                  .filter((event) => {
                    const { start, duration } = getEventPosition(event);
                    return start <= index && start + duration > index;
                  })
                  .map((event, eventIndex) => {
                    const { start, duration } = getEventPosition(event);
                    const top = `${(start - index) * 64}px`;
                    const height = `${duration * 64}px`;
                    const width = `${
                      100 / schedule.filter((e) => e.time === event.time).length
                    }%`;
                    const left = `${eventIndex * parseFloat(width)}%`;
                    return (
                      <div
                        key={`${event.title}-${eventIndex}`}
                        className={`absolute p-2 rounded text-sm ${event.color} flex items-center justify-center text-center`}
                        style={{
                          top,
                          height,
                          width,
                          left,
                        }}
                      >
                        {event.title}
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ScheduleApp;
