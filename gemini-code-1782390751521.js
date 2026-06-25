// Seleção de elementos
const accButton = document.getElementById('acc-button');
const accMenu = document.getElementById('acc-menu');
const btnTheme = document.getElementById('btn-theme');
const btnFont = document.getElementById('btn-font');
const btnSpeak = document.getElementById('btn-speak');
const mainContent = document.getElementById('main-content');

// 1. Abrir/Fechar Menu de Acessibilidade
accButton.addEventListener('click', () => {
    accMenu.classList.toggle('hidden');
});

// Fechar o menu ao clicar fora dele
document.addEventListener('click', (event) => {
    if (!accButton.contains(event.target) && !accMenu.contains(event.target)) {
        accMenu.classList.add('hidden');
    }
});

// 2. Tema Claro/Escuro
btnTheme.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
});

// 3. Controle de Tamanho de Fonte
let fontSizeState = 0; // 0: Normal, 1: Grande, 2: Muito Grande
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

// 4. Ouvir Texto (Sintetizador de Voz)
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

    // Filtra apenas o texto legível para evitar ler links soltos ou legendas quebradas
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