const express = require('express');
var cors = require('cors')
var bodyParser = require('body-parser')
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

const app = express();
app.use(cors())
app.use(bodyParser.json())
const PORT = 5001;


app.get('/', async (req, res) => {
    try {
        res.send(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/data', (req, res) => {
    try {
        const newData = req.body;
        const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
        data.notes.push(newData);
        fs.writeFileSync('./data.json', JSON.stringify(data));
        res.send(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post(('/delete/:id'), (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
        const newData = data.notes.filter(item => item.id != req.params.id)
        fs.writeFileSync('./data.json', JSON.stringify({ notes: newData }));
        res.send(newData);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error' });
    }
})

app.post(('/edit/:id'), (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
        const newData = data.notes.map(item => {
            if (item.id == req.params.id) {
                item.title = req.body.title;
                item.content = req.body.content;
            }
            return item;
        })
        fs.writeFileSync('./data.json', JSON.stringify({ notes: newData }));
        res.send(newData);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error' });
    }
})


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});