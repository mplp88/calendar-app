import React, { useState } from 'react';

const EventForm = ({ onAddEvent }) => {
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventName, setEventName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!eventDate || !eventTime || !eventName) {
      alert('Por favor, ingrese una fecha, hora y un nombre para el evento.');
      return;
    }

    const selectedDate = new Date(`${eventDate}T${eventTime}`);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset hours to compare only dates

    if (selectedDate < today) {
      alert('No puede agregar eventos anteriores a la fecha de hoy.');
      return;
    }

    onAddEvent(eventDate, eventTime, eventName);

    setEventDate('');
    setEventTime('');
    setEventName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="date"
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
        required
      />
      <input
        type="time"
        value={eventTime}
        onChange={(e) => setEventTime(e.target.value)}
        required
      />
      <input
        type="text"
        value={eventName}
        placeholder="Nombre del evento"
        onChange={(e) => setEventName(e.target.value)}
        required
      />
      <button type="submit">Añadir evento</button>
    </form>
  );
};

export default EventForm;
