import { FORM_FIELDS } from './modules/constants.js';
import { 
    handleCountryChange, 
    populateTradeBasedFields, 
    initMultiStepForm, 
    initCustomStepper, 
    updateDustyResults,
    updateTraditionalResults,
    setInitialCalculation,
    initAutoUpdateResults,
    setCurrentStep
} from './modules/form-handlers.js';
import { initFormSubmissionHandler } from './modules/form-submission.js';
import { initializeCanvas } from './modules/gridlines.js';
import { validateStep } from './modules/utils.js';  


document.addEventListener('DOMContentLoaded', () => {
    // Initialize form submission handling
    initFormSubmissionHandler();
    
    document.querySelectorAll('.dev-mode').forEach(el => {
        el.classList.remove('dev-mode');
    });
    
    initMultiStepForm();
    initCustomStepper();
    initAutoUpdateResults()
    
    // Initialize canvas
    const canvasControls = initializeCanvas();
    
    document.querySelectorAll('.hide-with-script').forEach(el => {
        el.style.display = 'none';
    });

    // Country selection handling
    document.querySelectorAll(FORM_FIELDS.countryRadios).forEach(radio => {
        radio.addEventListener('change', handleCountryChange);
    });

    // Add unit change handler
    const unitSelect = document.querySelector(FORM_FIELDS.unit);
    const productivityUnitLabel = document.querySelector('[data-unit-label]');
    if (unitSelect && productivityUnitLabel) {
        unitSelect.addEventListener('change', (e) => {
            productivityUnitLabel.textContent = e.target.value;
        });
    }

    // Step navigation and result updates
    document.querySelectorAll('[data-form="next-btn"]').forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the current form step
            const currentStep = document.querySelectorAll('[data-form="step"]')[index];
            
            // Only proceed if validation passes
            if (validateStep(currentStep)) {
                if (canvasControls) canvasControls.nextState();
                
                if (index === 0) {
                    setCurrentStep(2);
                    populateTradeBasedFields();
                } else if (index === 1) {
                    setCurrentStep(2);
                    updateTraditionalResults();
                    setInitialCalculation(); // Set this AFTER first traditional calculation
                } else if (index === 2) {
                    setCurrentStep(3);
                    updateDustyResults();
                }
            }
        });
    });
    document.querySelectorAll('[data-form="back-btn"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (canvasControls) canvasControls.prevState();
            
            // Update current step when going back
            const currentStepEl = Array.from(document.querySelectorAll('[data-form="step"]'))
                .find(step => step.style.display !== 'none');
            const stepIndex = Array.from(document.querySelectorAll('[data-form="step"]'))
                .indexOf(currentStepEl);
            setCurrentStep(stepIndex + 1); // +1 because we use 1-based step numbers
        });
    });
});