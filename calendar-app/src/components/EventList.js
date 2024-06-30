import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const EventList = ({ events, onDeleteEvent }) => {
  return (
    <div>
      {events.length === 0 ? (
        <p>No hay eventos</p>
      ) : (
        <ul>
          {events.map((event, index) => (
            <li key={`${event.date}-${event.time}-${index}`}>
              {event.date} {event.time}: {event.name}
              <button onClick={() => onDeleteEvent(event.date, event.time, index)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventList;
