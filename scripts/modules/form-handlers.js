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

export function validateStep(stepElement) {
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