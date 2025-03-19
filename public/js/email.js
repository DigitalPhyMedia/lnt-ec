(function() {
    emailjs.init("xaUgbMOS5uDkHfqAC"); // Consider moving this key to backend for security.
})();

document.addEventListener('DOMContentLoaded', function() {
    // Form 1: Sidebar form
    setupForm({
        formSelector: 'sidebar .enq-form',
        nameSelector: 'sidebar .enq-form input[name="uname"]',
        emailSelector: null, // No email field in this form
        mobileSelector: 'sidebar .enq-form input[name="umobile"]',
        consentSelector: '#consentCheck-sidebar',
        submitBtnSelector: '#enqPopupSumit',
        formNameSelector: 'sidebar .enq-form input[name="form_name"]'
    });

    // Form 2: Site Visit form
    setupForm({
        formSelector: '#siteVisitForm',
        nameSelector: '#uname',
        emailSelector: '#uemail', // This form has an optional email field
        mobileSelector: '#umobile',
        consentSelector: '#consentCheck-siteVisit',
        submitBtnSelector: '#enqPopupSubmit',
        formNameSelector: '#siteVisitForm input[name="form_name"]'
    });

    // Form 3: Enquire Popup form
    setupForm({
        formSelector: '#enqPopup .enq-form',
        nameSelector: '#enqPopup input[name="uname"]',
        emailSelector: null, // No email field in this form
        mobileSelector: '#enqPopup input[name="umobile"]',
        consentSelector: '#consentCheck-enqPopup',
        submitBtnSelector: '#enqPopup #enqPopupSumit',
        formNameSelector: '#enqPopup input[name="form_name"]'
    });

    // Set up form type when modal opens
    const enqPopupModal = document.getElementById('enqPopup');
    if (enqPopupModal) {
        enqPopupModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            const formName = button.getAttribute('data-form-name');
            const formTitle = document.getElementById('enqPopupTitle');
            const formNameInput = document.getElementById('form-name');
            
            if (formName) {
                formTitle.textContent = formName;
                formNameInput.value = formName;
            } else {
                formTitle.textContent = 'Enquire Now';
                formNameInput.value = 'Auto Popup';
            }
        });
    }

    // Form setup and validation function
    function setupForm(config) {
        const form = document.querySelector(config.formSelector);
        if (!form) return; // Skip if form not found
        
        const nameInput = document.querySelector(config.nameSelector);
        const emailInput = config.emailSelector ? document.querySelector(config.emailSelector) : null;
        const mobileInput = document.querySelector(config.mobileSelector);
        const consentCheck = document.querySelector(config.consentSelector);
        const submitBtn = document.querySelector(config.submitBtnSelector);
        const formNameInput = document.querySelector(config.formNameSelector);
        
        function checkFormValidity() {
            let nameValid = false;
            let emailValid = true; // Default to true if no email field
            let mobileValid = false;
            let consentValid = false;
            
            if (nameInput) {
                nameValid = nameInput.value.trim() !== '' && 
                            /^[A-Za-z\s]+$/.test(nameInput.value);
            }
            
            if (emailInput) {
                // Email is optional, so validate only if not empty
                emailValid = emailInput.value.trim() === '' || 
                           /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailInput.value);
            }
            
            if (mobileInput) {
                mobileValid = mobileInput.value.trim() !== '' && 
                              /^\d{10}$/.test(mobileInput.value);
            }
            
            if (consentCheck) {
                consentValid = consentCheck.checked;
            }
            
            if (submitBtn) {
                submitBtn.disabled = !(nameValid && emailValid && mobileValid && consentValid);
            }
        }
        
        // Add event listeners to form elements
        if (nameInput) nameInput.addEventListener('input', checkFormValidity);
        if (emailInput) emailInput.addEventListener('input', checkFormValidity);
        if (mobileInput) mobileInput.addEventListener('input', checkFormValidity);
        if (consentCheck) consentCheck.addEventListener('change', checkFormValidity);
        
        // Ensure button is enabled or disabled on page load
        checkFormValidity();
        
        // Form submission handler
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Submitting...';
            }
            
            const formValues = {
                name: nameInput ? nameInput.value : '',
                mobile: mobileInput ? mobileInput.value : '',
                form_name: formNameInput ? formNameInput.value : 'Website Enquiry',
                to_email: "lntprojectsbangalore@gmail.com"
            };
            
            // Select template based on whether email is provided
            let templateId = "template_2vd795r"; // Default template for name and phone only
            
            if (emailInput && emailInput.value.trim() !== '') {
                templateId = "template_zejs2ig"; // Template for when email is provided
                formValues.email = emailInput.value.trim();
            }
            
            emailjs.send("service_8vamjmf", templateId, formValues)
                .then(function(response) {
                    console.log("Email sent successfully", response);
                    alert("Thank you for your enquiry! We will contact you shortly.");
                    
                    // Reset form but keep it visible
                    form.reset();
                    
                    // Re-enable submit button
                    if (submitBtn) {
                        submitBtn.disabled = true; // Disabled until form is valid again
                        submitBtn.innerHTML = 'Submit';
                    }
                    
                    // If this was a modal form, optionally close the modal
                    // Uncomment the next line if you want modals to close on successful submission
                    // if (form.closest('.modal')) bootstrap.Modal.getInstance(form.closest('.modal')).hide();
                    
                }, function(error) {
                    console.error("Email failed to send", error);
                    alert("Error sending your enquiry. Please try again later.");
                    
                    // Re-enable submit button
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = 'Submit';
                    }
                });
        });
    }
});