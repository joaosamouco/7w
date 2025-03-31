// Array of possible primary colors
const primaryColors = [
    { primary: '#94a3b8', secondary: '#64748b' },    // Slate
    { primary: '#6b7280', secondary: '#4b5563' },    // Gray
    { primary: '#78716c', secondary: '#57534e' },    // Stone
    { primary: '#a1a1aa', secondary: '#71717a' },    // Zinc
    { primary: '#737373', secondary: '#525252' },    // Neutral
    { primary: '#7c6f64', secondary: '#504945' }     // Earthy
];

// Set random primary color on load
function setRandomPrimaryColor() {
    const randomColor = primaryColors[Math.floor(Math.random() * primaryColors.length)];
    document.documentElement.style.setProperty('--primary-color', randomColor.primary);
    document.documentElement.style.setProperty('--secondary-color', randomColor.secondary);
}

// Call it when page loads
setRandomPrimaryColor();

// Get all input elements
const inputs = document.querySelectorAll('input[type="number"]');
const totalElement = document.getElementById('total');
const resetButton = document.getElementById('reset-button');

// Reset functionality
resetButton.addEventListener('click', () => {
    inputs.forEach(input => {
        input.value = 0;
    });
    calculateTotal();
    updateSciencePreview();
    window.scrollTo(0, 0);
});

// Add event listeners to all inputs
inputs.forEach(input => {
    input.addEventListener('input', () => {
        calculateTotal();
        if (input.id === 'compass' || input.id === 'gears' || input.id === 'tablets') {
            updateSciencePreview();
        }
    });
});

function calculateMilitaryPoints() {
    return parseInt(document.getElementById('military-points').value) || 0;
}

function calculateSciencePoints() {
    const compass = parseInt(document.getElementById('compass').value) || 0;
    const gears = parseInt(document.getElementById('gears').value) || 0;
    const tablets = parseInt(document.getElementById('tablets').value) || 0;
    
    // Points for sets of different symbols
    const minDifferent = Math.min(compass, gears, tablets);
    const setPoints = minDifferent * 7;
    
    // Points for same symbols
    const compassPoints = compass * compass;
    const gearsPoints = gears * gears;
    const tabletsPoints = tablets * tablets;
    
    // Update individual points preview
    document.getElementById('compass-points').textContent = `${compassPoints} points`;
    document.getElementById('gears-points').textContent = `${gearsPoints} points`;
    document.getElementById('tablets-points').textContent = `${tabletsPoints} points`;
    
    // Update sets bonus
    document.getElementById('science-sets').textContent = setPoints;
    
    // Update total science points
    const totalScience = setPoints + compassPoints + gearsPoints + tabletsPoints;
    document.getElementById('science-total').textContent = totalScience;
    
    return totalScience;
}

function updateSciencePreview() {
    calculateSciencePoints();
}

function calculateCoinPoints() {
    const coins = parseInt(document.getElementById('coins').value) || 0;
    return Math.floor(coins / 3);
}

function calculateTotal() {
    // Calculate military points
    const militaryPoints = calculateMilitaryPoints();
    
    // Calculate science points
    const sciencePoints = calculateSciencePoints();
    
    // Calculate coin points
    const coinPoints = calculateCoinPoints();
    
    // Get other victory points
    const wonderPoints = parseInt(document.getElementById('wonder-points').value) || 0;
    const civilianPoints = parseInt(document.getElementById('civilian-points').value) || 0;
    const commercialPoints = parseInt(document.getElementById('commercial-points').value) || 0;
    const guildPoints = parseInt(document.getElementById('guild-points').value) || 0;
    
    // Calculate total
    const total = militaryPoints + sciencePoints + coinPoints + wonderPoints + 
                 civilianPoints + commercialPoints + guildPoints;
    
    // Update total display
    totalElement.textContent = total;
}

// Initial calculation
calculateTotal();
updateSciencePreview(); 