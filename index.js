const form = document.getElementById('guessForm');
const guessHistory = [];

const sigmers = [
    { name: "Spencer", age: 17, residence: "Sunbury", hair: "Black", employment: "Unemployed", hobby: "Gaming" },
    { name: "Julian", age: 17, residence: "Sunbury", hair: "Brown", employment: "Employed", hobby: "Gaming" },
    { name: "Asher", age: 16, residence: "Gisborne", hair: "Brown", employment: "Employed", hobby: "Outside" },
    { name: "Jackson", age: 16, residence: "Gisborne", hair: "White", employment: "Employed", hobby: "Sport" },
    { name: "Christian", age: 17, residence: "Sunbury", hair: "Brown", employment: "Unemployed", hobby: "Sport" },
    { name: "Cooper", age: 17, residence: "Sunbury", hair: "Brown", employment: "Unemployed", hobby: "Gaming" },
    { name: "Callum", age: 17, residence: "Sunbury", hair: "Blonde", employment: "Unemployed", hobby: "Gaming" },
    { name: "Joe", age: 17, residence: "Bullengarook", hair: "Brown", employment: "Employed", hobby: "Outside" },
    { name: "David", age: 17, residence: "Sunbury", hair: "Brown", employment: "Unemployed", hobby: "Gaming" },
    { name: "Preston", age: 17, residence: "Sunbury", hair: "Blonde", employment: "Employed", hobby: "Gaming" },
    { name: "Henry", age: 17, residence: "Sunbury", hair: "Brown", employment: "Employed", hobby: "Outside"},
    { name: "Beau", age: 17, residence: "Gisborne", hair: "Brown", employment: "Employed", hobby: "Sport"},
    { name: "Orlando", age: 17, residence: "Watergardens", hair: "Black", employment: "Employed", hobby: "Gaming"},
    { name: "Billy", age: 16, residence: "Riddells Creek", hair: "Brown", employment: "Employed", hobby: "Sport"},
    { name: "Connor Wings", age: 17, residence: "Broadmeadows", hair: "Black", employment: "Employed", hobby: "Sport"},
    { name: "Josh", age: 17, residence: "Sunbury", hair: "Brown", employment: "Employed", hobby: "Gaming"},
    { name: "Cody", age: 17, residence: "Gisborne", hair: "Blonde", employment: "Employed", hobby: "Outside"},
    { name: "Aiden", age: 17, residence: "Sunbury", hair: "Black", employment: "Unemployed", hobby: "Nothing. Literally nothing."}
];

let trueSigmer = sigmers[Math.floor(Math.random()*sigmers.length)];
const datalist = document.getElementById("sigmerNames");
const guessElement = document.getElementById("remainingGuesses");
let totalGuesses = 0;
let guessLimit = 5;
const toggle = document.getElementById('difficultyToggle');
const label = document.getElementById('difficultyLabel');

sigmers.forEach(s => {
    const option = document.createElement("option");
    option.value = s.name;
    datalist.appendChild(option);
});

function checkGuess(name) {
    const guessed = sigmers.find(s => s.name.toLowerCase() === name.toLowerCase());
    if (!guessed) { alert("Sigmer not found!"); return; }

    const feedback = {};
    for (let key in trueSigmer) {
        if (typeof trueSigmer[key] === "number") {
            if (guessed[key] === trueSigmer[key]) feedback[key] = guessed[key] + " (✓)";
            else if (guessed[key] > trueSigmer[key]) feedback[key] = guessed[key] + " (down)";
            else feedback[key] = guessed[key] + " (up)";
        } else {
            feedback[key] = guessed[key] === trueSigmer[key] ? guessed[key] + " (✓)" : guessed[key] + " (X)";
        }
    }
    return feedback;
}

