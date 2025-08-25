import { useState, useEffect } from 'react';
import SmartImage from './smartImage';

export type Message = {
  _id: string;
  type: string;
  content: string;
  timeType: string;
  timeValue: Date | string; // string possible venant du socket
}

type MessageDisplayProps = {
  message: Message;
};

export default function MessageDisplay({ message }: MessageDisplayProps) {
  const [timeToDisplay, setTimeToDisplay] = useState<string>("");

  // Fonction safe qui accepte Date ou string
  function timeAgo(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    if (!(d instanceof Date) || isNaN(d.getTime())) return "date inconnue";

    const diffMs = Date.now() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return "A l'instant";
    if (diffMin < 60) return `Il y a ${diffMin} minute${diffMin > 1 ? "s" : ""}`;
    if (diffHour < 24) return `Il y a ${diffHour} heure${diffHour > 1 ? "s" : ""}`;
    return `Il y a ${diffDay} jour${diffDay > 1 ? "s" : ""}`;
  }

  useEffect(() => {
    if (!message.timeValue) return;
    const date = typeof message.timeValue === "string" ? new Date(message.timeValue) : message.timeValue;
    const updateTime = () => setTimeToDisplay(timeAgo(date));
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, [message]);

  return (
    <div className='single-message'>
      <p className='single-message-time'>{"> " + timeToDisplay}</p>
      <p className='single-message-content' dangerouslySetInnerHTML={{ __html: message.content }}></p>
    </div>
  );
}
