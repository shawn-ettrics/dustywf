import { TRADE_TYPES, PROJECT_TYPES, TRADITIONAL_EFFICIENCY, DUSTY_EFFICIENCY, DEFAULTS, FORM_FIELDS } from './constants.js';

export function calculateTraditionalResults(values) {
    const complexity = PROJECT_TYPES[values.projectVertical].complexity;
    
    // Get the default rate from internal formula
    const defaultTraditionalRate = getEfficiencyRate(values.trade, complexity, false);
    
    // Get the current value from the input field
    const userTraditionalRate = parseFloat(document.querySelector(FORM_FIELDS.traditionalProductivity).value);
    
    // Use user input if it differs from default, otherwise use default
    const effectiveRate = (userTraditionalRate !== defaultTraditionalRate) 
        ? userTraditionalRate 
        : defaultTraditionalRate;
    
    const daysTraditional = Math.round(values.volume / effectiveRate / values.traditionalCrew);
    const dailyCostTraditional = values.traditionalCrew * values.laborCost * DEFAULTS.hoursPerDay;
    const totalCostTraditional = daysTraditional * dailyCostTraditional;
    
    return {
        daysTraditional,
        dailyCostTraditional,
        totalCostTraditional
    };
}

export function calculateDustyResults(values) {
    // Get the current value from the input, which might be user-modified
    const dustyRate = parseFloat(document.querySelector(FORM_FIELDS.dustyProductivity).value);
    
    const daysDusty = Math.round(values.volume / dustyRate);
    const dailyCostDusty = 1250;
    
    const totalCostDusty = (dailyCostDusty * daysDusty) + 
                          (DEFAULTS.dustyAccessFee * values.months) + 
                          DEFAULTS.trainingFee;
    
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

export function getEfficiencyRate(trade, complexity, isDusty = false) {
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

