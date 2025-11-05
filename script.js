<script>
    /**
     * Updates the custom error message div with a list of validation errors.
     * @param {string[]} messages - Array of error strings.
     */
    function displayErrors(messages) {
        const errorDiv = document.getElementById('validation-messages');
        if (messages.length > 0) {
            // Display errors in an unordered list
            errorDiv.innerHTML = '<strong>Validation Errors:</strong><ul>' + 
                                 messages.map(msg => `<li>${msg}</li>`).join('') + 
                                 '</ul>';
            errorDiv.style.display = 'block';
            errorDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            errorDiv.style.display = 'none';
            errorDiv.innerHTML = '';
        }
    }

    /**
     * Validates all form fields according to the specified rules.
     * @param {Event} event - The form submission event.
     * @returns {boolean} - True if validation passes, False otherwise.
     */
    function validateForm(event) {
        const form = document.forms["ContactUs"];
        const errors = [];

        // --- Helper Functions ---

        // Validates Name/Surname: not empty, no internal spaces
        const checkText = (field, name) => {
            const value = field.value.trim();
            if (value === "") {
                errors.push(`${name} is required.`);
                return false;
            }
            if (value.includes(' ')) {
                errors.push(`${name} must not contain spaces.`);
                return false;
            }
            return true;
        };

        // Validates Email: valid format, no internal spaces
        const checkEmail = (field, name) => {
            const value = field.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            // If the field is required but empty, it will be caught by HTML's 'required', 
            // but we check for empty here to apply custom error for work email (which is not required).
            if (value === "") {
                if (field.hasAttribute('required')) {
                     // Required field is empty, handled by browser or first check if no trim was done
                }
                return; // Stop checking if not required and empty
            }
            
            if (value.includes(' ')) {
                errors.push(`${name} should not contain spaces.`);
            } else if (!emailRegex.test(value)) {
                errors.push(`${name} must be a valid email address (e.g., user@domain.com).`);
            }
        };

        // --- Validation Checks ---

        // a. Name Validation (Must not be empty or have spaces)
        checkText(form["name"], "Name");

        // b. Surname Validation (Must not be empty or have spaces)
        checkText(form["surname"], "Surname");

        // c. Personal Email Validation (Must be an email and should not have spaces)
        checkEmail(form["personal_email"], "Personal Email");

        // d. Work Email Validation (Must be an email and should not have spaces if entered)
        checkEmail(form["work_email"], "Work Email");

        // e. Phone Number Validation (Must only be numeric and have only ten (10) digits)
        const phoneValue = form["phone"].value.trim();
        if (phoneValue !== "") {
            // Use regex to check for exactly 10 digits and only numeric characters
            if (!/^\d{10}$/.test(phoneValue)) {
                errors.push("Phone Number must be exactly 10 digits and numeric only (e.g., 1234567890).");
            }
        }

        // f. Message Validation (Must not be empty and should only have 500 characters)
        const messageValue = form["message"].value;
        if (messageValue.trim() === "") {
            errors.push("Message cannot be empty.");
        }
        if (messageValue.length > 500) {
            errors.push(`Message must be 500 characters or less (currently ${messageValue.length} characters).`);
        }


        // --- Submission Logic ---
        
        displayErrors(errors);

        if (errors.length > 0) {
            // Prevent form submission if there are errors
            event.preventDefault(); 
            return false;
        }

        // Optional: Can add a successful submission message here if the form was successfully submitted
        // For now, we allow the form to submit to the action URL if validation passes.
        return true;
    }

    // Add event listener to the Reset button to clear validation messages too
    document.querySelector('button[type="reset"]').addEventListener('click', () => {
        // Delay clearing the errors slightly to allow the browser's reset action to complete
        setTimeout(() => displayErrors([]), 50);
    });
</script>