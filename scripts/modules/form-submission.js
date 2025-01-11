export function initFormSubmissionHandler() {
    const form = document.querySelector('form');
    const multistepWrapper = document.querySelector('.multistep-wrapper');
    const formDone = document.querySelector('.w-form-done');
    const formFail = document.querySelector('.w-form-fail');

    if (!form || !multistepWrapper) return;

    const keepFormVisible = () => {
        if (form.classList.contains('w-hidden') || form.style.display === 'none') {
            form.classList.remove('w-hidden');
            form.style.display = 'flex';
        }
    };

    const moveFormMessage = (element) => {
        if (element && element.style.display === 'block') {
            if (element.parentElement !== multistepWrapper) {
                multistepWrapper.appendChild(element);
            }
        }
    };

    const lockInputs = () => {
        console.log("Locking all inputs...");
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.disabled = true;
            input.style.opacity = '0.4';
        });
    };

    // Form visibility observer
    const formObserver = new MutationObserver(keepFormVisible);
    formObserver.observe(form, { attributes: true });

    // Success message observer
    if (formDone) {
        const doneObserver = new MutationObserver(() => {
            moveFormMessage(formDone);
            if (formDone.style.display === 'block') {
                lockInputs();
            }
        });
        doneObserver.observe(formDone, { attributes: true });
    }

    // Failure message observer
    if (formFail) {
        const failObserver = new MutationObserver(() => {
            moveFormMessage(formFail);
        });
        failObserver.observe(formFail, { attributes: true });
    }
}