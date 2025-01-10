document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector('form'); // Select the form element
    const multistepWrapper = document.querySelector('.multistep-wrapper'); // Select the multistep-wrapper

    if (form && multistepWrapper) {
        // Function to move success and failure messages
        const moveFormMessages = () => {
            const formDone = form.querySelector('.w-form-done');
            const formFail = form.querySelector('.w-form-fail');

            if (formDone && formDone.parentElement !== multistepWrapper) {
                multistepWrapper.appendChild(formDone);
            }

            if (formFail && formFail.parentElement !== multistepWrapper) {
                multistepWrapper.appendChild(formFail);
            }
        };

        // Maintain form visibility and handle success
        form.addEventListener('w-form-success', function () {
            console.log("Form submitted successfully.");

            // Ensure the form stays visible
            form.classList.remove('w-hidden');
            form.style.display = 'flex';
            form.style.height = 'auto';

            // Move success and failure messages
            moveFormMessages();

            // Disable all input fields and lower opacity
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.disabled = true; // Disable the field
                input.style.opacity = '0.4'; // Lower the font opacity
            });
        });

        // Maintain form visibility and handle failure
        form.addEventListener('w-form-fail', function () {
            console.log("Form submission failed.");

            // Ensure the form stays visible
            form.classList.remove('w-hidden');
            form.style.display = 'flex';
            form.style.height = 'auto';

            // Move success and failure messages
            moveFormMessages();
        });

        // Observe changes to the form's attributes to keep it visible
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (
                    mutation.type === 'attributes' &&
                    (mutation.attributeName === 'style' || mutation.attributeName === 'class')
                ) {
                    // Ensure form visibility by resetting styles
                    form.style.display = 'flex';
                    form.style.height = 'auto';
                }
            });
        });

        // Start observing the form for changes to its attributes
        observer.observe(form, { attributes: true });
    }
});