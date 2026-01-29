document.addEventListener('DOMContentLoaded', () => {
    const incomingScreen = document.getElementById('incoming-screen');
    const activeScreen = document.getElementById('active-screen');
    const btnAnswer = document.getElementById('btn-answer');
    const btnEnd = document.getElementById('btn-end');
    const humanBtn = document.getElementById('human-btn');
    const redirectMsg = document.getElementById('redirect-message');
    const callAudio = document.getElementById('call-audio');
    const ringingAudio = document.getElementById('ringing-audio');
    const timerElement = document.getElementById('call-timer');

    // WhatsApp Configuration
    const whatsappNumber = '5551992856577';
    const whatsappMessage = encodeURIComponent('Recebi uma mensagem do canal de voz oficial da Chevrolet sobre as condições do meu IPVA 2026.');
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    let checkInterval;
    let seconds = 0;

    // Attempt to play ringing sound
    function playRinging() {
        ringingAudio.currentTime = 0;
        setTimeout(() => {
            ringingAudio.play().then(() => {
                document.body.classList.add('is-ringing');
            }).catch(e => {
                console.log("Autoplay blocked, waiting for interaction");
                document.body.addEventListener('click', () => {
                    ringingAudio.play();
                    document.body.classList.add('is-ringing');
                }, { once: true });
            });
        }, 1000);
    }

    playRinging();

    function startTimer() {
        checkInterval = setInterval(() => {
            seconds++;
            const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
            const secs = (seconds % 60).toString().padStart(2, '0');
            timerElement.textContent = `${mins}:${secs}`;

            // Show humanized button at 00:05
            if (seconds === 5) {
                humanBtn.style.display = 'block';
            }
        }, 1000);
    }

    function redirectToWhatsapp() {
        redirectMsg.style.display = 'block';
        setTimeout(() => {
            window.location.href = whatsappUrl;
        }, 1500); // Small delay to show "Redirecionando"
    }

    btnAnswer.addEventListener('click', () => {
        ringingAudio.pause();
        ringingAudio.currentTime = 0;
        document.body.classList.remove('is-ringing');
        incomingScreen.classList.remove('active');

        setTimeout(() => {
            activeScreen.classList.add('active');
            callAudio.play().catch(e => console.error("Audio play failed", e));
            startTimer();
        }, 500);
    });

    humanBtn.addEventListener('click', () => {
        callAudio.pause();
        redirectToWhatsapp();
    });

    const decorativeBtns = document.querySelectorAll('.control-item');

    function showInfoMessage() {
        const infoMsg = document.getElementById('info-message');
        if (!infoMsg) return;
        infoMsg.style.display = 'block';
        setTimeout(() => {
            infoMsg.style.display = 'none';
        }, 3000);
    }

    decorativeBtns.forEach(btn => {
        btn.addEventListener('click', showInfoMessage);
    });

    btnEnd.addEventListener('click', () => {
        callAudio.pause();
        showInfoMessage();
        redirectToWhatsapp();
    });

    callAudio.addEventListener('ended', () => {
        redirectToWhatsapp();
    });
});
