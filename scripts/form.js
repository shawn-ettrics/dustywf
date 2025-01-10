// ===============================
// Data Constants
// ===============================
const TRADE_TYPES = {
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

const PROJECT_TYPES = {
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

const TRADITIONAL_EFFICIENCY = {
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

const DUSTY_EFFICIENCY = {
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

const DEFAULTS = {
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

// ===============================
// Form Field Selectors
// ===============================
const FORM_FIELDS = {
    // Step 1 - Project Information
    contractorTrade: 'select[data-name="contractor trade"]',
    projectVertical: 'select[data-name="Project Vertical"]',
    countryRadios: 'input[name="country"]',
    countryHidden: 'input[data-name="Country 2"]',
    
    // Step 2 - Manual Layout
    unit: '#unit-3',
    volume: 'input[data-name="volume"]',  // Fixed spelling
    layoutMonths: 'input[data-name="layout months"]',
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

// ===============================
// Main Event Handlers
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    initMultiStepForm();
    initCustomStepper()
    // Hide elements with 'hide-with-script' class
    document.querySelectorAll('.hide-with-script').forEach(el => {
        el.style.display = 'none';
    });

    // Set default dusty crew size
    const dustyCrewInput = document.querySelector(FORM_FIELDS.dustyCrewSize);
    if (dustyCrewInput) {
        dustyCrewInput.value = DEFAULTS.layoutCrew.dusty;
    }

    // Country selection handling
    document.querySelectorAll(FORM_FIELDS.countryRadios).forEach(radio => {
        radio.addEventListener('change', handleCountryChange);
    });

    // Sync labor costs
    const laborCostInputs = [
        document.querySelector(FORM_FIELDS.laborCost),
        document.querySelector(FORM_FIELDS.dustyLaborCost)
    ];
    laborCostInputs.forEach(input => {
        input?.addEventListener('input', syncLaborCosts);
    });

    // Step navigation and result updates
    document.querySelectorAll('[data-form="next-btn"]').forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (index === 0) {
                populateTradeBasedFields();
            } else if (index === 1) {
                updateTraditionalResults();
            } else if (index === 2) {
                updateDustyResults();
            }
        });
    });
});

// ===============================
// Handler Functions
// ===============================
function handleCountryChange(e) {
    const countryHidden = document.querySelector(FORM_FIELDS.countryHidden);
    const unavailableMessage = document.querySelector(FORM_FIELDS.unavailableMessage);
    
    countryHidden.value = e.target.value;
    
    if (e.target.value === 'Other') {
        unavailableMessage.style.display = 'block';
    } else {
        unavailableMessage.style.display = 'none';
    }
}

function syncLaborCosts(e) {
    const value = e.target.value;
    document.querySelector(FORM_FIELDS.laborCost).value = value;
    document.querySelector(FORM_FIELDS.dustyLaborCost).value = value;
}

