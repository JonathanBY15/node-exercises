const express = require('express');
const app = express();

// accept JSON and URL encoded values
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Function to validate input
const validateInput = (nums) => {
    if (!nums) {
        return 'nums are required.';
    }
    const numsArray = nums.split(',');
    for (let num of numsArray) {
        if (isNaN(Number(num))) {
            return `${num} is not a number.`;
        }
    }
    return null;
};

// Functşons to calculate mean, median and mode
const calculateMean = (nums) => {
    const numsArray = nums.split(',').map(Number);
    return numsArray.reduce((acc, num) => acc + num, 0) / numsArray.length;
};

const calculateMedian = (nums) => {
    const numsArray = nums.split(',').map(Number).sort((a, b) => a - b);
    const mid = Math.floor(numsArray.length / 2);
    return numsArray.length % 2 === 0 ? (numsArray[mid - 1] + numsArray[mid]) / 2 : numsArray[mid];
};

const calculateMode = (nums) => {
    const numsArray = nums.split(',').map(Number);
    const mode = numsArray.reduce((acc, num) => {
        acc[num] = acc[num] ? acc[num] + 1 : 1;
        return acc;
    }, {});
    const max = Math.max(...Object.values(mode));
    return Object.keys(mode).filter(key => mode[key] === max);
};


// Routes
app.get('/mean', (req, res) => {
    const { nums } = req.query;
    const error = validateInput(nums);
    if (error) {
        return res.status(400).json({ error });
    }
    const mean = calculateMean(nums);
    return res.json({ response: { operation: 'mean', value: mean } });
});

app.get('/median', (req, res) => {
    const { nums } = req.query;
    const error = validateInput(nums);
    if (error) {
        return res.status(400).json({ error });
    }
    const median = calculateMedian(nums);
    return res.json({ response: { operation: 'median', value: median } });
});

app.get('/mode', (req, res) => {
    const { nums } = req.query;
    const error = validateInput(nums);
    if (error) {
        return res.status(400).json({ error });
    }
    const mode = calculateMode(nums);
    return res.json({ response: { operation: 'mode', value: mode } });
});

// listen for requests
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = { validateInput, calculateMean, calculateMedian, calculateMode };
