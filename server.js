const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const app = express();
require('dotenv').config();

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        // Windows doesn't accept ":" in filenames
        cb(null, new Date().toISOString().replace(/:/g, '-') + ' - ' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === "image/jpeg"){
        cb(null, true);
    } else {
        cb(null, false);
    }
}

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(multer({storage: diskStorage, fileFilter}).single('image'));

// Database Connect
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then(() => console.log("MongoDB connected..."))
    .catch(err => console.log(err));

//Routes
app.use("/users", require('./routes/users'));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});

// Production Ready
if(process.env.NODE_ENV === 'production'){
    app.use(express.static("client/build"));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));