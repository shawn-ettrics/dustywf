import { FORM_FIELDS, DEFAULTS, TRADE_TYPES, PROJECT_TYPES } from './constants.js';
import { validateStep, validateValues, collectFormValues, formatValue } from './utils.js';
import { calculateTraditionalResults, calculateDustyResults, getEfficiencyRate } from './calculations.js';

let hasInitialCalculation = false;
let currentFormStep = 1;

export function setInitialCalculation() {
    console.log('Setting initial calculation flag');
    hasInitialCalculation = true;
}

export function setCurrentStep(step) {
    currentFormStep = step;
    console.log('Step set to:', step);
}

function recalculateResults(forceTraditional = false, dustyOnly = false) {
    if (!hasInitialCalculation) {
        console.log('Skipping - no initial calculation');
        return;
    }
    
    const values = collectFormValues();
    if (!validateValues(values)) {
        console.log('Skipping - validation failed');
        return;
    }

    if (!dustyOnly && (currentFormStep >= 2 || forceTraditional)) {
        console.log('Updating traditional results');
        updateTraditionalResults();
        
        // If there are any dusty results showing, update them too
        const dustyResultElement = document.querySelector('[data-result="total-cost-dusty"]');
        const isDustyShowing = dustyResultElement && dustyResultElement.textContent !== '--';
        
        if (isDustyShowing || currentFormStep >= 3) {
            console.log('Cascading to dusty results');
            updateDustyResults();
        }
    } else if (dustyOnly && currentFormStep >= 3) {
        console.log('Updating dusty results only');
        updateDustyResults();
    }
}

export function initAutoUpdateResults() {
    // Input fields (use 'input' event)
    [
        FORM_FIELDS.volume,
        FORM_FIELDS.laborCost,
        FORM_FIELDS.traditionalProductivity
    ].forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.addEventListener('input', () => {
                console.log('Input field changed:', selector);
                recalculateResults();
            });
        }
    });

    // Select and number fields that need 'change' event
    [
        FORM_FIELDS.layoutMonths,
        FORM_FIELDS.unit,
        FORM_FIELDS.crewSize
    ].forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.addEventListener('change', () => {
                console.log('Change field updated:', selector);
                recalculateResults();
            });
        }
    });

    // Trade and project verticals
    [FORM_FIELDS.contractorTrade, FORM_FIELDS.projectVertical].forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.addEventListener('change', () => {
                if (hasInitialCalculation) {
                    console.log('Trade/Project changed:', selector);
                    populateTradeBasedFields();
                    recalculateResults(true);
                }
            });
        }
    });

    // Dusty productivity (now using recalculateResults with dustyOnly flag)
    const dustyProductivity = document.querySelector(FORM_FIELDS.dustyProductivity);
    if (dustyProductivity) {
        dustyProductivity.addEventListener('input', () => {
            console.log('Dusty productivity changed');
            recalculateResults(false, true);
        });
    }
}

function updateDisplayValue(key, value) {
    const element = document.querySelector(`[data-result="${key}"]`);
    if (element) {
        element.textContent = formatValue(key, value);
    }
}

export function initMultiStepForm() {
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
    
    // Initialize progress indicator
    updateProgressIndicator(0);
    
    // Handle Next button clicks
    nextButtons.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (!validateStep(steps[index])) return;
            
            if (index === 0) {
                populateTradeBasedFields();
            } else if (index === 1) {
                updateTraditionalResults();
            } else if (index === 2) {
                updateDustyResults();
            }
            
            steps[index].style.display = 'none';
            steps[index + 1].style.display = 'flex';
            updateProgressIndicator(index + 1);
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
            updateProgressIndicator(currentStepIndex - 1);
        });
    });
}

