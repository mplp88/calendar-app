const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

const app = express();
const port = process.env.PORT || 3000;

// Cargar variables de entorno
if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.production' });
} else {
    dotenv.config({ path: '.env' });
}

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Definir el esquema y modelo de eventos
const eventSchema = new mongoose.Schema({
    date: String,
    time: String,
    name: String
});

const MyEvent = mongoose.model('Event', eventSchema);

// Endpoints
app.use(bodyParser.json());

app.get('/events', async (req, res) => {
    const { month, year } = req.query;
    const events = await MyEvent.find({
        date: {
            $regex: new RegExp(`^${year}-${month.padStart(2, '0')}`)
        }
    });
    res.json(events);
});

app.post('/events', async (req, res) => {
    const { date, time, eventName } = req.body;
    const newEvent = new MyEvent({ date, time, name: eventName });
    await newEvent.save();
    res.json({ message: 'Evento agregado correctamente.' });
});

app.delete('/events', async (req, res) => {
    const { date, time, eventIndex } = req.body;
    const event = await MyEvent.findOne({ date, time });
    if (event) {
        await MyEvent.deleteOne({ _id: event._id });
    }
    res.json({ message: 'Evento eliminado correctamente.' });
});

// // Servir la aplicación de React en producción
// app.use(express.static(path.join(__dirname, 'public')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

module.exports = app;