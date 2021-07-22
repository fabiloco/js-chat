const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`, {useNewUrlParser: true})
    .then(db => {
        console.log('db is connected');
    })
    .catch( err => console.log(err));