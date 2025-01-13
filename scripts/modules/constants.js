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
        linearFeet: 800,
        points: 160,
        squareFeet: 2500
    },
    'Medium': {
        linearFeet: 600,
        points: 120,
        squareFeet: 1800
    },
    'High': {
        linearFeet: 400,
        points: 100,
        squareFeet: 1200
    },
    'Very High': {
        linearFeet: 200,
        points: 60,
        squareFeet: 600
    }
};

export const DUSTY_EFFICIENCY = {
    'Low': {
        linearFeet: 16000,
        points: 1100,
        squareFeet: 100000
    },
    'Medium': {
        linearFeet: 6400,
        points: 680,
        squareFeet: 60000
    },
    'High': {
        linearFeet: 3000,
        points: 320,
        squareFeet: 30000
    },
    'Very High': {
        linearFeet: 2400,
        points: 260,
        squareFeet: 14000
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

export const FORM_FIELDS = {
    // Step 1 - Project Information
    contractorTrade: 'select[data-name="contractor trade"]',
    projectVertical: 'select[data-name="Project Vertical"]',
    countryRadios: 'input[name="country"]',
    countryHidden: 'input[data-name="Country 2"]',
    
    // Step 2 - Manual Layout
    unit: '#unit-3',
    volume: 'input[data-name="volume"]',  
    layoutMonths: 'select[data-name="layout months"]',
    crewSize: 'input[data-name="crew size"]',
    laborCost: 'input[data-name="labor cost"]',
    traditionalProductivity: 'input[data-name="traditional productivity"]',

    // Step 3 
    dustyCrewDisplay: '[data-default="dusty crew"]',
    dustyLaborDisplay: '[data-default="dusty labor cost"]',
    dustyUnitDisplay: '[data-default="unit selected"]',
    dustyProductivity: 'input[data-name="dusty productivity"]',

    // Hidden Storage Fields
    traditionalLayoutInfo: '[data-traditional-layout-info]',
    automatedLayoutInfo: '[data-automated-layout-info]',
    costAnalysis: '[data-cost-analysis]',
    gainsAndRoi: 'input[data-name="Gains and ROI"]'
};

