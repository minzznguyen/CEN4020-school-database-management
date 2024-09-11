const http = require('http');
const cors = require('cors');
const express = require('express');
const app = express();

// Apply CORS middleware
app.use(cors());

app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
