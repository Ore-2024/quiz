const quizQuestions = [];

let currentQuestionIndex = 0;
let score = 0;
let shuffledQuestions = [];
let currentOptions = [];
let answerClicked = false;

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function loadQuestion() {
    answerClicked = false;
    document.getElementById('feedback').textContent = '';
    if (currentQuestionIndex < shuffledQuestions.length) {
        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        document.getElementById('question').textContent = currentQuestion.Q;
        const optionsContainer = document.getElementById('options');
        optionsContainer.innerHTML = '';
        currentOptions = shuffleArray([...currentQuestion.options]);

        currentOptions.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.onclick = () => checkAnswer(option, currentQuestion.A, button);
            optionsContainer.appendChild(button);
        });

        document.getElementById('counter').textContent = `${currentQuestionIndex + 1}/${shuffledQuestions.length}`;
        updateNavigationButtons();
    } else {
        document.getElementById('question').textContent = `Create Quiz!`;
        document.getElementById('options').innerHTML = '';
        document.getElementById('counter').textContent = '';
        document.getElementById('prevBtn').disabled = true;
        document.getElementById('nextBtn').disabled = true;
    }
    document.getElementById('score').textContent = `Score: ${score}`;
}

function checkAnswer(selectedAnswer, correctAnswer, selectedButton) {
    if (answerClicked) return;
    answerClicked = true;

    const optionsButtons = document.querySelectorAll('#options button');
    optionsButtons.forEach(button => {
        button.disabled = true;
        if (button.textContent === correctAnswer) {
            button.classList.add('correct');
        }
    });

    if (selectedAnswer === correctAnswer) {
        score++;
        document.getElementById('feedback').textContent = 'Correct!';
        selectedButton.classList.add('correct');
    } else {
        document.getElementById('feedback').textContent = `Incorrect. The correct answer is: ${correctAnswer}`;
        selectedButton.classList.add('incorrect');
    }
    document.getElementById('score').textContent = `Score: ${score}`;
}

function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

function prevQuestion() {
    currentQuestionIndex--;
    loadQuestion();
}

function FinishQuestion() {
    document.getElementById('question').textContent = `Quiz Finished! Your final score is ${score}/${shuffledQuestions.length}`;
    document.getElementById('options').innerHTML = '';
    document.getElementById('counter').textContent = '';
    document.getElementById('prevBtn').disabled = true;
    document.getElementById('nextBtn').disabled = true;
}

function updateNavigationButtons() {
    document.getElementById('prevBtn').disabled = currentQuestionIndex === 0;
    document.getElementById('nextBtn').disabled = currentQuestionIndex === shuffledQuestions.length - 1;
    if (currentQuestionIndex === shuffledQuestions.length - 1) {
        document.getElementById('nextBtn').textContent = 'Finish';
        document.getElementById('nextBtn').onclick = () => loadQuestion();
    } else {
        document.getElementById('nextBtn').textContent = 'Next';
        document.getElementById('nextBtn').onclick = nextQuestion;
    }
}

document.getElementById('newQuizForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const newQuestionTextarea = document.getElementById('newQuestion');
    const newCorrectAnswerTextarea = document.getElementById('newCorrectAnswer');
    const newOption1Textarea = document.getElementById('newOption1');
    const newOption2Textarea = document.getElementById('newOption2');
    const newOption3Textarea = document.getElementById('newOption3');

    const newQuestion = newQuestionTextarea.value.trim();
    const newCorrectAnswer = newCorrectAnswerTextarea.value.trim();
    const newOption1 = newOption1Textarea.value.trim();
    const newOption2 = newOption2Textarea.value.trim();
    const newOption3 = newOption3Textarea.value.trim();

    if (newQuestion && newCorrectAnswer) {
        const newOptions = [newCorrectAnswer];
        if (newOption1) newOptions.push(newOption1);
        if (newOption2) newOptions.push(newOption2);
        if (newOption3) newOptions.push(newOption3);

        if (newOptions.length > 1) {
            quizQuestions.push({ Q: newQuestion, options: newOptions, A: newCorrectAnswer });
            newQuestionTextarea.value = '';
            newCorrectAnswerTextarea.value = '';
            newOption1Textarea.value = '';
            newOption2Textarea.value = '';
            newOption3Textarea.value = '';
            startQuiz();
            alert('New question added!');
        } else {
            alert('Please provide at least one incorrect option for a multiple-choice question.');
        }
    } else {
        alert('Please fill in the question and the correct answer.');
    }
});

function startQuiz() {
    shuffledQuestions = shuffleArray(quizQuestions);
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('feedback').textContent = '';
    loadQuestion();
}

startQuiz();
