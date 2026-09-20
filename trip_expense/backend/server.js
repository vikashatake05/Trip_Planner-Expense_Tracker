const express = require('express');
const cors = require('cors');
require('dotenv').config();

const tripRoutes = require('./routes/tripRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const settlementRoutes = require('./routes/settlementRoutes');
const itineraryRoutes = require('./routes/itineraryRoutes');

const notFound = require('./middleware/notFoundMiddleware');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "TripLedger API is running"
  });
});

// API Routes
app.use('/api/trips', tripRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/settlements', settlementRoutes);
app.use('/api/itinerary', itineraryRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`TripLedger Server running on http://localhost:${PORT}`);
});
