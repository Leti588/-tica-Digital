// Elementos de Acessibilidade
const accButton = document.getElementById('acc-button');
const accMenu = document.getElementById('acc-menu');
const btnTheme = document.getElementById('btn-theme');
const btnFont = document.getElementById('btn-font');
const btnSpeak = document.getElementById('btn-speak');
const mainContent = document.getElementById('main-content');

// Menu Aberto/Fechado
accButton.addEventListener('click', () => accMenu.classList.toggle('hidden'));
document.addEventListener('click', (e) => {
    if (!accButton.contains(e.target) && !accMenu.contains(e.target)) accMenu.classList.add('hidden');
});

// Alternador de Temas
btnTheme.addEventListener('click', () => {
    document.documentElement.getAttribute('data-theme') === 'dark' 
        ? document.documentElement.removeAttribute('data-theme') 
        : document.documentElement.setAttribute('data-theme', 'dark');
});

// Fonte Inteligente
let fontState = 0;
btnFont.addEventListener('click', () => {
    fontState = (fontState + 1) % 3;
    const sizes = ['15px', '18px', '21px'];
    const labels = ['Aumentar_Fonte', 'Fonte_Grande', 'Fonte_Padrão'];
    document.documentElement.style.setProperty('--base-font-size', sizes[fontState]);
    btnFont.textContent = `> ${labels[fontState]}`;
});

// Leitor de Tela Sintetizado
let isSpeaking = false;
let synth = window.speechSynthesis;
btnSpeak.addEventListener('click', () => {
    if (isSpeaking) {
        synth.cancel();
        isSpeaking = false;
        btnSpeak.textContent = "> Ouvir_Texto";
        return;
    }
    const text = mainContent.innerText;
    if (text.trim() !== "") {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.onend = () => { isSpeaking = false; btnSpeak.textContent = "> Ouvir_Texto"; };
        isSpeaking = true;
        btnSpeak.textContent = "> Parar_Áudio";
        synth.speak(utterance);
    }
});

// ==========================================
// GAME ENGINE: DILEMAS ÉTICOS INTERATIVOS
// ==========================================

