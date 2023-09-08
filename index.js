const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { format } = require('date-fns'); // Import the date-fns library for date formatting
require('dotenv').config();

//handles uncaught errors
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! Shutting Down....');
  process.exit(1);
});

const app = express();

app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(cors());

app.use('/', async (req, res) => {
  const { slack_name, track } = req.query;

  // Check if required parameters are provided
  if (!slack_name || !track) {
    return res.status(400).json({ error: 'slack_name and track are required query parameters' });
  }

  // Get the current day
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDate = new Date();
  const currentDay = daysOfWeek[currentDate.getUTCDay()];

  // Get the current UTC time and format it
  const currentUTC = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'");

  // GitHub repository information
  const githubUsername = 'VikMaamaa';
  const githubRepo = 'HNGX-Task-1';
  const githubFile = 'index.js';
  const githubFileURL = `https://github.com/${githubUsername}/${githubRepo}/${githubFile}`;
  const githubRepoURL = `https://github.com/${githubUsername}/${githubRepo}`;

  const response = {
    slack_name,
    current_day: currentDay,
    utc_time: currentUTC,
    track,
    github_file_url: githubFileURL,
    github_repo_url: githubRepoURL,
    status_code: 200,
  };

  res.status(200).json(response);
});

//connection port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
