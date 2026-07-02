// --- 1. FUNCIONALIDADES DE ACESSIBILIDADE ---

// Controle de Tema
const btnTheme = document.getElementById('btn-theme');
btnTheme.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
});

// Controle de Tamanho da Fonte
const btnFont = document.getElementById('btn-font');
let currentScale = 1;
btnFont.addEventListener('click', () => {
    currentScale = currentScale === 1 ? 1.2 : currentScale === 1.2 ? 1.4 : 1;
    document.documentElement.style.setProperty('--font-scale', `${currentScale}rem`);
});

// Sintetizador de Voz (Ouvir o Texto de Introdução)
const btnSpeak = document.getElementById('btn-speak');
let isSpeaking = false;
const speech = new SpeechSynthesisUtterance();
speech.lang = 'pt-BR';

btnSpeak.addEventListener('click', () => {
    if (!isSpeaking) {
        const textToRead = document.getElementById('intro-text').innerText;
        speech.text = textToRead;
        window.speechSynthesis.speak(speech);
        btnSpeak.innerText = "🛑 Parar";
        isSpeaking = true;
    } else {
        window.speechSynthesis.cancel();
        btnSpeak.innerText = "🔊 Ouvir";
        isSpeaking = false;
    }
});

speech.onend = () => {
    btnSpeak.innerText = "🔊 Ouvir";
    isSpeaking = false;
};


// --- 2. LÓGICA DO QUIZ DE ÉTICA DIGITAL ---

const questions = [
    {
        question: "O que caracteriza uma atitude Ética no ambiente digital?",
        options: [
            "Compartilhar prints de conversas privadas sem autorização.",
            "Respeitar a propriedade intelectual e os dados alheios.",
            "Usar perfis fakes para comentar em postagens políticas.",
            "Baixar softwares pirateados se forem muito caros."
        ],
        answer: 1
    },
    {
        question: "A LGPD (Lei Geral de Proteção de Dados) serve para:",
        options: [
            "Garantir internet gratuita para toda a população.",
            "Controlar o tempo que os jovens passam nas redes sociais.",
            "Proteger os dados pessoais e a privacidade dos cidadãos brasileiros.",
            "Impedir que memes sejam criados sem autorização das pessoas."
        ],
        answer: 2
    },
    {
        question: "Ao receber uma notícia chocante em um app de mensagem, qual o comportamento ético correto?",
        options: [
            "Repassar imediatamente para todos os contatos e grupos.",
            "Ignorar totalmente, mesmo que seja sobre segurança pública.",
            "Verificar em fontes confiáveis e agências de checagem antes de repassar.",
            "Apagar o aplicativo do celular por segurança."
        ],
        answer: 3
    }
];

let currentQuestionIndex = 0;
let score = 0;
let playerName = "";

// Elementos do DOM do Quiz
const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const resultScreen = document.getElementById('result-screen');
const inputName = document.getElementById('player-name');
const btnStart = document.getElementById('btn-start');
const btnRestart = document.getElementById('btn-restart');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progress = document.getElementById('progress');
const playerScoreMsg = document.getElementById('player-score-msg');
const rankingBody = document.getElementById('ranking-body');

btnStart.addEventListener('click', startQuiz);
btnRestart.addEventListener('click', restartQuiz);

function startQuiz() {
    playerName = inputName.value.trim();
    if (playerName === "") {
        alert("Por favor, digite seu nome para começar!");
        return;
    }
    startScreen.classList.add('hide');
    questionScreen.classList.remove('hide');
    showQuestion();
}

function showQuestion() {
    resetQuestionState();
    let currentQuestion = questions[currentQuestionIndex];
    questionText.innerText = currentQuestion.question;
    
    // Atualiza barra de progresso
    const progressPercent = ((currentQuestionIndex) / questions.length) * 100;
    progress.style.width = `${progressPercent}%`;

    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectAnswer(index));
        optionsContainer.appendChild(button);
    });
}

function resetQuestionState() {
    while (optionsContainer.firstChild) {
        optionsContainer.removeChild(optionsContainer.firstChild);
    }
}

function selectAnswer(selectedIndex) {
    if (selectedIndex === questions[currentQuestionIndex].answer) {
        score += 10; // Cada resposta certa vale 10 pontos
    }
    
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    questionScreen.classList.add('hide');
    resultScreen.classList.remove('hide');
    progress.style.width = `100%`;
    
    playerScoreMsg.innerText = `${playerName}, você fez ${score} pontos!`;
    
    saveScore(playerName, score);
    displayRanking();
}

function saveScore(name, finalScore) {
    let ranking = JSON.parse(localStorage.getItem('eticaQuizRanking')) || [];
    ranking.push({ name: name, score: finalScore });
    // Ordena do maior para o menor score
    ranking.sort((a, b) => b.score - a.score);
    // Salva apenas o top 5 para não sobrecarregar
    ranking = ranking.slice(0, 5);
    localStorage.setItem('eticaQuizRanking', JSON.stringify(ranking));
}

function displayRanking() {
    rankingBody.innerHTML = "";
    const ranking = JSON.parse(localStorage.getItem('eticaQuizRanking')) || [];
    
    if (ranking.length === 0) {
        rankingBody.innerHTML = `<tr><td colspan="3" style="text-align:center;">Nenhum registro encontrado.</td></tr>`;
        return;
    }

    ranking.forEach((player, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}º</td>
            <td>${player.name}</td>
            <td>${player.score} pts</td>
        `;
        rankingBody.appendChild(row);
    });
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    resultScreen.classList.add('hide');
    startScreen.classList.remove('hide');
    inputName.value = "";
}
