import React, { useEffect } from 'react';
import '../style.css';

const Calendar = ({ events, onDateClick, changeMonth, currentDate }) => {
    useEffect(() => {
        renderCalendar(currentDate);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentDate, events]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowLeft') {
                navigateMonth(-1);
            } else if (event.key === 'ArrowRight') {
                navigateMonth(1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        
        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentDate]);

    const renderCalendar = (date) => {
        const month = date.getMonth();
        const year = date.getFullYear();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = firstDay.getDay();
        const endDay = lastDay.getDate();

        const today = new Date();
        const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
        const currentDay = today.getDate();

        const calendarDays = [];
        const prevMonthLastDay = new Date(year, month, 0).getDate();

        for (let i = startDay; i > 0; i--) {
            calendarDays.push(
                <div key={`prev-${i}`} className="inactive">
                    {prevMonthLastDay - i + 1}
                </div>
            );
        }

        for (let i = 1; i <= endDay; i++) {
            const day = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
            calendarDays.push(
                <div
                    key={day}
                    className={`day-number ${isCurrentMonth && i === currentDay ? 'today' : ''}`}
                    onClick={() => onDateClick(day)}
                >
                    {i}
                </div>
            );
        }

        const totalCells = calendarDays.length;
        const remainingCells = 42 - totalCells;
        for (let i = 1; i <= remainingCells; i++) {
            calendarDays.push(
                <div key={`next-${i}`} className="inactive">
                    {i}
                </div>
            );
        }

        return calendarDays;
    };

    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + direction));
        changeMonth(newDate);
    };

    const options = { month: 'long', year: 'numeric' };
    const monthYear = currentDate.toLocaleDateString('es-ES', options);

    return (
        <div>
            <div className="month">
                <button onClick={() => navigateMonth(-1)}>&lt;</button>
                <div id="monthYear">{monthYear}</div>
                <button onClick={() => navigateMonth(1)}>&gt;</button>
            </div>
            <div id="calendarDays">{renderCalendar(currentDate)}</div>
        </div>
    );
};

export default Calendar;
