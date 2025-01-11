import { FORM_FIELDS, TRADE_TYPES } from './constants.js';

export function formatValue(key, value) {
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

export function validateValues(values) {
    return !Object.values(values).some(value => 
        value === null || 
        value === undefined || 
        (typeof value === 'number' && isNaN(value))
    );
}

export function collectFormValues() {
    return {
        trade: document.querySelector(FORM_FIELDS.contractorTrade).value,
        projectVertical: document.querySelector(FORM_FIELDS.projectVertical).value,
        volume: parseFloat(document.querySelector(FORM_FIELDS.volume).value),
        months: parseInt(document.querySelector(FORM_FIELDS.layoutMonths).value), // Parse select value to integer
        traditionalCrew: parseFloat(document.querySelector(FORM_FIELDS.crewSize).value),
        laborCost: parseFloat(document.querySelector(FORM_FIELDS.laborCost).value)
    };
}

export function getTradeUnit(trade) {
    return TRADE_TYPES[trade]?.unit || null;
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