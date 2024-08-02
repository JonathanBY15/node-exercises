const express = require('express')
const app = express()

// accept JSON and URL encoded values
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

global.items = [{ "name": "popsicle", "price": 1.45 }, { "name": "cheerios", "price": 3.40 }];

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// GET /items
app.get('/items', (req, res) => {
    return res.json(items)
})

// POST /items
app.post('/items', (req, res) => {
    const newItem = req.body;
    items.push(newItem);
    res.status(201).json({ message: "Added new item", item: newItem });
});

// GET /items/:name
app.get('/items/:name', (req, res) => {
    const name = req.params.name;
    const foundItem = items.find(item => item.name === name);
    if (foundItem === undefined) {
        return res.status(404).json({ message: "Item not found" });
    }
    return res.json(foundItem);
});

// PATCH /items/:name
app.patch('/items/:name', (req, res) => {
    const name = req.params.name;
    const foundItem = items.find(item => item.name === name);
    if (foundItem === undefined) {
        return res.status(404).json({ message: "Item not found" });
    }
    foundItem.name = req.body.name;
    foundItem.price = req.body.price;
    return res.json({ message: "Updated item", item: foundItem });
});

// DELETE /items/:name
app.delete('/items/:name', (req, res) => {
    const name = req.params.name;
    const foundItemIndex = items.findIndex(item => item.name === name);
    if (foundItemIndex === -1) {
        return res.status(404).json({ message: "Item not found" });
    }
    items.splice(foundItemIndex, 1);
    return res.json({ message: "Deleted item" });
});


app.listen(3000, () => {
    console.log(`Example app listening on port 3000`)
})


module.exports = items