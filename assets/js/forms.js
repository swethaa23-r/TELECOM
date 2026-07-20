/**
 * Custom Form Validation Engine
 * Handles real-time validation, custom error messages, and form submission states.
 */
document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    // Global Toast Notification System
    const showToast = (message, type = 'success') => {
        let toastContainer = document.getElementById('global-toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'global-toast-container';
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            toastContainer.style.zIndex = '9999';
            document.body.appendChild(toastContainer);
        }

        const toastEl = document.createElement('div');
        toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');
        
        toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body fw-bold">
                    ${type === 'success' ? '<i class="fa-solid fa-check-circle me-2"></i>' : '<i class="fa-solid fa-triangle-exclamation me-2"></i>'} ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        
        toastContainer.appendChild(toastEl);
        if (typeof bootstrap !== 'undefined') {
            const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
            toast.show();
        }
        
        // Remove from DOM after hidden
        toastEl.addEventListener('hidden.bs.toast', () => {
            toastEl.remove();
        });
    };

    // Make showToast globally available
    window.showToast = showToast;

    const forms = document.querySelectorAll('.needs-validation');

    // Validation patterns
    const patterns = {
        name: /^[A-Za-z\s]{3,}$/,
        phone: /^[0-9]{10}$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    };

    // Sanitize input
    const sanitizeInput = (input) => {
        if (input.type !== 'password' && input.type !== 'file') {
            input.value = input.value.trim();
        }
    };

    // Validate a single field
    const validateField = (field) => {
        sanitizeInput(field);
        
        let isValid = true;
        let errorMessage = '';

        // Reset custom validity
        field.setCustomValidity('');
        
        if (field.disabled || field.readOnly) return true;

        if (field.validity.valueMissing) {
            isValid = false;
            errorMessage = 'This field is required.';
        } else if (field.type === 'email' && field.validity.typeMismatch) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        } else if (field.name === 'name' || field.id.toLowerCase().includes('name')) {
            if (!patterns.name.test(field.value)) {
                isValid = false;
                errorMessage = 'Name must be at least 3 characters and contain only letters.';
                field.setCustomValidity(errorMessage);
            }
        } else if (field.type === 'tel' || field.name === 'phone' || field.id.toLowerCase().includes('phone')) {
            if (!patterns.phone.test(field.value)) {
                isValid = false;
                errorMessage = 'Phone number must be exactly 10 digits.';
                field.setCustomValidity(errorMessage);
            }
        } else if (field.type === 'password') {
            if (field.id.toLowerCase().includes('confirm')) {
                // Confirm password check
                const passwordField = document.querySelector('input[type="password"]:not([id*="onfirm"]):not([id*="onfirmPassword"])');
                if (passwordField && field.value !== passwordField.value) {
                    isValid = false;
                    errorMessage = 'Passwords do not match.';
                    field.setCustomValidity(errorMessage);
                }
            } else if (field.type === 'password' && field.id.toLowerCase().includes('confirm')) {
            const passField = document.getElementById(field.id.replace('Confirm', '').replace('confirm', ''));
            if (passField && field.value !== passField.value) {
                isValid = false;
                errorMessage = 'Passwords do not match.';
                field.setCustomValidity(errorMessage);
            }
        } else if (field.type === 'password' && !field.id.toLowerCase().includes('confirm') && !patterns.password.test(field.value)) {
                isValid = false;
                errorMessage = 'Password must be at least 8 chars, with 1 uppercase, 1 lowercase, 1 number, and 1 special char.';
                field.setCustomValidity(errorMessage);
            }
        } else if (field.tagName === 'SELECT') {
            if (field.value === '' || field.value === 'null') {
                isValid = false;
                errorMessage = 'Please select an option.';
            }
        } else if (field.tagName === 'TEXTAREA' && field.value.length < 10) {
            isValid = false;
            errorMessage = 'Please enter at least 10 characters.';
            field.setCustomValidity(errorMessage);
        } else if (field.type === 'checkbox' && field.required && !field.checked) {
            isValid = false;
            errorMessage = 'You must agree before submitting.';
        } else if (!field.checkValidity()) {
            isValid = false;
            errorMessage = field.validationMessage;
        }

        // Handle UI updates
        const errorContainer = field.parentElement.querySelector('.invalid-feedback') || field.nextElementSibling;
        
        if (!isValid) {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
            field.setAttribute('aria-invalid', 'true');
            if (errorContainer && errorContainer.classList.contains('invalid-feedback')) {
                errorContainer.textContent = errorMessage;
            }
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            field.setAttribute('aria-invalid', 'false');
        }

        return isValid;
    };

    // Attach real-time validation to all inputs in forms
    Array.from(forms).forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Validate on blur, input, and change
            ['blur', 'input', 'change'].forEach(eventType => {
                input.addEventListener(eventType, () => {
                    validateField(input);
                });
            });
        });

        // Form submission handling
        form.addEventListener('submit', event => {
            let isFormValid = true;
            const formInputs = form.querySelectorAll('input, select, textarea');
            
            formInputs.forEach(input => {
                if (!validateField(input)) {
                    isFormValid = false;
                }
            });

            if (!isFormValid || !form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                form.classList.add('was-validated');
                if (window.showToast) window.showToast('Please fix the errors in the form.', 'danger');
                
                // Shake animation if GSAP is available
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(form, 
                        { x: -10 },
                        { x: 10, duration: 0.1, yoyo: true, repeat: 3, onComplete: () => { gsap.set(form, {x: 0}) } }
                    );
                }
            } else {
                // Let the inline script handle the redirect if it's there, but handle the UI state here
                const btn = form.querySelector('button[type="submit"]');
                if (btn && !btn.hasAttribute('data-custom-submit')) {
                    event.preventDefault(); // Prevent default if no custom logic is meant to run (like a true server submit)
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
                    btn.disabled = true;
                    
                    setTimeout(() => {
                        btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Success!';
                        btn.classList.remove('btn-primary-custom', 'btn-primary');
                        btn.classList.add('btn-success');
                        
                        setTimeout(() => {
                            if (window.showToast) window.showToast('Form submitted successfully!', 'success');
                            const actionUrl = form.getAttribute('action') || '404.html';
                            window.location.href = actionUrl;
                        }, 500);
                    }, 1000);
                }
            }
        }, false);
    });
});



