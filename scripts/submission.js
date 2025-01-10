document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('form'); // Select the form element

    if (form) {
        // Maintain form visibility after a successful submission
        form.addEventListener('w-form-success', function() {
            // Ensure the form stays visible by removing any 'w-hidden' class and resetting styles
            form.classList.remove('w-hidden');
            form.style.display = 'flex';
            form.style.height = 'auto';
        });

        // Maintain form visibility after a failed submission
        form.addEventListener('w-form-fail', function() {
            // Ensure the form stays visible by removing any 'w-hidden' class and resetting styles
            form.classList.remove('w-hidden');
            form.style.display = 'flex';
            form.style.height = 'auto';
        });

        // Observe changes to the form's attributes to keep it visible
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
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
