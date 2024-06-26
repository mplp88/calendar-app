import React, { useState, useEffect, useRef } from 'react';
import Calendar from './components/Calendar';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import './style.css';

function App() {
    const [events, setEvents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const timeInputRef = useRef(null);

    useEffect(() => {
        fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentDate]);

    const fetchEvents = async () => {
        setLoading(true);
        const month = currentDate.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
        const year = currentDate.getFullYear();
        const response = await fetch(`/events?month=${month}&year=${year}`);
        const data = await response.json();
        setEvents(data.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)));
        setLoading(false);
    };

    const addEvent = async (date, time, eventName) => {
        setLoading(true);
        const response = await fetch('/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date, time, eventName })
        });
        const result = await response.json();
        console.log(result.message);
        setSelectedDate('');

        fetchEvents();
    };

    const deleteEvent = async (date, time, eventIndex) => {
        setLoading(true);
        const response = await fetch('/events', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date, time, eventIndex })
        });
        const result = await response.json();
        console.log(result.message);

        fetchEvents();
    };

    const changeMonth = (newDate) => {
        setCurrentDate(newDate);
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        if (timeInputRef.current) {
            timeInputRef.current.focus();
        }
    };

    return (
        <div className="App">
            <Calendar events={events} onDateClick={handleDateClick} changeMonth={changeMonth} currentDate={currentDate} />
            <EventForm onAddEvent={addEvent} selectedDate={selectedDate} timeInputRef={timeInputRef} />
            {loading ? <p>Cargando...</p> : <EventList events={events} onDeleteEvent={deleteEvent} />}
        </div>
    );
}

export default App;
