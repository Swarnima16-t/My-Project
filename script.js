// Questions by Category

const questions = {
    html: [
        {
            question: "What does HTML stand for?",
            options: [
                "Hyper Text Markup Language",
                "Home Tool Markup Language",
                "Hyper Transfer Markup Language",
                "High Text Machine Language"
            ],
            answer: "Hyper Text Markup Language"
        },
        {
            question: "Which tag is used to insert an image?",
            options: ["<img>", "<image>", "<pic>", "<src>"],
            answer: "<img>"
        }
    ],

    css: [
        {
            question: "Which property changes text color?",
            options: ["font-color", "text-color", "color", "background"],
            answer: "color"
        },
        {
            question: "Which CSS property changes background color?",
            options: ["bgcolor", "background", "background-color", "color"],
            answer: "background-color"
        }
    ],

    javascript: [
        {
            question: "Which keyword declares a variable?",
            options: ["int", "var", "string", "float"],
            answer: "var"
        },
        {
            question: "Which company developed JavaScript?",
            options: ["Google", "Netscape", "Microsoft", "IBM"],
            answer: "Netscape"
        }
    ],

    gk: [
        {
            question: "What is the capital of India?",
            options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
            answer: "Delhi"
        },
        {
            question: "Which planet is called Red Planet?",
            options: ["Earth", "Venus", "Mars", "Jupiter"],
            answer: "Mars"
        }
    ]
};

let quizData = [];
let currentQuestion = 0;
let score = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let timer;
let timeLeft = 15;
let username = "";

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const themeBtn = document.getElementById("theme-btn");
const fiftyBtn = document.getElementById("fifty-btn");
const skipBtn = document.getElementById("skip-btn");

// Load High Score

document.getElementById("high-score").innerText =
localStorage.getItem("highScore") || 0;

// Start Quiz

startBtn.addEventListener("click", () => {

    username = document.getElementById("username").value;

    if(username.trim() === ""){
        alert("Please enter your name");
        return;
    }

    let category =
        document.getElementById("category").value;

    quizData = [...questions[category]];

    quizData.sort(() => Math.random() - 0.5);

    document.getElementById("start-screen")
        .classList.add("hide");

    document.getElementById("quiz-screen")
        .classList.remove("hide");

    loadQuestion();
});

// Dark Mode

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// Load Question

function loadQuestion(){

    clearInterval(timer);

    nextBtn.disabled = true;

    let q = quizData[currentQuestion];

    document.getElementById("question-count")
        .innerText =
        `Question ${currentQuestion + 1}/${quizData.length}`;

    document.getElementById("question")
        .innerText = q.question;

    document.getElementById("options").innerHTML = "";

    updateProgress();

    startTimer();

    q.options.forEach(option => {

        let btn = document.createElement("button");

        btn.innerText = option;
        btn.classList.add("option");

        btn.addEventListener("click", () => {
            checkAnswer(btn, option);
        });

        document.getElementById("options")
            .appendChild(btn);
    });
}

// Timer

function startTimer(){

    timeLeft = 15;

    document.getElementById("timer")
        .innerText = `⏳ ${timeLeft}`;

    timer = setInterval(() => {

        timeLeft--;

        document.getElementById("timer")
            .innerText = `⏳ ${timeLeft}`;

        if(timeLeft <= 0){

            clearInterval(timer);

            wrongAnswers++;

            nextQuestion();
        }

    },1000);
}

// Check Answer

function checkAnswer(button, selected){

    clearInterval(timer);

    let correct =
        quizData[currentQuestion].answer;

    let allOptions =
        document.querySelectorAll(".option");

    allOptions.forEach(btn => {

        btn.disabled = true;

        if(btn.innerText === correct){
            btn.classList.add("correct");
        }
    });

    if(selected === correct){

        score++;
        correctAnswers++;

    }else{

        wrongAnswers++;
        button.classList.add("wrong");
    }

    nextBtn.disabled = false;
}

// Progress Bar

function updateProgress(){

    let progress =
        (currentQuestion / quizData.length) * 100;

    document.getElementById("progress-bar")
        .style.width = progress + "%";
}

// Next Question

nextBtn.addEventListener("click", nextQuestion);

function nextQuestion(){

    currentQuestion++;

    if(currentQuestion < quizData.length){

        loadQuestion();

    }else{

        showResult();
    }
}

// 50-50 Lifeline

fiftyBtn.addEventListener("click", () => {

    let correct =
        quizData[currentQuestion].answer;

    let buttons =
        [...document.querySelectorAll(".option")];

    let wrongButtons =
        buttons.filter(btn =>
            btn.innerText !== correct
        );

    wrongButtons
        .sort(() => Math.random() - 0.5);

    wrongButtons[0].style.display = "none";
    wrongButtons[1].style.display = "none";

    fiftyBtn.disabled = true;
});

// Skip Question

skipBtn.addEventListener("click", () => {

    wrongAnswers++;

    nextQuestion();

    skipBtn.disabled = true;
});

// Result Screen

function showResult(){

    document.getElementById("quiz-screen")
        .classList.add("hide");

    document.getElementById("result-screen")
        .classList.remove("hide");

    document.getElementById("user-result")
        .innerText = `Player: ${username}`;

    document.getElementById("score")
        .innerText =
        `Score: ${score}/${quizData.length}`;

    let accuracy =
        Math.round(
            (correctAnswers / quizData.length) * 100
        );

    document.getElementById("correct-count")
        .innerText =
        `✅ Correct Answers: ${correctAnswers}`;

    document.getElementById("wrong-count")
        .innerText =
        `❌ Wrong Answers: ${wrongAnswers}`;

    document.getElementById("accuracy")
        .innerText =
        `📊 Accuracy: ${accuracy}%`;

    let badge = "";

    if(accuracy >= 90){
        badge = "🥇 Quiz Master";
        confetti();
    }
    else if(accuracy >= 70){
        badge = "🥈 Smart Learner";
    }
    else{
        badge = "🥉 Beginner";
    }

    document.getElementById("badge")
        .innerText = badge;

    let highScore =
        localStorage.getItem("highScore") || 0;

    if(score > highScore){

        localStorage.setItem(
            "highScore",
            score
        );
    }
}

// Restart Quiz

restartBtn.addEventListener("click", () => {

    location.reload();
});