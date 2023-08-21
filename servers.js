var express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');

var app = express()
var port = process.env.port || 3000;

app.use(express.static(__dirname + '/'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// START - MongoDB Implementation ========================================================================

const uri = "mongodb+srv://DewniManamperi:ASHAra99@sit725.09sxxbx.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("Successfully connected to MongoDB!");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}


// Add a new dog document
app.post("/mongo-add-dog", (req, res) => {
    const formData = req.body;

    const db = client.db("sit_725");
    const dogsCollection = db.collection("dogs");
    try {
        const result = dogsCollection.insertOne(formData);
        res.status(201).json({ message: "Dog added successfully!", dog: result });

    } catch (err) {
        res.status(500).json({ error: "Internal server error!" });
    }
});

// Get all dog documents
app.get("/mongo-all-dogs", async (req, res) => {
    const db = client.db("sit_725");
    const dogsCollection = db.collection("dogs");
    try {
        const dogs = await dogsCollection.find({}).toArray();
        res.status(200).json(dogs);

    } catch (err) {
        res.status(500).json({ error: "Internal server error!" });
    }
});
// END - MongoDB Implementation ==========================================================================



app.get('/add', (req, res) => {
    const { num1, num2 } = req.query;
    if (!num1 || !num2) {
        return res.status(400).json({ error: 'Please provide both num1 and num2 parameters.' });
    }
    const result = parseFloat(num1) + parseFloat(num2);
    return res.json({ result });
});

app.post('/calculate', (req, res) => {
    const { operation, num1, num2 } = req.body;
    if (!operation || !num1 || !num2) {
        return res.status(400).json({ error: 'Please provide operation, num1, and num2 parameters.' });
    }
    let result;
    switch (operation) {
        case 'add':
            result = parseFloat(num1) + parseFloat(num2);
            break;
        case 'subtract':
            result = parseFloat(num1) - parseFloat(num2);
            break;
        case 'multiply':
            result = parseFloat(num1) * parseFloat(num2);
            break;
        case 'divide':
            result = parseFloat(num1) / parseFloat(num2);
            break;
        default:
            return res.status(400).json({ error: 'Invalid operation. Supported operations: add, subtract, multiply, divide.' });
    }
    return res.json({ result });
});


app.get("/", (req, res) => {
    // const indexPath = path.join(__dirname, "index.html");

    res.render('index.html');

    // fs.readFile(indexPath, "utf8", (err, data) => {
    //     if (err) {
    //         return res.status(500).send("Error reading HTML file");
    //     }
    //     res.send(data);
    // });
});


app.listen(port, () => {
    console.log(`App listening to http://localhost:${port}`);
    connectToMongoDB();
});