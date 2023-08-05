const express = require('express');
const axios = require('axios');
const cors = require('cors'); // For handling Cross-Origin Resource Sharing (CORS)

const app = express();
const port = 5000; // Choose a port number for your server

app.use(express.json());
app.use(cors()); // Allow CORS for the frontend to communicate with the backend

const API_URL = 'https://www.kaggle.com/api/v1';
const KAGGLE_USERNAME = 'projectwhatsapp2023'; // Replace with your Kaggle username
const KAGGLE_API_KEY = '10eb860adeb20b2116c3bf34dc408b26'; // Replace with your Kaggle API key

// API endpoint to handle notebook upload from the frontend
app.post('/upload-notebook', async (req, res) => {
  try {
    const { notebookContent, metadata } = req.body; // You should pass notebook content and metadata from the frontend

    // Set up the request headers with Kaggle API key and username
    const headers = {
      'Authorization': `Bearer ${KAGGLE_API_KEY}`,
      'Kaggle-Username': KAGGLE_USERNAME,
    };

    // Make an HTTP POST request to the Kaggle API to upload the notebook
    const createResponse = await axios.post(
      `${API_URL}/kernels/push`,
      { content: notebookContent, ...metadata },
      {
        headers,
        params: {
          kernel_type: 'notebook',
          is_private: 'true',
          kernel_name: 'notebookone',
          path: '/path/to/folder', // Replace with the desired folder path
        },
      }
    );

    // Return the response from the Kaggle API back to the frontend
    res.json(createResponse.data);
  } catch (error) {
    console.error('Error uploading notebook:', error);
    res.status(500).json({ error: 'Error uploading notebook' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});