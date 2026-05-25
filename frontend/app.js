// API endpoint URL
const API_URL = 'http://127.0.0.1:8000/api/transcribe/';

// DOM Elements
const recordBtn = document.getElementById('recordBtn');
const cancelBtn = document.getElementById('cancelBtn');
const btnText = document.getElementById('btnText');
const micIcon = document.getElementById('micIcon');
const stopIcon = document.getElementById('stopIcon');
const spinnerIcon = document.getElementById('spinnerIcon');

const statusPulse = document.getElementById('statusPulse');
const statusMessage = document.getElementById('statusMessage');
const timerDisplay = document.getElementById('timer');

const resultSection = document.getElementById('resultSection');
const transcriptionTextarea = document.getElementById('transcriptionTextarea');
const transcriptionLanguage = document.getElementById('transcriptionLanguage');
const copyBtn = document.getElementById('copyBtn');
const copyBtnText = document.getElementById('copyBtnText');

// State Variables
let mediaRecorder = null;
let audioChunks = [];
let recordState = 'idle'; // 'idle', 'recording', 'processing'
let timerInterval = null;
let secondsElapsed = 0;

// Initialize event listeners
recordBtn.addEventListener('click', handleRecordClick);
cancelBtn.addEventListener('click', cancelRecording);
copyBtn.addEventListener('click', copyToClipboard);

// Main Record Button Handler
async function handleRecordClick() {
    if (recordState === 'idle') {
        await startRecording();
    } else if (recordState === 'recording') {
        stopRecording();
    }
}

// Start Audio Recording
async function startRecording() {
    audioChunks = [];
    secondsElapsed = 0;
    updateTimerDisplay();

    try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Find supported mime type, default to standard browser recording
        let options = {};
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
            options = { mimeType: 'audio/webm;codecs=opus' };
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
            options = { mimeType: 'audio/mp4' };
        }

        mediaRecorder = new MediaRecorder(stream, options);
        
        mediaRecorder.addEventListener('dataavailable', event => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        });

        mediaRecorder.addEventListener('stop', async () => {
            // If the user cancelled, don't send anything
            if (recordState !== 'processing') {
                resetUI();
                return;
            }
            
            const mimeType = mediaRecorder.mimeType || 'audio/webm';
            // Determine file extension
            let extension = '.webm';
            if (mimeType.includes('mp4')) {
                extension = '.mp4';
            } else if (mimeType.includes('wav')) {
                extension = '.wav';
            } else if (mimeType.includes('ogg')) {
                extension = '.ogg';
            }

            const audioBlob = new Blob(audioChunks, { type: mimeType });
            await sendAudioToBackend(audioBlob, extension);
        });

        // Start recording
        mediaRecorder.start();
        
        // Update State & UI
        recordState = 'recording';
        recordBtn.classList.add('recording');
        btnText.textContent = 'Parar Gravação';
        
        micIcon.classList.add('hidden');
        stopIcon.classList.remove('hidden');
        
        statusPulse.classList.remove('hidden');
        statusMessage.textContent = 'Gravando consulta...';
        
        timerDisplay.classList.remove('hidden');
        cancelBtn.classList.remove('hidden');

        // Start timer
        startTimer();

    } catch (err) {
        console.error('Erro ao acessar microfone:', err);
        showError('Erro ao acessar o microfone. Verifique as permissões de áudio do seu navegador.');
    }
}

// Stop Audio Recording
function stopRecording() {
    if (mediaRecorder && recordState === 'recording') {
        recordState = 'processing';
        
        // Update UI to loading/processing state
        recordBtn.disabled = true;
        btnText.textContent = 'Processando áudio...';
        stopIcon.classList.add('hidden');
        spinnerIcon.classList.remove('hidden');
        
        statusMessage.textContent = 'Enviando e transcrevendo com Whisper local...';
        statusPulse.classList.add('hidden');
        cancelBtn.classList.add('hidden');
        
        // Stop timer
        clearInterval(timerInterval);
        timerDisplay.classList.add('hidden');
        
        // Stop recording (triggers 'stop' event listener)
        mediaRecorder.stop();
        
        // Stop microphone stream tracks to release the hardware
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
}

// Cancel Recording
function cancelRecording() {
    if (mediaRecorder && recordState === 'recording') {
        recordState = 'idle';
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        resetUI();
        statusMessage.textContent = 'Gravação cancelada.';
        setTimeout(() => {
            statusMessage.textContent = 'Pronto para gravar';
        }, 3000);
    }
}

// Send Audio Blob to Django Backend
async function sendAudioToBackend(blob, extension) {
    const formData = new FormData();
    formData.append('file', blob, `audio_record${extension}`);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || `Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        displayResult(data);
    } catch (err) {
        console.error('Erro de rede ou na transcrição:', err);
        showError(`Erro na transcrição: ${err.message}`);
    } finally {
        resetUI();
    }
}

// Display Transcription Results
function displayResult(data) {
    resultSection.classList.remove('hidden');
    transcriptionTextarea.value = data.text || 'Nenhum texto detectado.';
    
    // Capitalize language name/code
    const lang = data.language ? data.language.toUpperCase() : 'Não identificado';
    transcriptionLanguage.textContent = `Idioma detectado: ${lang}`;
    
    statusMessage.textContent = 'Transcrito com sucesso!';
    
    // Smooth scroll to results
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Reset UI elements to default state
function resetUI() {
    recordState = 'idle';
    recordBtn.disabled = false;
    recordBtn.classList.remove('recording');
    btnText.textContent = 'Iniciar Gravação';
    
    micIcon.classList.remove('hidden');
    stopIcon.classList.add('hidden');
    spinnerIcon.classList.add('hidden');
    
    statusPulse.classList.add('hidden');
    cancelBtn.classList.add('hidden');
    timerDisplay.classList.add('hidden');
    
    clearInterval(timerInterval);
}

// Show Error Message
function showError(message) {
    statusMessage.textContent = message;
    statusMessage.style.color = '#dc2626'; // Alert Red
    setTimeout(() => {
        statusMessage.style.color = ''; // Reset to default
        statusMessage.textContent = 'Pronto para gravar';
    }, 6000);
}

// Timer helpers
function startTimer() {
    timerInterval = setInterval(() => {
        secondsElapsed++;
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(secondsElapsed / 60);
    const seconds = secondsElapsed % 60;
    
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    
    timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;
}

// Copy to Clipboard feature
async function copyToClipboard() {
    const text = transcriptionTextarea.value;
    if (!text) return;

    try {
        await navigator.clipboard.writeText(text);
        
        // Success feedback animation
        copyBtnText.textContent = 'Copiado!';
        copyBtn.style.backgroundColor = 'var(--color-primary)';
        copyBtn.style.color = '#ffffff';
        
        setTimeout(() => {
            copyBtnText.textContent = 'Copiar Texto';
            copyBtn.style.backgroundColor = '';
            copyBtn.style.color = '';
        }, 2000);
    } catch (err) {
        console.error('Falha ao copiar texto:', err);
    }
}
