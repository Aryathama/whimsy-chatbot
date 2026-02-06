export function setupUI(onWordSubmit, onReset) {
    const input = document.querySelector('#word-input');
    const status = document.querySelector('#status');
    const resetBtn = document.querySelector('#reset-btn');
    const chatForm = document.querySelector('#chat-form');

    input.autocomplete = 'off';
    input.spellcheck = false;

    const updateUI = (state) => {
        if (state === 'idle') {
            status.innerHTML = `status: idle`;
            status.style.color = '#1a1a1a';
        } else if (state === 'thinking') {
            status.innerHTML = 'status: <span style="color: #e67e22;">thinking...</span>';
        } else if (state === 'active') {
            status.innerHTML = 'status: <span style="color: #2ecc71;">active</span>';
        }
    };

    updateUI('idle');

    const processMessage = async () => {
        const word = input.value.toLowerCase().trim();
        if (word.length > 0 && !input.disabled) {
            input.disabled = true;
            updateUI('thinking');
            
            input.blur(); 

            await onWordSubmit(word); 
            
            input.value = '';
            input.disabled = false;
            updateUI('active');
            
            if (window.innerWidth > 600) input.focus();
        }
    };

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
        }
    });

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            processMessage();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            onReset();
            updateUI('idle');
        });
    }

    document.addEventListener('click', () => {
        if (window.innerWidth > 600) input.focus();
    });
}