function displayFeedback(feedback) {
    const table = document.createElement("table");
    table.border = 1;

    for (let key in feedback) {
        if (toggle.checked && (key === "age" || key === "hair")) continue;
        const row = table.insertRow();
        const cellAttr = row.insertCell(0);
        const cellValue = row.insertCell(1);
        cellAttr.textContent = key.charAt(0).toUpperCase() + key.slice(1);
        cellValue.textContent = feedback[key];

        if (feedback[key].includes("✓")) cellValue.classList.add("correct");
        else if (feedback[key].includes("X")) cellValue.classList.add("incorrect");
        else if (feedback[key].includes("up")) cellValue.classList.add("up");
        else if (feedback[key].includes("down")) cellValue.classList.add("down");
    }

    const container = document.getElementById("feedbackContainer");
    container.innerHTML = "";
    container.appendChild(table);
}

function displayHistory() {
    const historyContainer = document.getElementById("historyContainer");
    historyContainer.innerHTML = "<h3>Previous guesses</h3>";

    guessHistory.forEach(item => {
        const table = document.createElement("table");
        table.border = 1;

        const caption = document.createElement("caption");
        caption.textContent = "Guess: " + item.guess;
        table.appendChild(caption);

        for (let key in item.result) {
            if (toggle.checked && (key === "age" || key === "hair")) continue;
            const row = table.insertRow();
            const cellAttr = row.insertCell(0);
            const cellValue = row.insertCell(1);
            cellAttr.textContent = key.charAt(0).toUpperCase() + key.slice(1);
            cellValue.textContent = item.result[key];

            if (item.result[key].includes("✓")) cellValue.classList.add("correct");
            else if (item.result[key].includes("X")) cellValue.classList.add("incorrect");
            else if (item.result[key].includes("up")) cellValue.classList.add("up");
            else if (item.result[key].includes("down")) cellValue.classList.add("down");
        }

        historyContainer.appendChild(table);
    });
}

function isWin(feedback) { return Object.values(feedback).every(v => v.includes("✓")); }

function resetGame() {
    totalGuesses = 0;
    guessHistory.length = 0;
    guessElement.textContent = guessLimit;
    document.getElementById('feedbackContainer').innerHTML = "";
    document.getElementById('historyContainer').innerHTML = "<h3>Previous guesses</h3>";
    const guessBox = document.getElementById('guessBox');
    const submitButton = document.getElementById('submitButton');
    guessBox.disabled = false;
    submitButton.disabled = false;
    guessBox.value = "";
    trueSigmer = sigmers[Math.floor(Math.random()*sigmers.length)];
}

form.addEventListener('submit', function(e){
    e.preventDefault();
    const guessInput = document.getElementById('guessBox');
    const guess = guessInput.value.trim();
    if (!guess) return;

    const result = checkGuess(guess);
    if (!result) return;

    totalGuesses += 1;
    guessElement.textContent = guessLimit - totalGuesses;

    displayFeedback(result);
    guessHistory.push({guess, result});
    displayHistory();

    if (isWin(result)) {
        alert(`Congratulations! You guessed ${trueSigmer.name} correctly!`);
        resetGame();
        return;
    }

    if (totalGuesses >= guessLimit) {
        alert(`Maximum guesses reached! You LOSE!!! The correct answer was ${trueSigmer.name}`);
        resetGame();
        return;
    }

    guessInput.value = "";
});

toggle.addEventListener('change', function() {
    if (toggle.checked) { label.textContent = 'Hard'; guessLimit = 3; }
    else { label.textContent = 'Easy'; guessLimit = 5; }
    guessElement.textContent = guessLimit - totalGuesses;
});

// Random background image
window.addEventListener('DOMContentLoaded', () => {
    const backgroundCount = 4;
    const randomNum = Math.floor(Math.random() * backgroundCount) + 1;
    const imagePath = `/Backgrounds/background${randomNum}.jpg`;
    const bg = document.querySelector('.background');
    bg.style.backgroundImage = `url(${imagePath})`;
});

// Patch Notes button
document.getElementById('goto_PN').addEventListener('click', () => {
    window.location.href = 'patchnotes.html';
});
