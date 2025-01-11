document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector('form'); // Select the form element
    const multistepWrapper = document.querySelector('.multistep-wrapper'); // Select the multistep-wrapper

    if (form && multistepWrapper) {
        // Function to keep the form visible
        const keepFormVisible = () => {
            form.classList.remove('w-hidden'); // Remove Webflow's hidden class
            form.style.display = 'flex'; // Ensure the form is displayed as flex
            form.style.height = 'auto'; // Reset the height to auto
        };

        // Function to move success and failure messages
        const moveFormMessage = (element) => {
            if (element && element.style.display === 'block') {
                // Only move if it is visible
                if (element.parentElement !== multistepWrapper) {
                    multistepWrapper.appendChild(element);
                    console.log(`${element.className} moved to multistep-wrapper`);
                }
            }
        };

        // Observe changes to the form's attributes
        const formObserver = new MutationObserver(() => {
            keepFormVisible(); // Ensure the form stays visible
        });

        formObserver.observe(form, { attributes: true });

        // Observe changes to .w-form-done and .w-form-fail
        const messageObserver = new MutationObserver(() => {
            const formDone = form.querySelector('.w-form-done');
            const formFail = form.querySelector('.w-form-fail');

            moveFormMessage(formDone);
            moveFormMessage(formFail);
        });

        messageObserver.observe(form, {
            childList: true, // Watch for changes to child elements
            subtree: true,   // Watch within the subtree of the form
        });
    } else {
        console.log("Form or multistep-wrapper not found in the DOM");
    }
});