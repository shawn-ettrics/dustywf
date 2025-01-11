import { FORM_FIELDS } from './modules/constants.js';
import { 
    handleCountryChange, 
    populateTradeBasedFields, 
    initMultiStepForm, 
    initCustomStepper, 
    updateDustyResults,
    updateTraditionalResults
} from './modules/form-handlers.js';
import { initFormSubmissionHandler } from './modules/form-submission.js';
import { initializeCanvas } from './gridlines.js';
import { validateStep } from './modules/utils.js';  

document.addEventListener('DOMContentLoaded', () => {
    // Initialize form submission handling
    initFormSubmissionHandler();
    
    document.querySelectorAll('.dev-mode').forEach(el => {
        el.classList.remove('dev-mode');
    });
    
    initMultiStepForm();
    initCustomStepper();
    
    // Initialize canvas
    const canvasControls = initializeCanvas();
    
    document.querySelectorAll('.hide-with-script').forEach(el => {
        el.style.display = 'none';
    });

    // Country selection handling
    document.querySelectorAll(FORM_FIELDS.countryRadios).forEach(radio => {
        radio.addEventListener('change', handleCountryChange);
    });

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
                    populateTradeBasedFields();
                } else if (index === 1) {
                    updateTraditionalResults();
                } else if (index === 2) {
                    updateDustyResults();
                }
            }
        });
    });

    // Handle back button clicks for canvas animation
    document.querySelectorAll('[data-form="back-btn"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault()
            if (canvasControls) canvasControls.prevState();
        });
    });
});