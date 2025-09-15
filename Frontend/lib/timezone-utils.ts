// Sri Lanka timezone utilities
export const TIMEZONE = 'Asia/Colombo';

export const getSriLankaDate = () => {
  const now = new Date();
  const sriLankaTime = new Date(now.toLocaleString("en-US", {timeZone: TIMEZONE}));
  return sriLankaTime.toISOString().split('T')[0];
};

export const getSriLankaTime = () => {
  const now = new Date();
  const sriLankaTime = new Date(now.toLocaleString("en-US", {timeZone: TIMEZONE}));
  return sriLankaTime.toLocaleTimeString("en-GB", { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const getSriLankaDateTime = () => {
  const now = new Date();
  return new Date(now.toLocaleString("en-US", {timeZone: TIMEZONE}));
};

export const formatSriLankaDateTime = (date?: Date) => {
  const targetDate = date || getSriLankaDateTime();
  return targetDate.toLocaleString("en-US", {
    timeZone: TIMEZONE,
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const isTimeSlotPast = (timeSlot: string, selectedDate: string) => {
  const today = getSriLankaDate();
  if (selectedDate !== today) return false;
  
  const currentTime = getSriLankaTime();
  return timeSlot < currentTime;
};

export const getAvailableTimeSlots = (selectedDate: string) => {
  const timeSlots = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
  ];
  
  if (!selectedDate) return timeSlots;
  
  return timeSlots.filter(timeSlot => !isTimeSlotPast(timeSlot, selectedDate));
};