import React, { useState, useEffect } from 'react';

const EventForm = ({ onAddEvent, selectedDate, timeInputRef }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [eventName, setEventName] = useState('');

  useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  }, [selectedDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (date && time && eventName) {
      onAddEvent(date, time, eventName);
      setDate('');
      setTime('');
      setEventName('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
        ref={timeInputRef}
      />
      <input
        type="text"
        placeholder="Event Name"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        required
      />
      <button type="submit">Add Event</button>
    </form>
  );
};

export default EventForm;
