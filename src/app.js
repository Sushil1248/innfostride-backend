const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedUserRoutes');
const commonRoutes = require('./routes/commanRoutes');
const { CustomError, ErrorHandler, ResponseHandler } = require('./utils/responseHandler');
const connectDB = require('./config/database');
const useragent = require('express-useragent')
const app = express();
const fs = require('fs');
const path = require('path');

app.use(useragent.express());


const cors = require('cors');
const corsOptions = require("./constants/cors");
const { HTTP_STATUS_CODES } = require('./constants/error_message_codes');

// Connect to MongoDB
connectDB();
console.log(Date.now());
// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'src', 'assets')));
app.use('/api/auth', authRoutes);
app.use('/api/common', commonRoutes);

// protected route
app.use('/api', protectedRoutes);

app.get('/', (req, res) => {
    console.log(req.useragent)
    res.send('Hey this is my API running 🥳')
})

app.post('/upload/svg', (req, res) => {
    const { name, code } = req.body;
    const currentJson = path.join(__dirname, 'constants', 'svg_codes.json');
    if (!name || !code) {
        return res.status(400).json({ error: 'SVG name and code are required' });
    }

    // Read the existing JSON file
    fs.readFile(currentJson, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }

        let svgData = {};
        try {
            // Parse the existing JSON content
            svgData = JSON.parse(data);
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            return res.status(500).send('Error parsing JSON');
        }

        // Append the new SVG data
        svgData[name] = code;

        const jsonString = JSON.stringify(svgData, null, 2);

        // Write back to the JSON file
        fs.writeFile(currentJson, jsonString, (writeErr) => {
            if (writeErr) {
                console.error('Error writing file:', writeErr);
                return res.status(500).send('Error writing file');
            }
            ResponseHandler.success(res, { message: 'SVG Added Succesfuly' }, HTTP_STATUS_CODES.CREATED);
        });
    });
});

// 404 Error Handler
app.use((req, res, next) => {
    ErrorHandler.handleNotFound(res);
});

// Generic Error Handler
app.use((err, req, res, next) => {
    ErrorHandler.handleError(err, res);
});

module.exports = app;