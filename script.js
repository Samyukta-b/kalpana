document.addEventListener('DOMContentLoaded', function() {
    
    document.getElementById('audioButtonLeft').addEventListener('click', function() {
        var leftLabel = document.querySelector('#left .label');

        if (leftLabel.textContent.trim() === "Plain Text") {
            var inputText = document.getElementById('input').value;
            speakText(inputText);
        } else {
            var outputText = document.getElementById('input').value;
            speakMorseCode(outputText);
        }
    });

    document.getElementById('audioButtonRight').addEventListener('click', function() {
        var rightLabel = document.querySelector('#right .label');

        if (rightLabel.textContent.trim() === "Plain Text") {
            var inputText = document.getElementById('output').value;
            speakText(inputText);
        } else {
            var outputText = document.getElementById('output').value;
            speakMorseCode(outputText);
        }
    });
});

const morseCodeSounds = {
    '.': 'dot',   // Play a short sound for dot
    '-': 'dash',  // Play a long sound for dash
    ' ': 'pause', // Add a pause between characters
};

function speakText(text) {
    var speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
}

function speakMorseCode(morseCode) {
    const morseCharacters = morseCode.split('');
    morseCharacters.forEach((ch, index) => {
        var sound = morseCodeSounds[ch];
        setTimeout(() => {
            playSound(sound);
        }, index * 600);
    });
}

function playSound(sound) {
    if (sound === 'dot') {
        playDotSound();
    } else if (sound === 'dash') {
        playDashSound();
    } else if (sound === 'pause') {
        addPause();
    }
}

function playDotSound() {
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    var oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 1000;
    oscillator.connect(audioContext.destination);
    oscillator.start();
    setTimeout(function() {
        oscillator.stop();
    }, 200);
}

function playDashSound() {
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    var oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 1000;
    oscillator.connect(audioContext.destination);
    oscillator.start();
    setTimeout(function() {
        oscillator.stop();
    }, 500);
}

function addPause() {
    var pauseDuration = 300;
    setTimeout(function() {
    }, pauseDuration);
}


document.getElementById('swapButton').addEventListener('click', function() {
    var leftLabel = document.querySelector('#left .label');
    var rightLabel = document.querySelector('#right .label');

    var tempLabelText = leftLabel.textContent;
    leftLabel.textContent = rightLabel.textContent;
    rightLabel.textContent = tempLabelText;

    var leftText = document.getElementById('input').value;
    var rightText = document.getElementById('output').value;
    document.getElementById('input').value = rightText;
    document.getElementById('output').value = leftText;

});

document.getElementById('uploadButton').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function(event) {
    let file = event.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('input').value = e.target.result;
            document.getElementById('input').disabled = true; // Disable textarea after file upload
        };
        reader.readAsText(file);
    }
});

document.getElementById('resetButton').addEventListener('click', function() {
    document.getElementById('input').value = ''; 
    document.getElementById('output').value = '';
    document.getElementById('fileInput').value = ''; 
    document.getElementById('input').disabled = false; 
});

function convertMorseToEnglish() {
    let morseCode = document.getElementById('input').value;

    fetch('/morseToEnglish', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: morseCode
    })
        .then(response => response.text())
        .then(data => {
            if (data.trim() === "undefined") {
                alert("Please input morse characters only");
            } else {
                document.getElementById('output').value = data;
            }
        })
        .catch(error => console.error('Error:', error));
}


function englishToMorse() {
    let englishText = document.getElementById('input').value;

    fetch('/englishToMorse', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: englishText
    })
        .then(response => response.text())
        .then(data => {
            let morseArray = data.split(' ');
            if (morseArray[0] === "undefined") {
                alert("Undefined character:"+morseArray[1]);
            } else {
                document.getElementById('output').value = data;
            }
        })
        .catch(error => console.error('Error:', error));
}

async function fetchHistory() {
    try {
        const response = await fetch('/history');
        const historyData = await response.json();
        return historyData;
    } catch (error) {
        console.error('Error fetching history:', error);
    }
}

async function updateHistoryTable() {
    const historyData = await fetchHistory();
    const historyBody = document.getElementById('historyBody');

    
    historyBody.innerHTML = '';

    historyData.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.convoId}</td>
            <td>${entry.english}</td>
            <td>${entry.morsecode}</td>
            <td>${entry.morEng ? 'Yes' : 'No'}</td>
        `;
        historyBody.appendChild(row);
    });
}

updateHistoryTable();
document.getElementById('convertButton').addEventListener('click', function() {
    var leftLabel = document.querySelector('#left .label');

    // Check if the label above the input text area is "Morse Code"
    if (leftLabel.textContent.trim() === "Morse Code") {
        convertMorseToEnglish();
    } else {
        // Handle the case where the label is not "Morse Code"
        englishToMorse();
        // You can provide a message or handle the event as needed
    }
    updateHistoryTable();
});