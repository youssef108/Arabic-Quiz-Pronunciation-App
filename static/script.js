document.addEventListener('DOMContentLoaded', function() {
    fetchQuestion();
});

function fetchQuestion() {
    fetch('/get_question')
    .then(response => response.json())
    .then(data => {
        if (data.end) {
            document.getElementById('question').style.display = 'none';
            document.getElementById('ayah').style.display = 'none';
            document.getElementById('options').style.display = 'none';
            document.getElementById('recordButton').style.display = 'none';
            document.getElementById('recognizedText').style.display = 'none';
            document.getElementById('statusIcon').style.display = 'none';
            document.getElementById('continueButton').style.display = 'none';
            document.getElementById('pronounceButton').style.display = 'none';
            document.getElementById('endQuiz').style.display = 'block';
            document.getElementById('totalAttempts').innerText = data.total_attempts;
            document.getElementById('correctAttempts').innerText = data.correct_attempts;
            document.getElementById('wrongAttempts').innerText = data.wrong_attempts;
        } else {
            document.getElementById('question').style.display = 'block';
            document.getElementById('ayah').style.display = 'block';
            document.getElementById('options').style.display = 'block';
            document.getElementById('recordButton').style.display = 'block';
            document.getElementById('recognizedText').style.display = 'block';
            document.getElementById('statusIcon').style.display = 'block';
            document.getElementById('endQuiz').style.display = 'none';

            document.getElementById('question').innerText = data.question;
            document.getElementById('ayah').innerText = data.ayah;
            const optionsDiv = document.getElementById('options');
            optionsDiv.innerHTML = ''; // Clear previous options
            data.options.forEach((option, index) => {
                const optionElement = document.createElement('span');
                optionElement.innerText = `${index + 1}. ${option}`;
                optionsDiv.appendChild(optionElement);
            });
            document.getElementById('recognizedText').innerText = '';
            document.getElementById('statusIcon').className = 'status-icon'; // Reset status icon
            document.getElementById('continueButton').style.display = 'none';
            document.getElementById('pronounceButton').style.display = 'none';
        }
    });
}

document.getElementById('recordButton').addEventListener('click', function() {
    document.getElementById('statusMessage').innerText = 'Please wait...';
    document.getElementById('statusIcon').className = 'status-icon'; // Reset status icon
    document.getElementById('pronounceButton').style.display = 'none'; // Hide pronounce button
    fetch('/toggle_listening', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.listening) {
            document.getElementById('recordButton').innerText = 'Stop Recording';
            document.getElementById('recordButton').classList.remove('start');
            document.getElementById('recordButton').classList.add('stop');
            document.getElementById('statusMessage').innerText = 'Listening...';
            startTextUpdate();
        } else {
            stopTextUpdate();
        }
    });
});

document.getElementById('continueButton').addEventListener('click', function() {
    fetch('/next_question', {
        method: 'POST'
    })
    .then(response => {
        fetchQuestion();
    });
});

document.getElementById('pronounceButton').addEventListener('click', function() {
    fetch('/pronounce_answer')
    .then(response => response.blob())
    .then(blob => {
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();
    });
});

let textUpdateInterval;

function startTextUpdate() {
    textUpdateInterval = setInterval(() => {
        fetch('/get_text')
        .then(response => response.json())
        .then(data => {
            document.getElementById('recognizedText').innerText = data.text;
            const statusIcon = document.getElementById('statusIcon');
            const pronounceButton = document.getElementById('pronounceButton');
            if (data.text && data.text !== "Couldn't hear you well, could you repeat that?" && data.text !== "Could not request results from Google Web Speech API; ") {
                document.getElementById('statusMessage').innerText = ''; // Clear status message
                if (data.text === data.answer) { // check if recognized text is the answer
                    document.getElementById('ayah').innerText = data.complete_sentence;
                    document.getElementById('continueButton').style.display = 'block';
                    pronounceButton.style.display = 'none';
                    statusIcon.className = 'fas fa-check status-icon correct'; // Green tick
                } else {
                    statusIcon.className = 'fas fa-times status-icon incorrect'; // Red X
                    pronounceButton.style.display = 'block';
                }
            }
            if (!data.listening) {
                stopTextUpdate();
            }
        });
    }, 1000); // Fetch every second
}

function stopTextUpdate() {
    clearInterval(textUpdateInterval);
    document.getElementById('statusMessage').innerText = ''; // Clear status message if listening stopped
    document.getElementById('recordButton').innerText = 'Start Recording';
    document.getElementById('recordButton').classList.remove('stop');
    document.getElementById('recordButton').classList.add('start');
}
