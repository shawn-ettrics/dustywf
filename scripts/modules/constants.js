export const TRADE_TYPES = {
    'Framing': {
        columnIndex: 2,
        unit: 'Linear Feet',
        unitRate: 'Linear Feet / Day'
    },
    'Mechanical': {
        columnIndex: 3,
        unit: 'Points',
        unitRate: 'Points / Day'
    },
    'Electrical': {
        columnIndex: 3,
        unit: 'Points',
        unitRate: 'Points / Day'
    },
    'Plumbing': {
        columnIndex: 3,
        unit: 'Points',
        unitRate: 'Points / Day'
    },
    'General Contractor': {
        columnIndex: 4,
        unit: 'Square Feet',
        unitRate: 'Square Feet / Day'
    },
    'Concrete': {
        columnIndex: 2,
        unit: 'Linear Feet',
        unitRate: 'Linear Feet / Day'
    }
};

export const PROJECT_TYPES = {
    'Concrete Manufacturing': { complexity: 'Low' },
    'Single-Family Housing': { complexity: 'High' },
    'Multi-Family Housing': { complexity: 'Medium' },
    'Multi-Purpose Office': { complexity: 'Medium' },
    'Medical': { complexity: 'Very High' },
    'Manufacturing': { complexity: 'Very High' },
    'Aviation': { complexity: 'High' },
    'Warehousing': { complexity: 'High' },
    'Mission Critical': { complexity: 'High' }
};

export const TRADITIONAL_EFFICIENCY = {
    'Low': {
        linearFeet: 6000,
        points: 580,
        squareFeet: 12000
    },
    'Medium': {
        linearFeet: 2500,
        points: 480,
        squareFeet: 8000
    },
    'High': {
        linearFeet: 1200,
        points: 320,
        squareFeet: 6000
    },
    'Very High': {
        linearFeet: 650,
        points: 150,
        squareFeet: 3500
    }
};

export const DUSTY_EFFICIENCY = {
    'Low': {
        linearFeet: 28000,
        points: 3200,
        squareFeet: 140000
    },
    'Medium': {
        linearFeet: 12000,
        points: 2400,
        squareFeet: 60000
    },
    'High': {
        linearFeet: 6000,
        points: 1600,
        squareFeet: 30000
    },
    'Very High': {
        linearFeet: 3200,
        points: 800,
        squareFeet: 16000
    }
};

export const DEFAULTS = {
    layoutCrew: {
        traditional: 2,
        dusty: 1
    },
    layoutMonths: 3,
    laborCost: 60,
    trainingFee: 6000,
    dustyAccessFee: 3000,
    hoursPerDay: 8
};

