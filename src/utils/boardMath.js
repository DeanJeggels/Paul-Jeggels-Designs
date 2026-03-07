// Utility functions for converting dimensions strings to numbers and calculating volume

export const parseLength = (lenStr) => {
    // Format: 6'0" or 5'10"
    if (!lenStr) return 72; // default
    const [feet, inches] = lenStr.replace('"', '').split("'").map(Number);
    return (feet * 12) + inches;
};

export const parseFraction = (str) => {
    // Format: 19 1/8" or 2"
    if (!str) return 0;
    const clean = str.replace('"', '').trim();
    if (!clean.includes(' ')) {
        // Just a whole number (e.g. 2") or simple number
        if(clean.includes('/')) {
            const [num, den] = clean.split('/').map(Number);
            return num / den;
        }
        return parseFloat(clean);
    }
    
    const [whole, fraction] = clean.split(' ');
    const [num, den] = fraction.split('/').map(Number);
    return parseFloat(whole) + (num / den);
};

export const calculateVolume = (lenStr, widthStr, thickStr, shapeType = 'shortboard') => {
    const L = parseLength(lenStr);
    const W = parseFraction(widthStr);
    const T = parseFraction(thickStr);

    // Coefficients (Shape Factor)
    // Shortboard/Performance: ~0.54 - 0.58
    // Fish/Groveler: ~0.60 - 0.65
    // Longboard: ~0.60 - 0.65
    // Using 0.58 as a baseline for the "Pro" model
    let factor = 0.58;
    if (shapeType === 'fish' || shapeType === 'groveler') factor = 0.61;
    if (shapeType === 'log') factor = 0.63;

    // Volume in Liters = (L_in * W_in * T_in * Factor) / 61.0237 (cubic inches per liter)
    const cubicInches = L * W * T;
    const volume = (cubicInches * factor) / 61.0237;

    return volume.toFixed(1);
};
