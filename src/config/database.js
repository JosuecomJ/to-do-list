const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/TO-DO-LIST').then(() => {
    console.log('Connected to MongoDB successfully :)');
}).catch((e) => {
    console.log('Error:');
    console.log(e);
})