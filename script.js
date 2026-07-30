// 1. Interatividade dos Cards (Expansão ao clicar)
function toggleCard(cardElement) {
    cardElement.classList.toggle('expanded');
    const badge = cardElement.querySelector('.expand-badge');
    if (cardElement.classList.contains('expanded')) {
        badge.textContent = 'Clique para fechar -';
    } else {
        badge.textContent = 'Clique para saber mais +';
    }
}

// 2. Acessibilidade: Alternar Tema Claro / Escuro
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    document.getElementById('theme-btn').textContent = isDark ? '☀️ Modo' : '🌙 Modo';
}

// 3. Acessibilidade: Ajuste de Tamanho da Fonte
let currentFontSize = 16;
function changeFontSize(delta) {
    currentFontSize = Math.min(Math.max(currentFontSize + delta, 12), 22);
    document.documentElement.style.setProperty('--font-size-base', currentFontSize + 'px');
}

// 4. Acessibilidade: Leitura de Texto por Voz (Web Speech API)
let isSpeaking = false;
function toggleReadAloud() {
    if (!('speechSynthesis' in window)) {
        alert('Seu navegador não suporta a funcionalidade de síntese de voz.');
        return;
    }

    const speakBtn = document.getElementById('speak-btn');

    if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        speakBtn.textContent = '🔊 Ler';
        speakBtn.style.backgroundColor = 'transparent';
    } else {
        const textToRead = document.getElementById('main-content').innerText;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.0;

        utterance.onend = () => {
            isSpeaking = false;
            speakBtn.textContent = '🔊 Ler';
            speakBtn.style.backgroundColor = 'transparent';
        };

        window.speechSynthesis.speak(utterance);
        isSpeaking = true;
        speakBtn.textContent = '⏹️ Parar';
        speakBtn.style.backgroundColor = 'var(--secondary)';
    }
}
