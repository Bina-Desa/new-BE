const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors')

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const destinationRoutes = require('./app/routes/destination.routes')
const kulinerRoutes = require('./app/routes/kuliner.routes')
const authRoutes = require('./app/routes/auth.routes')
const eventRoutes = require('./app/routes/event.routes')



app.use('/uploads', express.static('uploads')); // Untuk akses file statis
app.use('/api/destinations', destinationRoutes); // Rute untuk destinations
app.use('/api/kuliner', kulinerRoutes);
app.use('/api/auth', authRoutes)
app.use('/api/event', eventRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
}); 
