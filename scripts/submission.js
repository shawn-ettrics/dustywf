document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector('form'); // Select the form element
    const multistepWrapper = document.querySelector('.multistep-wrapper'); // Select the multistep-wrapper

    if (form && multistepWrapper) {
        // Function to move success and failure messages
        const moveFormMessages = () => {
            console.log("Attempting to move form messages...");
            const formDone = form.querySelector('.w-form-done');
            const formFail = form.querySelector('.w-form-fail');

            if (formDone) {
                console.log("Found .w-form-done");
                if (formDone.parentElement !== multistepWrapper) {
                    multistepWrapper.appendChild(formDone);
                    console.log(".w-form-done moved to multistep-wrapper");
                }
            } else {
                console.log(".w-form-done not found");
            }

            if (formFail) {
                console.log("Found .w-form-fail");
                if (formFail.parentElement !== multistepWrapper) {
                    multistepWrapper.appendChild(formFail);
                    console.log(".w-form-fail moved to multistep-wrapper");
                }
            } else {
                console.log(".w-form-fail not found");
            }
        };

        // Handle form submission success
        form.addEventListener('w-form-success', function () {
            console.log("w-form-success event triggered");

            // Ensure the form stays visible
            form.classList.remove('w-hidden');
            form.style.display = 'flex';
            form.style.height = 'auto';

            // Disable all input fields and lower opacity
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.disabled = true;
                input.style.opacity = '0.4';
            });

            // Move success and failure messages
            setTimeout(() => {
                moveFormMessages();
            }, 200); // Slight delay to allow Webflow to complete DOM updates
        });

        // Handle form submission failure
        form.addEventListener('w-form-fail', function () {
            console.log("w-form-fail event triggered");

            // Ensure the form stays visible
            form.classList.remove('w-hidden');
            form.style.display = 'flex';
            form.style.height = 'auto';

            // Move success and failure messages
            setTimeout(() => {
                moveFormMessages();
            }, 200);
        });

        // Fallback: Listen for the generic submit event
        form.addEventListener('submit', function () {
            console.log("Form submit event triggered");
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
    } else {
        console.log("Form or multistep-wrapper not found in the DOM");
    }
});