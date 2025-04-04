// Array of possible primary colors
const primaryColors = [
  { primary: "#94a3b8", secondary: "#64748b" }, // Slate
  { primary: "#6b7280", secondary: "#4b5563" }, // Gray
  { primary: "#78716c", secondary: "#57534e" }, // Stone
  { primary: "#a1a1aa", secondary: "#71717a" }, // Zinc
  { primary: "#737373", secondary: "#525252" }, // Neutral
  { primary: "#7c6f64", secondary: "#504945" }, // Earthy
];

// Set random primary color on load
function setRandomPrimaryColor() {
  const randomColor =
    primaryColors[Math.floor(Math.random() * primaryColors.length)];
  document.documentElement.style.setProperty(
    "--primary-color",
    randomColor.primary
  );
  document.documentElement.style.setProperty(
    "--secondary-color",
    randomColor.secondary
  );
}

// Call it when page loads
setRandomPrimaryColor();

// Get all input elements
const inputs = document.querySelectorAll('input[type="number"]');
const totalElement = document.getElementById("total");
const resetButton = document.getElementById("reset-button");

// Reset functionality
resetButton.addEventListener("click", () => {
  inputs.forEach((input) => {
    input.value = 0;
  });
  calculateTotal();
  updateSciencePreview();
  window.scrollTo(0, 0);
});

// Add event listeners to all inputs
inputs.forEach((input) => {
  input.addEventListener("input", () => {
    calculateTotal();
    if (
      input.id === "compass" ||
      input.id === "gears" ||
      input.id === "tablets"
    ) {
      updateSciencePreview();
    }
  });
});

function calculateMilitaryPoints() {
  return parseInt(document.getElementById("military-points").value) || 0;
}

function calculateSciencePoints() {
  const compass = parseInt(document.getElementById("compass").value) || 0;
  const gears = parseInt(document.getElementById("gears").value) || 0;
  const tablets = parseInt(document.getElementById("tablets").value) || 0;

  // Points for sets of different symbols
  const minDifferent = Math.min(compass, gears, tablets);
  const setPoints = minDifferent * 7;

  // Points for same symbols
  const compassPoints = compass * compass;
  const gearsPoints = gears * gears;
  const tabletsPoints = tablets * tablets;

  // Update individual points preview
  document.getElementById(
    "compass-points"
  ).textContent = `${compassPoints} points`;
  document.getElementById("gears-points").textContent = `${gearsPoints} points`;
  document.getElementById(
    "tablets-points"
  ).textContent = `${tabletsPoints} points`;

  // Update sets bonus
  document.getElementById("science-sets").textContent = setPoints;

  // Update sets count
  document.getElementById("science-sets-count").textContent = minDifferent;

  // Update total science points
  const totalScience = setPoints + compassPoints + gearsPoints + tabletsPoints;
  document.getElementById("science-total").textContent = totalScience;

  return totalScience;
}

function updateSciencePreview() {
  calculateSciencePoints();
}

function calculateCoinPoints() {
  const coins = parseInt(document.getElementById("coins").value) || 0;
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
  const wonderPoints =
    parseInt(document.getElementById("wonder-points").value) || 0;
  const civilianPoints =
    parseInt(document.getElementById("civilian-points").value) || 0;
  const commercialPoints =
    parseInt(document.getElementById("commercial-points").value) || 0;
  const guildPoints =
    parseInt(document.getElementById("guild-points").value) || 0;

  // Calculate total
  const total =
    militaryPoints +
    sciencePoints +
    coinPoints +
    wonderPoints +
    civilianPoints +
    commercialPoints +
    guildPoints;

  // Update total display
  totalElement.textContent = total;
}

// Initial calculation
calculateTotal();
updateSciencePreview();

// Setup the stepper buttons
const setupStepperButtons = () => {
  // Get all the stepper buttons
  const stepperButtons = document.querySelectorAll(".stepper-btn");

  // Add click handlers to each button
  stepperButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      // Prevent the default button behavior
      e.preventDefault();

      // Get the target input element
      const inputId = button.getAttribute("data-input");
      const input = document.getElementById(inputId);

      // Get the current value
      let value = parseInt(input.value) || 0;

      // Increment or decrement based on the button class
      if (button.classList.contains("increment")) {
        value += 1;
      } else if (button.classList.contains("decrement")) {
        // Special handling for military points, allow negative values
        if (inputId === "military-points") {
          value = Math.max(-6, value - 1); // Military can go down to -6
        } else {
          value = Math.max(0, value - 1); // Other values can't go below 0
        }
      }

      // Update the input value
      input.value = value;

      // Trigger the input event to recalculate
      const event = new Event("input", { bubbles: true });
      input.dispatchEvent(event);

      // Add haptic feedback if available (iOS)
      if (window.navigator && window.navigator.vibrate) {
        navigator.vibrate(50);
      }
    });
  });

  // Add long press functionality for faster incrementing/decrementing
  stepperButtons.forEach((button) => {
    let pressTimer;
    let stepInterval;
    let isTapping = false;

    // Mouse events for desktop
    button.addEventListener("mousedown", () => {
      pressTimer = setTimeout(() => {
        stepInterval = setInterval(() => {
          button.click();
        }, 100); // Increase/decrease rapidly after long press
      }, 500); // Start rapid change after 500ms
    });

    button.addEventListener("mouseup", () => {
      clearTimeout(pressTimer);
      clearInterval(stepInterval);
    });

    button.addEventListener("mouseleave", () => {
      clearTimeout(pressTimer);
      clearInterval(stepInterval);
    });

    // Touch events for mobile
    button.addEventListener("touchstart", (e) => {
      isTapping = true;

      pressTimer = setTimeout(() => {
        // For long press only
        isTapping = false;
        stepInterval = setInterval(() => {
          button.click();
        }, 100);
      }, 500);
    });

    button.addEventListener("touchend", (e) => {
      // If it was a tap (not a long press), manually trigger a click
      if (isTapping) {
        e.preventDefault(); // Prevent any unwanted default behavior
        // Manually call the click function to increment/decrement
        button.click();
      }

      clearTimeout(pressTimer);
      clearInterval(stepInterval);
      isTapping = false;
    });

    button.addEventListener("touchcancel", () => {
      clearTimeout(pressTimer);
      clearInterval(stepInterval);
      isTapping = false;
    });

    button.addEventListener("touchmove", () => {
      // If user is scrolling/moving, cancel the tap
      isTapping = false;
      clearTimeout(pressTimer);
      clearInterval(stepInterval);
    });
  });
};

// Call the setup function when the page loads
document.addEventListener("DOMContentLoaded", setupStepperButtons);