function populateTradeBasedFields() {
    const selectedTrade = document.querySelector(FORM_FIELDS.contractorTrade).value;
    const projectVertical = document.querySelector(FORM_FIELDS.projectVertical).value;
    
    if (!selectedTrade || !projectVertical) return;

    const tradeConfig = TRADE_TYPES[selectedTrade];
    const complexity = PROJECT_TYPES[projectVertical].complexity;
    
    // Set units based on trade
    const unitSelect = document.querySelector('#unit-3'); // Step 2 unit select
    const dustyUnitDisplay = document.querySelector('[data-default="unit selected"]'); // Step 3 unit display
    if (unitSelect && dustyUnitDisplay && tradeConfig) {
        unitSelect.value = tradeConfig.unit;
        dustyUnitDisplay.textContent = tradeConfig.unit;
    }

    // Set labor cost
    const laborCostInput = document.querySelector(FORM_FIELDS.laborCost);
    const dustyLaborDisplay = document.querySelector('[data-default="dusty labor cost"]');
    if (laborCostInput && dustyLaborDisplay) {
        laborCostInput.value = DEFAULTS.laborCost;
        dustyLaborDisplay.textContent = DEFAULTS.laborCost;
    }

    // Set productivity rates
    const traditionalRate = getEfficiencyRate(selectedTrade, complexity, false);
    const dustyRate = getEfficiencyRate(selectedTrade, complexity, true);

    const traditionalProductivity = document.querySelector(FORM_FIELDS.traditionalProductivity);
    const dustyProductivity = document.querySelector(FORM_FIELDS.dustyProductivity);
    
    if (traditionalProductivity && traditionalRate) {
        traditionalProductivity.value = traditionalRate;
    }
    
    if (dustyProductivity && dustyRate) {
        dustyProductivity.value = dustyRate;
    }

    // Set crew sizes
    document.querySelector(FORM_FIELDS.crewSize).value = DEFAULTS.layoutCrew.traditional;
}
// ===============================
// Update Functions
// ===============================
function updateTraditionalResults() {
    const values = collectFormValues();
    if (!validateValues(values)) return;
    
    const results = calculateTraditionalResults(values);
    
    // Update display values
    updateDisplayValue('days-traditional', results.daysTraditional);
    updateDisplayValue('daily-cost-traditional', results.dailyCostTraditional);
    updateDisplayValue('total-cost-traditional', results.totalCostTraditional);

    // Store Step 2 info in hidden field
    const traditionalInfo = [
        `unit:${document.querySelector(FORM_FIELDS.unit).value}`,
        `volumn:${document.querySelector(FORM_FIELDS.volume).value}`,
        `layout months:${document.querySelector(FORM_FIELDS.layoutMonths).value}`,
        `crew size:${document.querySelector(FORM_FIELDS.crewSize).value}`,
        `labor cost:${document.querySelector(FORM_FIELDS.laborCost).value}`,
        `traditional productivity:${document.querySelector(FORM_FIELDS.traditionalProductivity).value}`
    ].join(', ');
    document.querySelector(FORM_FIELDS.traditionalLayoutInfo).value = traditionalInfo;
}

function updateDustyResults() {
    const values = collectFormValues();
    if (!validateValues(values)) return;

    const results = calculateDustyResults(values);
    
    // Update display values
    updateDisplayValue('training-fee', DEFAULTS.trainingFee);
    updateDisplayValue('dusty-fee', DEFAULTS.dustyAccessFee);
    updateDisplayValue('daily-cost-dusty', results.dailyCostDusty);
    updateDisplayValue('days-dusty', results.daysDusty);
    updateDisplayValue('total-cost-dusty', results.totalCostDusty);
    updateDisplayValue('gains', results.gains);
    updateDisplayValue('roi', results.roi);

    // Store Step 3 info in hidden field
    const automatedInfo = [
        `dusty crew size:${document.querySelector(FORM_FIELDS.dustyCrewSize).value}`,
        `labor cost 2:${document.querySelector(FORM_FIELDS.dustyLaborCost).value}`,
        `dusty productivity:${document.querySelector(FORM_FIELDS.dustyProductivity).value}`,
        `Unit 2:${document.querySelector(FORM_FIELDS.dustyUnit).value}`
    ].join(', ');
    document.querySelector(FORM_FIELDS.automatedLayoutInfo).value = automatedInfo;

    // Store cost analysis info
    const costAnalysis = [
        `Days Traditional:${document.querySelector('[data-result="days-traditional"]').textContent}`,
        `Daily Cost Traditional:${document.querySelector('[data-result="daily-cost-traditional"]').textContent}`,
        `Total Cost Traditional:${document.querySelector('[data-result="total-cost-traditional"]').textContent}`,
        `Training Fee:${document.querySelector('[data-result="training-fee"]').textContent}`,
        `Dusty Fee:${document.querySelector('[data-result="dusty-fee"]').textContent}`,
        `Daily Cost Dusty:${document.querySelector('[data-result="daily-cost-dusty"]').textContent}`,
        `Days Dusty:${document.querySelector('[data-result="days-dusty"]').textContent}`,
        `Total Cost Dusty:${document.querySelector('[data-result="total-cost-dusty"]').textContent}`
    ].join(', ');
    document.querySelector(FORM_FIELDS.costAnalysis).value = costAnalysis;

    // Store gains and ROI
    document.querySelector(FORM_FIELDS.gains).value = document.querySelector('[data-result="gains"]').textContent;
    document.querySelector(FORM_FIELDS.roi).value = document.querySelector('[data-result="roi"]').textContent;
}

function updateDisplayValue(key, value) {
    const element = document.querySelector(`[data-result="${key}"]`);
    if (element) {
        element.textContent = formatValue(key, value);
    }
}

