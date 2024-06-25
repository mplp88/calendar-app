document.addEventListener('DOMContentLoaded', function () {
    const calendar = document.getElementById('calendar');
    const monthYear = document.getElementById('monthYear');
    const calendarDays = document.getElementById('calendarDays');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const eventsContainer = document.getElementById('events');
    const addEventButton = document.getElementById('addEventButton');
    const eventDateInput = document.getElementById('eventDate');
    const eventTimeInput = document.getElementById('eventTime');
    const eventNameInput = document.getElementById('eventName');

    let currentDate = new Date();
    let events = {};

    async function fetchEvents() {
        const response = await fetch('/events');
        const data = await response.json();
        events = data.reduce((acc, event) => {
            const eventKey = `${event.date} ${event.time}`;
            if (!acc[event.date]) acc[event.date] = [];
            acc[event.date].push({ time: event.time, name: event.name });
            acc[event.date].sort((a, b) => a.time.localeCompare(b.time));
            return acc;
        }, {});
        renderCalendar(currentDate);
    }

    function renderCalendar(date) {
        const month = date.getMonth();
        const year = date.getFullYear();

        // Obtener el primer y último día del mes actual
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // Obtener el día de la semana del primer y último día
        const startDay = firstDay.getDay();
        const endDay = lastDay.getDate();

        // Obtener el día actual
        const today = new Date();
        const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
        const currentDay = today.getDate();

        // Configurar el título del calendario
        const options = { month: 'long', year: 'numeric' };
        monthYear.textContent = date.toLocaleDateString('es-ES', options);

        // Limpiar los días anteriores
        calendarDays.innerHTML = '';
        eventsContainer.innerHTML = '';

        // Agregar los días del mes anterior (si los hay)
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startDay; i > 0; i--) {
            const dayElement = document.createElement('div');
            dayElement.textContent = prevMonthLastDay - i + 1;
            dayElement.classList.add('inactive');
            calendarDays.appendChild(dayElement);
        }

        // Agregar los días del mes actual
        for (let i = 1; i <= endDay; i++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = i;
            dayElement.classList.add('day-number');
            if (isCurrentMonth && i === currentDay) {
                dayElement.classList.add('today');
            }
            calendarDays.appendChild(dayElement);

            const eventDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
            if (events[eventDate]) {
                events[eventDate].forEach((event, index) => {
                    const eventElement = document.createElement('li');
                    eventElement.textContent = `${i}/${month + 1} ${event.time}: ${event.name}`;

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Eliminar';
                    deleteButton.addEventListener('click', () => deleteEvent(eventDate, event.time, index));

                    eventElement.appendChild(deleteButton);
                    eventsContainer.appendChild(eventElement);
                });
            }
        }

        // Agregar los días del próximo mes (si los hay)
        const totalCells = calendarDays.childElementCount;
        const remainingCells = 42 - totalCells;
        for (let i = 1; i <= remainingCells; i++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = i;
            dayElement.classList.add('inactive');
            calendarDays.appendChild(dayElement);
        }
    }

    function navigateMonth(direction) {
        currentDate.setMonth(currentDate.getMonth() + direction);
        renderCalendar(currentDate);
    }

    async function addEvent(e) {
        e.preventDefault();
        const eventDate = eventDateInput.value;
        const eventTime = eventTimeInput.value;
        const eventName = eventNameInput.value;

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

        const response = await fetch('/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date: eventDate, time: eventTime, eventName: eventName })
        });
        const result = await response.json();
        console.log(result.message);

        eventDateInput.value = '';
        eventTimeInput.value = '';
        eventNameInput.value = '';

        await fetchEvents();
    }

    async function deleteEvent(eventDate, eventTime, eventIndex) {
        const response = await fetch('/events', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date: eventDate, time: eventTime, eventIndex: eventIndex })
        });
        const result = await response.json();
        console.log(result.message);

        await fetchEvents();
    }

    prevButton.addEventListener('click', () => navigateMonth(-1));
    nextButton.addEventListener('click', () => navigateMonth(1));
    addEventButton.addEventListener('click', addEvent);

    fetchEvents();
});
