     (function() {
        emailjs.init("xaUgbMOS5uDkHfqAC"); // Consider moving this key to backend for security.
    })();

    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('siteVisitForm');
        const submitBtn = document.getElementById('enqPopupSubmit');
        const nameInput = document.getElementById('uname');
        const emailInput = document.getElementById('uemail');
        const mobileInput = document.getElementById('umobile');
        const consentCheck = document.getElementById('consentCheck-siteVisit');
        const thankYouMessage = document.getElementById('thankYouMessage');
        const errorMessage = document.getElementById('errorMessage');

        function checkFormValidity() {
            const nameValid = nameInput.value.trim() !== '' && /^[A-Za-z\s]+$/.test(nameInput.value);
            const emailValid = emailInput.value.trim() !== '' && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailInput.value);
            const mobileValid = mobileInput.value.trim() !== '' && /^\d{10}$/.test(mobileInput.value);
            submitBtn.disabled = !(nameValid && emailValid && mobileValid && consentCheck.checked);
        }

        // Run validation when input changes
        [nameInput, emailInput, mobileInput, consentCheck].forEach(input => {
            input.addEventListener('input', checkFormValidity);
        });

        // Ensure button is enabled or disabled on page load
        checkFormValidity();

        form.addEventListener('submit', function(event) {
event.preventDefault();

submitBtn.disabled = true;
submitBtn.innerHTML = 'Submitting...';

const name = nameInput.value;
const email = emailInput.value.trim(); // Trim to remove whitespace
const mobile = mobileInput.value;

thankYouMessage.style.display = 'none';
errorMessage.style.display = 'none';

let emailParams = {
name: name,
mobile: mobile,
to_email: "lntprojectsbangalore@gmail.com"
};

// Only include email if it is provided
if (email !== '') {
emailParams.email = email;
}

emailjs.send("service_8vamjmf", "template_zejs2ig", emailParams)
.then(
function(response) {
    console.log("Email sent successfully", response);
    thankYouMessage.style.display = 'block';
    form.style.display = 'none';
},
function(error) {
    console.error("Email failed to send", error);
    errorMessage.style.display = 'block';
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Submit';
}
);
});

    });
 