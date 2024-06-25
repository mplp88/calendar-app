const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Conectar a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/calendarEvents');

// Definir el esquema y modelo de eventos
const eventSchema = new mongoose.Schema({
  date: String,
  time: String,
  name: String
});

const Event = mongoose.model('Event', eventSchema);

app.get('/events', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

app.post('/events', async (req, res) => {
  const { date, time, eventName } = req.body;
  const newEvent = new Event({ date, time, name: eventName });
  await newEvent.save();
  res.json({ message: 'Evento añadido' });
});

app.delete('/events', async (req, res) => {
  const { date, time, eventIndex } = req.body;
  const events = await Event.find({ date, time });
  if (events[eventIndex]) {
      await Event.deleteOne({ _id: events[eventIndex]._id });
  }
  res.json({ message: 'Evento eliminado' });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});