export function initCustomStepper() {
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

export function updateProgressIndicator(currentStepIndex) {
    // Update step indicators
    const stepIndicators = document.querySelectorAll('.form-step-indicator');
    stepIndicators.forEach((indicator, index) => {
        if (index <= currentStepIndex) {
            indicator.classList.add('complete');
        } else {
            indicator.classList.remove('complete');
        }
    });

    // Update progress bars
    const progressBars = document.querySelectorAll('.form-progress-bar');
    progressBars.forEach((bar, index) => {
        if (index < currentStepIndex) {
            bar.classList.add('complete');
        } else {
            bar.classList.remove('complete');
        }
    });
}

export function handleCountryChange(e) {
    const countryHidden = document.querySelector(FORM_FIELDS.countryHidden);
    const unavailableMessage = document.querySelector('#unavailable-message');
    
    countryHidden.value = e.target.value;
    
    if (e.target.value === 'Other') {
        unavailableMessage.style.display = 'block';
    } else {
        unavailableMessage.style.display = 'none';
    }
}

export function populateTradeBasedFields() {
    const selectedTrade = document.querySelector(FORM_FIELDS.contractorTrade).value;
    const projectVertical = document.querySelector(FORM_FIELDS.projectVertical).value;
    
    if (!selectedTrade || !projectVertical) return;

    const tradeConfig = TRADE_TYPES[selectedTrade];
    const complexity = PROJECT_TYPES[projectVertical].complexity;
    
    // Set units based on trade
    const unitSelect = document.querySelector(FORM_FIELDS.unit);
    const dustyUnitDisplay = document.querySelector('[data-default="unit selected"]');
    const productivityUnitLabel = document.querySelector('[data-unit-label]');
    
    if (unitSelect && dustyUnitDisplay && tradeConfig) {
        unitSelect.value = tradeConfig.unit;
        dustyUnitDisplay.textContent = tradeConfig.unit;
        if (productivityUnitLabel) {
            productivityUnitLabel.textContent = tradeConfig.unit;
        }
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
    if (traditionalProductivity && traditionalRate) {
        traditionalProductivity.value = traditionalRate;
        // Trigger an input event to force recalculation
        traditionalProductivity.dispatchEvent(new Event('input'));
    }
    
    const dustyProductivity = document.querySelector(FORM_FIELDS.dustyProductivity);
    if (dustyProductivity && dustyRate) {
        dustyProductivity.value = dustyRate;
        // Trigger an input event to force recalculation
        dustyProductivity.dispatchEvent(new Event('input'));
    }

    // Set crew sizes
    const crewSizeInput = document.querySelector(FORM_FIELDS.crewSize);
    if (crewSizeInput) {
        crewSizeInput.value = DEFAULTS.layoutCrew.traditional;
        // Trigger a change event to force recalculation
        crewSizeInput.dispatchEvent(new Event('change'));
    }
}
export function updateDustyResults() {
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
        `dusty crew size:${document.querySelector('[data-default="dusty crew"]').textContent}`,
        `labor cost:${document.querySelector('[data-default="dusty labor cost"]').textContent}`,
        `dusty productivity:${document.querySelector(FORM_FIELDS.dustyProductivity).value}`,
        // `Unit 2:${document.querySelector('[data-default="unit selected"]').textContent}`
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
    const gainsAndRoiValue = [
        `Gains:${document.querySelector('[data-result="gains"]').textContent}`,
        `ROI:${document.querySelector('[data-result="roi"]').textContent}`
    ].join(', ');
    document.querySelector(FORM_FIELDS.gainsAndRoi).value = gainsAndRoiValue;
}

export function updateTraditionalResults() {
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
        // `volumn:${document.querySelector(FORM_FIELDS.volume).value}`,
        // `layout months:${document.querySelector(FORM_FIELDS.layoutMonths).value}`,
        `crew size:${document.querySelector(FORM_FIELDS.crewSize).value}`,
        `labor cost:${document.querySelector(FORM_FIELDS.laborCost).value}`,
        `traditional productivity:${document.querySelector(FORM_FIELDS.traditionalProductivity).value}`
    ].join(', ');
    document.querySelector(FORM_FIELDS.traditionalLayoutInfo).value = traditionalInfo;
}
