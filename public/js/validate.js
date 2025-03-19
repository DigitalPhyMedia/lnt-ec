(function () {

    "use strict";

    let forms = document.querySelectorAll('.js-email-form');

    forms.forEach(function (e) {
        e.addEventListener('submit', function (event) {
            event.preventDefault();

            let thisForm = this;

            let action = thisForm.getAttribute('action');

            if (!action) {
                displayError(thisForm, 'The form action property is not set!');
                return;
            }

            const nameErrorEl = document.getElementById("nameError");
            const serviceErrorEl = document.getElementById("serviceError");
            const phoneErrorEl = document.getElementById("phoneError");
            const emailErrorEl = document.getElementById("emailError");

            // Clear previous error messages
            nameErrorEl.textContent = "";
            nameErrorEl.style.display = "none";
            serviceErrorEl.textContent = "";
            serviceErrorEl.style.display = "none";
            phoneErrorEl.textContent = "";
            phoneErrorEl.style.display = "none";
            emailErrorEl.textContent = "";
            emailErrorEl.style.display = "none";

            let valid = true;

            // Validate Name: Required, min 3, max 30
            const nameField = document.getElementById("popup-name");
            const nameVal = nameField.value.trim();
            if (nameVal === "") {
                nameErrorEl.textContent = "Name is required.";
                nameErrorEl.style.display = "block";
                valid = false;
            } else if (nameVal.length < 3) {
                nameErrorEl.textContent = "Name must be at least 3 characters.";
                nameErrorEl.style.display = "block";
                valid = false;
            } else if (nameVal.length > 30) {
                nameErrorEl.textContent = "Name must be less than 30 characters.";
                nameErrorEl.style.display = "block";
                valid = false;
            }

            // Validate Service: Required
            const serviceField = document.getElementById("popup-service");
            if (serviceField.value === "") {
                serviceErrorEl.textContent = "Please select a service.";
                serviceErrorEl.style.display = "block";
                valid = false;
            }

            // Validate Phone: if visible
            if (document.getElementById("phoneFieldWrapper").style.display !== "none") {
                const phoneField = document.getElementById("popupPhoneField");
                const phoneVal = phoneField.value.trim();
                const phoneRegex = /^\d{10}$/;
                if (phoneVal === "") {
                    phoneErrorEl.textContent = "Phone number is required.";
                    phoneErrorEl.style.display = "block";
                    valid = false;
                } else if (!phoneRegex.test(phoneVal)) {
                    phoneErrorEl.textContent = "Please enter a valid 10-digit phone number.";
                    phoneErrorEl.style.display = "block";
                    valid = false;
                }
            }

            // Validate Email: if visible
            if (document.getElementById("emailFieldWrapper").style.display !== "none") {
                const emailField = document.getElementById("popupEmailField");
                const emailVal = emailField.value.trim();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailVal === "") {
                    emailErrorEl.textContent = "Email is required.";
                    emailErrorEl.style.display = "block";
                    valid = false;
                } else if (!emailRegex.test(emailVal)) {
                    emailErrorEl.textContent = "Please enter a valid email address.";
                    emailErrorEl.style.display = "block";
                    valid = false;
                }
            }

            if (!valid) {
                event.preventDefault();
                event.stopPropagation();
                // displayError(thisForm, 'Form validation failed! Please check the required fields and try again.');
                return;
            }

            thisForm.querySelector('.loading').classList.add('d-block');
            thisForm.querySelector('.error-message').classList.remove('d-block');
            thisForm.querySelector('.sent-message').classList.remove('d-block');

            let formData = new FormData(thisForm);

            let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');

            if (recaptcha) {
                if (typeof grecaptcha !== "undefined") {
                    grecaptcha.ready(function () {
                        try {
                            grecaptcha.execute(recaptcha, { action: 'php_email_form_submit' })
                                .then(token => {
                                    formData.set('recaptcha-response', token);
                                    php_email_form_submit(thisForm, action, formData);
                                })
                        } catch (error) {
                            displayError(thisForm, error);
                        }
                    });
                } else {
                    displayError(thisForm, 'The reCaptcha javascript API url is not loaded!')
                }
            } else {
                php_email_form_submit(thisForm, action, formData);
            }
        });
    });

    function php_email_form_submit(thisForm, action, formData) {
        fetch(action, {
            method: 'POST',
            body: formData,
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error(`${response.status} ${response.statusText} ${response.url}`);
                }
            })
            .then(data => {
                thisForm.querySelector('.loading').classList.remove('d-block');
                if (data.trim() == 'OK') {
                    thisForm.querySelector('.sent-message').classList.add('d-block');
                    thisForm.reset();
                } else {
                    throw new Error(data ? data : 'Form submission failed and no error message returned from: ' + action);
                }
            })
            .catch((error) => {
                displayError(thisForm, error);
            });
    }

    function displayError(thisForm, error) {
        thisForm.querySelector('.loading').classList.remove('d-block');
        thisForm.querySelector('.error-message').innerHTML = error;
        thisForm.querySelector('.error-message').classList.add('d-block');
    }

})();