function updateDustyResults() {
    const values = collectFormValues();
    if (!validateValues(values)) return;

    const results = calculateDustyResults(values);
    
    // Update display values
    updateDisplayValue('training-fee', DEFAULTS.trainingFee);
    updateDisplayValue('dusty-fee', DEFAULTS.dustyAccessFee);
    updateDisplayValue('daily-cost-dusty', results.dailyCostDusty);
    updateDisplayValue('days-dusty', results.daysDusty);
    updateDisplayValue('total-cost-dusty', results.totalCostDusty);
    updateDisplayValue('gains', results.gains);
    updateDisplayValue('roi', results.roi);

    // Store Step 3 info in hidden field
    const automatedInfo = [
        `dusty crew size:${document.querySelector(FORM_FIELDS.dustyCrewSize).value}`,
        `labor cost 2:${document.querySelector(FORM_FIELDS.dustyLaborCost).value}`,
        `dusty productivity:${document.querySelector(FORM_FIELDS.dustyProductivity).value}`,
        `Unit 2:${document.querySelector(FORM_FIELDS.dustyUnit).value}`
    ].join(', ');
    document.querySelector(FORM_FIELDS.automatedLayoutInfo).value = automatedInfo;

    // Store cost analysis info
    const costAnalysis = [
        `Days Traditional:${document.querySelector('[data-result="days-traditional"]').textContent}`,
        `Daily Cost Traditional:${document.querySelector('[data-result="daily-cost-traditional"]').textContent}`,
        `Total Cost Traditional:${document.querySelector('[data-result="total-cost-traditional"]').textContent}`,
        `Training Fee:${document.querySelector('[data-result="training-fee"]').textContent}`,
        `Dusty Fee:${document.querySelector('[data-result="dusty-fee"]').textContent}`,
        `Daily Cost Dusty:${document.querySelector('[data-result="daily-cost-dusty"]').textContent}`,
        `Days Dusty:${document.querySelector('[data-result="days-dusty"]').textContent}`,
        `Total Cost Dusty:${document.querySelector('[data-result="total-cost-dusty"]').textContent}`
    ].join(', ');
    document.querySelector(FORM_FIELDS.costAnalysis).value = costAnalysis;

    // Store gains and ROI in combined field
    const gainsAndRoiValue = [
        `Gains:${document.querySelector('[data-result="gains"]').textContent}`,
        `ROI:${document.querySelector('[data-result="roi"]').textContent}`
    ].join(', ');
    document.querySelector(FORM_FIELDS.gainsAndRoi).value = gainsAndRoiValue;
}

// ===============================
// Calculation Functions
// ===============================
function calculateTraditionalResults(values) {
    const complexity = PROJECT_TYPES[values.projectVertical].complexity;
    const traditionalRate = getEfficiencyRate(values.trade, complexity, false);
    
    const daysTraditional = Math.round(values.volume / traditionalRate);
    const dailyCostTraditional = values.traditionalCrew * values.laborCost * DEFAULTS.hoursPerDay;
    const totalCostTraditional = daysTraditional * dailyCostTraditional;
    
    return {
        daysTraditional,
        dailyCostTraditional,
        totalCostTraditional
    };
}

function calculateDustyResults(values) {
    const complexity = PROJECT_TYPES[values.projectVertical].complexity;
    const dustyRate = getEfficiencyRate(values.trade, complexity, true);
    
    // Days calculation only considers volume and rate
    const daysDusty = Math.round(values.volume / dustyRate);
    
    // Use fixed daily cost from spreadsheet
    const dailyCostDusty = 1250;
    
    // Calculate total cost following spreadsheet formula
    const totalCostDusty = (dailyCostDusty * daysDusty) + 
                          (DEFAULTS.dustyAccessFee * values.months) + 
                          DEFAULTS.trainingFee;
    
    // Calculate traditional total cost
    const traditionalResults = calculateTraditionalResults(values);
    const totalCostTraditional = traditionalResults.totalCostTraditional;
    
    const gains = totalCostTraditional - totalCostDusty;
    const roi = ((gains + totalCostDusty) / totalCostDusty) * 100;
    
    return {
        daysDusty,
        dailyCostDusty,
        totalCostDusty,
        gains,
        roi
    };
}
// ===============================
// Helper Functions
// ===============================
function getTradeUnit(trade) {
    return TRADE_TYPES[trade]?.unit || null;
}

