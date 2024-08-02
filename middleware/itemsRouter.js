const express = require('express');
const router = express.Router();

global.items = [{ "name": "popsicle", "price": 1.45 }, { "name": "cheerios", "price": 3.40 }];

// GET /items
router.get('/', (req, res) => {
    return res.json(items);
});

// POST /items
router.post('/', (req, res) => {
    const newItem = req.body;
    items.push(newItem);
    res.status(201).json({ message: "Added new item", item: newItem });
});

// GET /items/:name
router.get('/:name', (req, res) => {
    const name = req.params.name;
    const foundItem = items.find(item => item.name === name);
    if (foundItem === undefined) {
        return res.status(404).json({ message: "Item not found" });
    }
    return res.json(foundItem);
});

// PATCH /items/:name
router.patch('/:name', (req, res) => {
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
router.delete('/:name', (req, res) => {
    const name = req.params.name;
    const foundItemIndex = items.findIndex(item => item.name === name);
    if (foundItemIndex === -1) {
        return res.status(404).json({ message: "Item not found" });
    }
    items.splice(foundItemIndex, 1);
    return res.json({ message: "Deleted item" });
});

// Export the router
module.exports = router;
