// main.js
import { FORM_FIELDS, DEFAULTS } from './modules/constants.js';
import { 
    handleCountryChange, 
    populateTradeBasedFields, 
    initMultiStepForm, 
    initCustomStepper, 
    updateDustyResults,
    updateTraditionalResults
} from './modules/form-handlers.js';
import { initFormSubmissionHandler } from './modules/form-submission.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize form submission handling
    initFormSubmissionHandler();
    
    document.querySelectorAll('.dev-mode').forEach(el => {
        el.classList.remove('dev-mode');
    });
    
    initMultiStepForm();
    initCustomStepper();
    
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