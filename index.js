// init project
var express = require("express");
const { DateTime } = require("luxon");

var app = express();

// enable CORS
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/hello", function (req, res) {
	res.json({ greeting: "hello API" });
});

app.get("/api", function (req, res) {
	let dateTime = DateTime.now();

	dateTime = dateTime.setZone("utc");

	const unixTimestamp = dateTime.toMillis();
	const utcTimestamp = dateTime.toFormat("ccc, dd LLL yyyy HH:mm:ss 'GMT'");

	res.send({
		unix: unixTimestamp,
		utc: utcTimestamp,
	});
});

// Date endpoint
app.get("/api/:date", function (req, res) {
	// get the date parameter
	let date = req.params.date;
	try {
		let dateTime;

		if (!date) {
			// Date is empty
			dateTime = DateTime.now();
		} else if (!isNaN(Date.parse(date))) {
			// Date is valid date string
			dateTime = DateTime.fromJSDate(new Date(date));
		} else if (!isNaN(date) && !isNaN(parseFloat(date))) {
			// Date is in milliseconds
			dateTime = DateTime.fromMillis(parseInt(date, 10));
		} else {
			throw new Error("Invalid Date");
		}

		dateTime = dateTime.setZone("utc");
		// Convert to unix and UTC timestamps
		const unixTimestamp = dateTime.toMillis();
		const utcTimestamp = dateTime.toFormat("ccc, dd LLL yyyy HH:mm:ss 'GMT'");

		// Send back response
		res.send({
			unix: unixTimestamp,
			utc: utcTimestamp,
		});
	} catch (err) {
		res.send({
			error: err.message,
		});
	}
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
	console.log("Your app is listening on port " + listener.address().port);
});
