document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector('form'); // Select the form element
    const multistepWrapper = document.querySelector('.multistep-wrapper'); // Select the multistep-wrapper
    const formDone = document.querySelector('.w-form-done');
    const formFail = document.querySelector('.w-form-fail');

    if (form && multistepWrapper) {
        // Function to keep the form visible
        const keepFormVisible = () => {
            if (form.classList.contains('w-hidden') || form.style.display === 'none') {
                form.classList.remove('w-hidden'); // Remove Webflow's hidden class
                form.style.display = 'flex'; // Ensure the form is displayed as flex
                form.style.height = 'auto'; // Reset the height to auto
                console.log("Form visibility maintained.");
            }
        };

        // Function to move success and failure messages
        const moveFormMessage = (element) => {
            if (element && element.style.display === 'block') {
                // Only move if the element is visible
                if (element.parentElement !== multistepWrapper) {
                    multistepWrapper.appendChild(element);
                    console.log(`${element.className} moved to multistep-wrapper`);
                }
            }
        };

        // Function to lock inputs and adjust opacity
        const lockInputs = () => {
            console.log("Locking all inputs...");
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.disabled = true; // Disable the field
                input.style.opacity = '0.4'; // Lower the font opacity
            });
        };

        // Observe the form's attributes for visibility changes
        const formObserver = new MutationObserver(() => {
            keepFormVisible();
        });

        formObserver.observe(form, { attributes: true });

        // Observe .w-form-done for visibility changes
        if (formDone) {
            const doneObserver = new MutationObserver(() => {
                moveFormMessage(formDone);

                // Lock inputs when .w-form-done becomes visible
                if (formDone.style.display === 'block') {
                    lockInputs();
                }
            });

            doneObserver.observe(formDone, { attributes: true });
        }

        // Observe .w-form-fail for visibility changes
        if (formFail) {
            const failObserver = new MutationObserver(() => {
                moveFormMessage(formFail);
            });

            failObserver.observe(formFail, { attributes: true });
        }

        console.log("Observers initialized for specific elements.");
    } else {
        console.log("Form, multistep-wrapper, or required elements not found in the DOM");
    }
});