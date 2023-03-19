// Define variables
const questionContainer = document.getElementById('question-container');
const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const submitBtn = document.getElementById('submit');
const feedbackContainer = document.getElementById('feedback-container');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('next');
const scoreContainer = document.getElementById('score-container');
const scoreEl = document.getElementById('score');
const retakeBtn = document.getElementById('retake');
const viewScoresBtn = document.getElementById('view-scores');
const timerEl = document.getElementById('timer');
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 0;
let timerId;

// Fetch questions from JSON file
async function fetchQuestions() {
    const response = await fetch('questions.json');
    const data = await response.json();
    return data.questions;
}

// Shuffle choices array
function shuffleChoices(choices) {
    for (let i = choices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [choices[i], choices[j]] = [choices[j], choices[i]];
    }
    return choices;
}

// Render current question
function renderQuestion(question) {
    questionEl.innerText = question.text;
    choicesEl.innerHTML = '';
    const choices = shuffleChoices([...question.choices]);
    choices.forEach((choice) => {
        const li = document.createElement('li');
        const label = document.createElement('label');
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'answer';
        radio.value = choice;
        label.appendChild(radio);
        label.append(` ${choice}`);
        li.appendChild(label);
        choicesEl.appendChild(li);
    });
}

// Start timer
function startTimer() {
    timeLeft = 60; // 60 seconds
    updateTimer();
    timerId = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            clearInterval(timerId);
            finishQuiz();
        }
    }, 1000);
}

// Update timer display
function updateTimer() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    timerEl.innerText = `Time: ${minutes}:${seconds}`;
}

// Show feedback and update score
function showFeedback(isCorrect) {
    if (isCorrect) {
        feedbackEl.innerText = 'Correct!';
        score++;
    } else {
        feedbackEl.innerText = 'Incorrect';
    }
    scoreEl.innerText = score.toString();
}

// Show next question or finish quiz
function showNext() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        renderQuestion(questions[currentQuestionIndex]);
        questionContainer.style.display = 'block';
        feedbackContainer.style.display = 'none';
    } else {
        finishQuiz();
    }
}

// Finish quiz
function finishQuiz() {
    clearInterval(timerId);
    questionContainer.style.display = 'none';
    feedbackContainer.style.display = 'none';
    scoreContainer.style.display = 'block';
}

// Restart quiz
function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 0;
    scoreEl.innerText = '0';
    questionContainer.style.display = 'block';
    feedbackContainer.style.display = 'none';
    scoreContainer.style.display = 'none';
    startQuiz();
}

function startQuiz() {
    score = 0;
    questionIndex = 0;
    remainingTime = MAX_TIME;

    showTimer();

    // hide feedback and score container
    feedbackContainer.style.display = "none";
    scoreContainer.style.display = "none";

    // show question container
    questionContainer.style.display = "block";

    // render the first question
    renderQuestion();

    // handle submit button click
    submitBtn.addEventListener("click", handleAnswerSubmit);

    // handle next button click
    nextBtn.addEventListener("click", renderNextQuestion);
}