const gameQuestions = [
    {
        question: "Você encontrou uma vulnerabilidade crítica no banco de dados de uma grande empresa que expõe dados sensíveis de milhares de usuários. Qual seu comando?",
        options: [
            { text: "Enviar um relatório detalhado e secreto ao setor de segurança deles (Divulgação Responsável).", score: 10, explain: "CORRETO. A conduta ética dita que reportar a falha diretamente ajuda a mitigar o risco sem expor as vítimas a criminosos." },
            { text: "Publicar no Twitter/X imediatamente para expor a incompetência da empresa e ganhar relevância técnica.", score: 0, explain: "ERRADO. Fazer isso coloca milhões de usuários em risco imediato, pois hackers maliciosos aproveitarão a falha antes do conserto." },
            { text: "Vender a informação para fóruns ocultos. Afinal, conhecimento técnico deve ser rentabilizado.", score: 0, explain: "ANTIÉTICO E ILEGAL. O roubo ou comercialização de brechas cibernéticas de terceiros viola diretamente as leis civis e a integridade social." }
        ]
    },
    {
        question: "Sua equipe de engenharia está alimentando um algoritmo de recrutamento e nota-se que a IA aprendeu a filtrar negativamente candidatos de bairros periféricos devido aos dados do passado.",
        options: [
            { text: "Deixar o algoritmo rodar. Se os dados mostram isso, a IA está apenas operando com lógica computacional pura.", score: 0, explain: "ERRADO. Isso automatiza e perpetua injustiças e preconceitos estruturais históricos do mundo real." },
            { text: "Interromper o processo de triagem automatizada, auditar os dados históricos e balancear os vieses de treinamento.", score: 10, explain: "CORRETO. Sistemas justos exigem supervisão humana contínua para evitar vieses e discriminação matemática." }
        ]
    },
    {
        question: "Um link suspeito foi enviado em seu grupo familiar expondo dados falsos, mas altamente apelativos, sobre um escândalo político. O que você faz?",
        options: [
            { text: "Não compartilha, pesquisa em portais de checagem de fatos e alerta o grupo sobre a desinformação.", score: 10, explain: "CORRETO. Interromper a cadeia de fake news com fontes verificadas é um pilar crucial da cidadania digital ativa." },
            { text: "Encaminha para outros grupos rapidamente. Se for verdade, as pessoas precisam saber logo.", score: 0, explain: "ERRADO. Compartilhar conteúdos sem checagem espalha pânico, deforma debates democráticos e quebra a confiança nas redes." }
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
const btnNextQuestion = document.getElementById('btn-next-question');
const questionText = document.getElementById('game-question-text');
const optionsContainer = document.getElementById('game-options');
const currentQuestionNum = document.getElementById('game-current-question');
const feedbackContainer = document.getElementById('game-feedback');
const feedbackText = document.getElementById('game-feedback-text');
const resultText = document.getElementById('game-result-text');

btnStartGame.addEventListener('click', startGame);
btnRestartGame.addEventListener('click', startGame);
btnNextQuestion.addEventListener('click', advanceGame);

function startGame() {
    currentQuestionIndex = 0;
    totalScore = 0;
    screenStart.classList.add('hidden');
    screenResult.classList.add('hidden');
    screenPlay.classList.remove('hidden');
    loadQuestion();
}

function loadQuestion() {
    feedbackContainer.classList.add('hidden');
    optionsContainer.innerHTML = "";
    
    const currentQuestion = gameQuestions[currentQuestionIndex];
    currentQuestionNum.textContent = currentQuestionIndex + 1;
    questionText.textContent = currentQuestion.question;

    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option.text;
        button.classList.add('option-btn');
        // Ao clicar, aciona o novo sistema de interatividade e feedback
        button.addEventListener('click', (e) => selectOption(e, option, currentQuestion));
        optionsContainer.appendChild(button);
    });
}

function selectOption(event, selectedOption, currentQuestion) {
    // Congela todos os botões daquela pergunta para impedir múltiplos cliques
    const allButtons = optionsContainer.querySelectorAll('.option-btn');
    allButtons.forEach(btn => btn.disabled = true);

    totalScore += selectedOption.score;

    // Destaca de forma interativa a resposta certa em verde e a errada selecionada em vermelho
    if (selectedOption.score === 10) {
        event.target.classList.add('correct');
    } else {
        event.target.classList.add('wrong');
        // Encontra o botão que tinha a resposta certa para mostrar ao usuário
        const correctIndex = currentQuestion.options.findIndex(opt => opt.score === 10);
        if (correctIndex !== -1) {
            allButtons[correctIndex].classList.add('correct');
        }
    }

    // Exibe o diagnóstico com efeito interativo na tela
    feedbackText.innerHTML = `<strong>[DIAGNÓSTICO_DO_SISTEMA]:</strong><br>${selectedOption.explain}`;
    feedbackContainer.classList.remove('hidden');
}

function advanceGame() {
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
    
    let report = "";
    if (totalScore === 30) {
        report = "Sua diretriz moral está intacta. Você prioriza a integridade, combate a discriminação de dados e defende a segurança pública digital.";
    } else if (totalScore >= 10) {
        report = "Parâmetros instáveis. Você entende os riscos, mas tomou decisões que poderiam expor sistemas ou causar danos colaterais a terceiros.";
    } else {
        report = "SISTEMA COMPROMETIDO. Suas decisões favorecem ataques, vazamentos de privacidade e disseminação de vieses. Recomendado reciclar conceitos de cidadania digital.";
    }

    resultText.innerHTML = `<strong>Pontuação Final: ${totalScore} / 30 Pontos</strong><br><br>${report}`;
}
