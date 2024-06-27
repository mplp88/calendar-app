import React from 'react';

const EventList = ({ events, onDeleteEvent }) => {
  return (
    <ul>
      {events.map((event, index) => (
        <li key={`${event.date} ${event.time} ${event.name}`}>
          {event.date} {event.time}: {event.name}
          <button onClick={() => onDeleteEvent(event.date, event.time, index)}>
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  );
};

export default EventList;
