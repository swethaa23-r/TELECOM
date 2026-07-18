// Custom Form Validation and Handling
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation');

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                // If valid, prevent default just for demo purposes to avoid page reload,
                // and show a success message or handle AJAX here.
                event.preventDefault();
                
                // Show a simple success alert for demo purposes
                const btn = form.querySelector('button[type="submit"]');
                if (btn) {
                    const originalText = btn.innerHTML;
                    
                    btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Processing...';
                    btn.disabled = true;
                    
                    setTimeout(() => {
                        btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Success!';
                        btn.classList.remove('btn-primary-custom');
                        btn.classList.add('btn-success');
                        
                        setTimeout(() => {
                            const actionUrl = form.getAttribute('action') || '404.html';
                            window.location.href = actionUrl;
                        }, 500);
                    }, 1000);
                } else {
                    const actionUrl = form.getAttribute('action') || '404.html';
                    window.location.href = actionUrl;
                }
            }

            form.classList.add('was-validated');
        }, false);
    });

    // Custom Email Validation for specific inputs
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.validity.typeMismatch) {
                input.setCustomValidity('Please enter a valid email address.');
            } else {
                input.setCustomValidity('');
            }
        });
    });

    // Custom Password Match Validation for Signup
    const passwordInput = document.getElementById('signupPassword');
    const confirmPasswordInput = document.getElementById('signupConfirmPassword');
    
    if (passwordInput && confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', () => {
            if (confirmPasswordInput.value !== passwordInput.value) {
                confirmPasswordInput.setCustomValidity('Passwords do not match.');
            } else {
                confirmPasswordInput.setCustomValidity('');
            }
        });
        
        passwordInput.addEventListener('input', () => {
            if (confirmPasswordInput.value !== '') {
                if (confirmPasswordInput.value !== passwordInput.value) {
                    confirmPasswordInput.setCustomValidity('Passwords do not match.');
                } else {
                    confirmPasswordInput.setCustomValidity('');
                }
            }
        });
    }
});