function getEfficiencyRate(trade, complexity, isDusty = false) {
    const rateTable = isDusty ? DUSTY_EFFICIENCY : TRADITIONAL_EFFICIENCY;
    const tradeConfig = TRADE_TYPES[trade];
    
    if (!tradeConfig || !rateTable[complexity]) return null;
    
    switch(tradeConfig.unit) {
        case 'Linear Feet':
            return rateTable[complexity].linearFeet;
        case 'Points':
            return rateTable[complexity].points;
        case 'Square Feet':
            return rateTable[complexity].squareFeet;
        default:
            return null;
    }
}

function formatValue(key, value) {
    // Handle monetary values (anything with 'cost', 'fee', or 'gains' in the key)
    if (key.includes('cost') || key.includes('fee') || key.includes('gains')) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }
    
    // Handle ROI percentage
    if (key === 'roi') {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(value) + '%';
    }
    
    // Handle numeric values (like days)
    if (typeof value === 'number') {
        return new Intl.NumberFormat('en-US').format(value);
    }
    
    return value.toString();
}

function validateValues(values) {
    return !Object.values(values).some(value => 
        value === null || 
        value === undefined || 
        (typeof value === 'number' && isNaN(value))
    );
}

function collectFormValues() {
    const monthsValue = parseInt(document.querySelector(FORM_FIELDS.layoutMonths)?.value || '3');
    const bucketedMonths = monthsValue <= 3 ? 3 : monthsValue <= 6 ? 6 : 12;
    
    return {
        trade: document.querySelector(FORM_FIELDS.contractorTrade).value,
        projectVertical: document.querySelector(FORM_FIELDS.projectVertical).value,
        volume: parseFloat(document.querySelector(FORM_FIELDS.volume).value),
        traditionalCrew: parseFloat(document.querySelector(FORM_FIELDS.crewSize).value),
        laborCost: parseFloat(document.querySelector(FORM_FIELDS.laborCost).value),
        months: bucketedMonths  // Behind-the-scenes bucketing
    };
}

function initMultiStepForm() {
    const form = document.querySelector('[data-form="multistep"]');
    const steps = form.querySelectorAll('[data-form="step"]');
    const nextButtons = form.querySelectorAll('[data-form="next-btn"]');
    const backButtons = form.querySelectorAll('[data-form="back-btn"]');
    
    // Hide all steps except first one
    steps.forEach((step, index) => {
        if (index !== 0) {
            step.style.display = 'none';
        }
    });
    
    // Validate current step's required fields
    function validateStep(stepElement) {
        const requiredFields = stepElement.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value) {
                isValid = false;
                field.reportValidity(); // This triggers the browser's native validation UI
            }
        });
        
        return isValid;
    }
    
    // Handle Next button clicks
    nextButtons.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Validate current step before proceeding
            if (!validateStep(steps[index])) {
                return; // Stop if validation fails
            }
            
            if (index === 0) {
                populateTradeBasedFields();
            } else if (index === 1) {
                updateTraditionalResults();
            } else if (index === 2) {
                updateDustyResults();
            }
            
            steps[index].style.display = 'none';
            steps[index + 1].style.display = 'flex';
        });
    });
    
    // Handle Back button clicks
    backButtons.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const currentStepIndex = Array.from(steps).findIndex(
                step => step.style.display !== 'none'
            );
            
            steps[currentStepIndex].style.display = 'none';
            steps[currentStepIndex - 1].style.display = 'flex';
        });
    });
}
function initCustomStepper() {
    const crewSizeInput = document.querySelector('#crew-size');
    const decrementBtn = crewSizeInput.parentElement.querySelector('.stepper-btn:first-child');
    const incrementBtn = crewSizeInput.parentElement.querySelector('.stepper-btn:last-child');

    // Set initial value
    crewSizeInput.value = DEFAULTS.layoutCrew.traditional;

    decrementBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentValue = parseInt(crewSizeInput.value) || 0;
        if (currentValue > 1) {
            crewSizeInput.value = currentValue - 1;
            crewSizeInput.dispatchEvent(new Event('change'));
        }
    });

    incrementBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentValue = parseInt(crewSizeInput.value) || 0;
        crewSizeInput.value = currentValue + 1;
        crewSizeInput.dispatchEvent(new Event('change'));
    });

    // Ensure numeric input only
    crewSizeInput.addEventListener('input', () => {
        const value = crewSizeInput.value;
        crewSizeInput.value = value.replace(/[^0-9]/g, '');
        if (crewSizeInput.value === '') {
            crewSizeInput.value = '1';
        }
    });
}