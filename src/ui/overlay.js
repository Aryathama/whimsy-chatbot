export function setupUI(onWordSubmit, onReset) {
    const input = document.querySelector('#word-input');
    const status = document.querySelector('#status');
    const resetBtn = document.querySelector('#reset-btn');

    input.autocomplete = 'off';
    input.spellcheck = false;

    // User Input
    // const updateUI = (state, word = '') => {
    //     if (state === 'idle') {
    //         status.innerHTML = `status: idle`;
    //         status.style.color = '#1a1a1a'; // Warna standar
    //     } else if (state === 'spawning') {
    //         status.innerHTML = `status: spawning "${word}"...`;
    //         status.style.color = '#1a1a1a';
    //     } else if (state === 'active') {
    //         status.innerHTML = `status: <span style="color: #2ecc71;">active</span>`;
    //     }
    // };

    // LLM Input
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

    // User Input
    // input.addEventListener('keydown', (e) => {
    //     if (e.key === 'Enter') {
    //         const word = input.value.toLowerCase().trim();
    //         if (word.length > 0) {
    //             updateUI('spawning', word);
    //             onWordSubmit(word);
                
    //             // Pindah ke 'active' setelah animasi spawn selesai
    //             setTimeout(() => {
    //                 input.value = '';
    //                 updateUI('active');
    //             }, 1000);
    //         }
    //     }
    // });

    // LLM Input
    input.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            const word = input.value.toLowerCase().trim();
            if (word.length > 0) {
                input.disabled = true;
                updateUI('thinking');
                
                await onWordSubmit(word); 
                
                input.value = '';
                input.disabled = false;
                updateUI('active');
                input.focus();
            }
        }
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            onReset();
            updateUI('idle');
        });
    }

    document.addEventListener('click', () => input.focus());
}