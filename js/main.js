document.addEventListener('DOMContentLoaded', () => {

    // --- THEME TOGGLE LOGIC ---
    const themeToggle = document.getElementById('checkbox');
    const body = document.body;

    const setTheme = (theme) => {
        let currentParticlesConfig;
        if (theme === 'light') {
            body.classList.add('light-mode');
            themeToggle.checked = true;
            currentParticlesConfig = lightParticleConfig;
        } else {
            body.classList.remove('light-mode');
            themeToggle.checked = false;
            currentParticlesConfig = particleConfig; // Dark mode config
        }
        if (window.tsParticles) {
            tsParticles.load("particles-js", currentParticlesConfig);
        }
    };

    const savedTheme = localStorage.getItem('theme');
    // Default to 'dark' if no theme is saved. Otherwise, use the saved theme.
    setTheme(savedTheme || 'dark');

    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        setTheme(newTheme);
    });


    // --- STYLISH CURSOR LOGIC ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (window.innerWidth > 768) { // Only run on non-mobile devices
        window.addEventListener('mousemove', e => {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
            cursorFollower.style.left = `${e.clientX}px`;
            cursorFollower.style.top = `${e.clientY}px`;
        });

        document.querySelectorAll('a, button, .slider, input, textarea').forEach(el => {
            el.addEventListener('mouseenter', () => cursorFollower.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hovered'));
        });
    }


    // --- AI BIO GENERATOR (HOME PAGE) ---
    const aiBioBtn = document.getElementById('ai-generate-bio-btn');
    const aiBioText = document.getElementById('ai-bio-text');
    
    if (aiBioBtn) {
        aiBioBtn.addEventListener('click', async () => {
            aiBioBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
            aiBioBtn.disabled = true;
            try {
                const response = await fetch('/.netlify/functions/openaichat', {
                    method: 'POST',
                    body: JSON.stringify({ userMessage: "Generate a short, one-paragraph professional bio for Victoria Wilson-Sey, a junior web developer and data-driven problem solver." }),
                });
                const data = await response.json();
                if (data.reply) {
                    aiBioText.textContent = data.reply;
                } else {
                    throw new Error("No reply from AI for bio.");
                }
            } catch (error) {
                aiBioText.textContent = "Victoria is a passionate developer skilled in building innovative web solutions with a keen eye for data and user experience.";
                console.error("AI Bio Error:", error);
            } finally {
                aiBioBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Another Bio';
                aiBioBtn.disabled = false;
            }
        });
    }


    // --- AI CONTACT MESSAGE GENERATOR ---
    const aiGenerateBtn = document.getElementById('ai-generate-btn');
    if (aiGenerateBtn) {
        aiGenerateBtn.addEventListener('click', async () => {
            const name = document.getElementById('name').value;
            const messageTextarea = document.getElementById('message');
            if (!name) {
                alert('Please enter your name first.');
                return;
            }
            aiGenerateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Writing...';
            aiGenerateBtn.disabled = true;
            try {
                const response = await fetch('/.netlify/functions/aicontact', {
                    method: 'POST',
                    body: JSON.stringify({ name }),
                });
                const data = await response.json();
                if (data.draft) {
                    messageTextarea.value = data.draft;
                } else {
                    throw new Error('No draft received from AI');
                }
            } catch (error) {
                console.error('AI Draft Error:', error);
                messageTextarea.value = 'Sorry, the AI assistant is currently unavailable. Please write your message manually.';
            } finally {
                aiGenerateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate with AI';
                aiGenerateBtn.disabled = false;
            }
        });
    }


    // --- AI CHATBOT LOGIC ---
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotBody = document.getElementById('chatbot-body');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');

    if (chatbotToggle) {
        const toggleChatbot = () => chatbotWindow.classList.toggle('open');
        
        chatbotToggle.addEventListener('click', () => {
            toggleChatbot();
            if (chatbotWindow.classList.contains('open') && chatbotBody.children.length === 0) {
                addMessage('bot', "Hello! I'm an AI assistant. Ask me about Victoria's skills or projects.");
            }
        });

        chatbotClose.addEventListener('click', toggleChatbot);

        const addMessage = (sender, text) => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${sender}`;
            messageDiv.innerHTML = text; // Use innerHTML for thinking animation spans
            chatbotBody.appendChild(messageDiv);
            chatbotBody.scrollTop = chatbotBody.scrollHeight; // Auto-scroll
        };

        const handleSendMessage = async () => {
            const userMessage = chatbotInput.value.trim();
            if (!userMessage) return;

            addMessage('user', userMessage);
            chatbotInput.value = '';
            addMessage('bot', '<div class="thinking"><span></span><span></span><span></span></div>'); // Thinking animation

            try {
                const response = await fetch('/.netlify/functions/openaichat', {
                    method: 'POST',
                    body: JSON.stringify({ userMessage }),
                });
                const data = await response.json();
                chatbotBody.removeChild(chatbotBody.lastChild); // Remove thinking animation
                addMessage('bot', data.reply);
            } catch (error) {
                chatbotBody.removeChild(chatbotBody.lastChild);
                addMessage('bot', "Sorry, I'm having trouble connecting right now.");
                console.error('Chatbot Error:', error);
            }
        };

        chatbotSend.addEventListener('click', handleSendMessage);
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSendMessage();
        });
    }
});
