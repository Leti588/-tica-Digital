// Seleção de elementos fundamentais do DOM
const accButton = document.getElementById('acc-button');
const accMenu = document.getElementById('acc-menu');
const btnTheme = document.getElementById('btn-theme');
const btnFont = document.getElementById('btn-font');
const btnSpeak = document.getElementById('btn-speak');
const mainContent = document.getElementById('main-content');

// 1. Abrir/Fechar Painel de Acessibilidade
accButton.addEventListener('click', () => {
    accMenu.classList.toggle('hidden');
});

document.addEventListener('click', (event) => {
    if (!accButton.contains(event.target) && !accMenu.contains(event.target)) {
        accMenu.classList.add('hidden');
    }
});

// 2. Alternar entre Tema Claro e Escuro
btnTheme.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
});

// 3. Controle Gradual do Tamanho de Fonte (3 Estágios)
let fontSizeState = 0; 
btnFont.addEventListener('click', () => {
    fontSizeState = (fontSizeState + 1) % 3;
    
    if (fontSizeState === 0) {
        document.documentElement.style.setProperty('--base-font-size', '16px');
        btnFont.textContent = "Aumentar Fonte";
    } else if (fontSizeState === 1) {
        document.documentElement.style.setProperty('--base-font-size', '19px');
        btnFont.textContent = "Fonte Grande";
    } else {
        document.documentElement.style.setProperty('--base-font-size', '22px');
        btnFont.textContent = "Fonte Padrão";
    }
});

// 4. Sintetizador de Voz (Ouvir o texto do artigo de forma limpa)
let isSpeaking = false;
let synth = window.speechSynthesis;
let utterance;

btnSpeak.addEventListener('click', () => {
    if (isSpeaking) {
        synth.cancel();
        isSpeaking = false;
        btnSpeak.textContent = "Ouvir Texto";
        return;
    }

    // Filtra e coleta os textos estruturais da página de forma inteligível
    const textToRead = mainContent.innerText;

    if (textToRead.trim() !== "") {
        utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = 'pt-BR';

        utterance.onend = () => {
            isSpeaking = false;
            btnSpeak.textContent = "Ouvir Texto";
        };

        utterance.onerror = () => {
            isSpeaking = false;
            btnSpeak.textContent = "Ouvir Texto";
        };

        isSpeaking = true;
        btnSpeak.textContent = "Parar Áudio";
        synth.speak(utterance);
    }
});

// ==========================================
// LÓGICA DO JOGUINHO DE DILEMAS ÉTICOS
// ==========================================

const gameQuestions = [
    {
        question: "Você encontrou uma brecha de segurança no site de uma pequena empresa que expõe os dados dos clientes. O que você faz?",
        options: [
            { text: "Avisar a empresa discretamente por e-mail para que possam consertar.", score: 10 },
            { text: "Divulgar a brecha nas redes sociais para ganhar seguidores e expor a empresa.", score: 0 },
            { text: "Ignorar completamente, pois o problema não é meu.", score: 5 }
        ]
    },
    {
        question: "Um amigo te enviou um link com prints de conversas privadas vazadas de um colega de classe. Qual a sua atitude?",
        options: [
            { text: "Apagar a mensagem e aconselhar seu amigo a não compartilhar conteúdos que firam a privacidade alheia.", score: 10 },
            { text: "Encaminhar para outros grupos de amigos, afinal, a internet é pública.", score: 0 },
            { text: "Apenas ler por curiosidade e não repassar a ninguém.", score: 5 }
        ]
    },
    {
        question: "Você está criando um sistema de IA para triagem de currículos e percebe que ela está descartando mulheres porque no histórico passado só homens ocupavam o cargo. O que fazer?",
        options: [
            { text: "Deixar como está, pois se a IA aprendeu com o passado, ela deve estar certa.", score: 0 },
            { text: "Ajustar os dados de treino e aplicar filtros éticos para garantir equidade de gênero na seleção.", score: 10 },
            { text: "Desativar o sistema e voltar a fazer tudo no papel sem tentar corrigir a tecnologia.", score: 5 }
        ]
    }
];

let currentQuestionIndex = 0;
let totalScore = 0;

const screenStart = document.getElementById('game-screen-start');
const screenPlay = document.getElementById('game-screen-play');
const screenResult = document.getElementById('game-screen-result');
const btnStartGame = document.getElementById('btn-start-game');
const btnRestartGame = document.getElementById('btn-restart-game');
const questionText = document.getElementById('game-question-text');
const optionsContainer = document.getElementById('game-options');
const currentQuestionNum = document.getElementById('game-current-question');
const resultText = document.getElementById('game-result-text');

btnStartGame.addEventListener('click', startGame);
btnRestartGame.addEventListener('click', startGame);

function startGame() {
    currentQuestionIndex = 0;
    totalScore = 0;
    screenStart.classList.add('hidden');
    screenResult.classList.add('hidden');
    screenPlay.classList.remove('hidden');
    loadQuestion();
}

function loadQuestion() {
    optionsContainer.innerHTML = "";
    const currentQuestion = gameQuestions[currentQuestionIndex];
    
    currentQuestionNum.textContent = currentQuestionIndex + 1;
    questionText.textContent = currentQuestion.question;

    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option.text;
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectOption(option.score));
        optionsContainer.appendChild(button);
    });
}

function selectOption(score) {
    totalScore += score;
    currentQuestionIndex++;

    if (currentQuestionIndex < gameQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    screenPlay.classList.add('hidden');
    screenResult.classList.remove('hidden');
    
    let feedback = "";
    if (totalScore === 30) {
        feedback = "Excelente! Sua bússola moral está perfeitamente alinhada com as melhores práticas da Ética Digital. Você protege a privacidade, exige justiça nos dados e promove o respeito mútuo.";
    } else if (totalScore >= 15) {
        feedback = "Bom! Você compreende a importância da ética, mas às vezes adota uma postura passiva diante de problemas digitais. Lembre-se que agir ativamente também faz parte da cidadania digital.";
    } else {
        feedback = "Atenção! Suas escolhas podem prejudicar a privacidade e os direitos de outras pessoas na internet. Vale a pena refletir sobre o impacto das nossas pegadas e ações digitais.";
    }

    resultText.innerHTML = `<strong>Pontuação: ${totalScore} pontos.</strong><br><br>${feedback}`;
}
