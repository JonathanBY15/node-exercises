const { validateInput, calculateMean, calculateMedian, calculateMode } = require('./app');

// Input
describe('validateInput', () => {
    test('should return error if nums is not provided', () => {
        expect(validateInput()).toBe('nums are required.');
    });

    test('should return error if nums contains a non-number', () => {
        expect(validateInput('1,foo,3')).toBe('foo is not a number.');
    });

    test('should return null if nums are valid', () => {
        expect(validateInput('1,2,3')).toBe(null);
    });
});

// Mean
describe('calculateMean', () => {
    test('should calculate mean correctly', () => {
        expect(calculateMean('1,2,3,4,5')).toBe(3);
    });
});

// Median
describe('calculateMedian', () => {
    test('should calculate median correctly for odd length', () => {
        expect(calculateMedian('1,2,3,4,5')).toBe(3);
    });

    test('should calculate median correctly for even length', () => {
        expect(calculateMedian('1,2,3,4,5,6')).toBe(3.5);
    });
});

// Mode
describe('calculateMode', () => {
    test('should calculate mode correctly', () => {
        expect(calculateMode('1,2,2,3,4')).toEqual(['2']);
    });

    test('should calculate mode correctly for multiple modes', () => {
        expect(calculateMode('1,2,2,3,3')).toEqual(['2', '3']);
    });
});
