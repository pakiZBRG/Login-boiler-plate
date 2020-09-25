const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path')
const app = express();
require('dotenv').config();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true,useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log("MongoDB connected..."))
    .catch(err => console.log(err));

if(process.env.NODE_ENV === 'development'){
    app.use(cors({ origin: process.env.CLIENT_URL }));
    app.use(morgan('dev'));
}

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

//Routes
app.use("/users", require('./routes/users'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));