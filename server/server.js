const express = require('express');
const cors = require('cors');

const app = express();
const port = 8000;

app.use(cors());

app.get("/", function (req, res) {
    res.send("Hello Phreddit!");
});

app.listen(port, () => {console.log("Server listening on port 8000...");});
