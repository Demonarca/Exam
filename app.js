const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3008

mongoose.connect('mongodb://localhost/handsOnExam',
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
);

mongoose.connect('connected', () => {
	console.log("connected to database")
})

app.use(cors());
app.use(bodyParser.json())

app.use('/users', require('./routes/users'))


// error handling middleware
app.use(function(err, req, res, next){

	res.status(400).json({
		error : err.message
	})
})


app.listen(port, () => {
	console.log(`You are Listening in port ${port}`)
})