export const LENGTHS = Array.from({ length: 12 }, (_, i) => {
    const feet = 5 + Math.floor((8 + i) / 12);
    const inches = (8 + i) % 12;
    return `${feet}'${inches}"`;
});

export const WIDTHS = Array.from({ length: 53 }, (_, i) => {
    const base = 16;
    const fraction = i * 1/8;
    const whole = base + Math.floor(fraction);
    const remainder = fraction % 1;
    
    let fractionText = "";
    if (remainder === 0.125) fractionText = " 1/8";
    if (remainder === 0.25) fractionText = " 1/4";
    if (remainder === 0.375) fractionText = " 3/8";
    if (remainder === 0.5) fractionText = " 1/2";
    if (remainder === 0.625) fractionText = " 5/8";
    if (remainder === 0.75) fractionText = " 3/4";
    if (remainder === 0.875) fractionText = " 7/8";

    return `${whole}"${fractionText}`;
});

export const THICKNESS = [
    "1 7/8\"", "1 15/16\"", "2\"", "2 1/16\"", "2 1/8\"", "2 3/16\"", "2 1/4\"", 
    "2 5/16\"", "2 3/8\"", "2 7/16\"", "2 1/2\"", "2 9/16\"", "2 5/8\"", "2 11/16\"", 
    "2 3/4\"", "2 13/16\"", "2 7/8\"", "2 15/16\"", "3\"", "3 1/8\"", "3 1/4\"", "3 5/16\""
];

export const TAIL_SHAPES = [
    { id: 'squash', label: 'Squash' },
    { id: 'round', label: 'Round' },
    { id: 'round_pin', label: 'Round Pin' },
    { id: 'swallow', label: 'Swallow' },
    { id: 'square', label: 'Square' },
];

export const FIN_SYSTEMS = [
    { id: 'futures', label: 'Futures', price: 0 },
    { id: 'fcs2', label: 'FCS II', price: 0 },
    { id: 'glass_on', label: 'Glass Ons', price: 280 },
];

export const BLANKS = [
    { id: 'pu', label: 'PU (Standard)', price: 0 },
    { id: 'eps_eco', label: 'EPS + Eco Resin', price: 150 },
    { id: 'spine_tek', label: 'Spine-Tek EPS', price: 155 },
    { id: 'ect_pu', label: 'Eco Carbon Tech (PU)', price: 110 },
];

export const GLASSING = [
    { id: 'ultra_light', label: 'Ultra Light (4E+4E/4E)', price: 0 },
    { id: 'standard', label: 'Standard (6E+4E/4E)', price: 0 },
    { id: 'team', label: 'Team Box (4S/4E)', price: 0 },
    { id: 'gun', label: 'Gun (6E+6E/6E)', price: 20 },
];
