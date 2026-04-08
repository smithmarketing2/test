(function() {
  function initMenuToggle() {
    var menuBtn = document.querySelector('.js-menu');
    var nav = document.querySelector('.index-nav');
    if (!menuBtn || !nav) return;
    menuBtn.addEventListener('click', function() {
      var isOpen = nav.classList.toggle('is-open');
      var controlsId = menuBtn.getAttribute('aria-controls');
      if (!controlsId || document.getElementById(controlsId)) {
        menuBtn.setAttribute('aria-expanded', isOpen);
      }
      document.dispatchEvent(new CustomEvent('menu:toggle', { detail: { open: isOpen } }));
    });
  }

  function validateField(field) {
    var valid = true;
    var value = field.value.trim();
    if (field.name === 'email') {
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(value)) valid = false;
    } else {
      if (!value) valid = false;
    }
    if (!valid) {
      field.classList.add('is-invalid');
      field.setAttribute('aria-invalid', 'true');
      field.style.setProperty('--color-error', 'var(--color-error)');
    } else {
      field.classList.remove('is-invalid');
      field.removeAttribute('aria-invalid');
    }
    return valid;
  }

  function initContactFormValidation() {
    var form = document.querySelector('.js-form');
    if (!form) return;
    var nameField = form.querySelector('[name="name"]');
    var emailField = form.querySelector('[name="email"]');
    var messageField = form.querySelector('[name="message"]');

    [nameField, emailField, messageField].forEach(function(field) {
      if (!field) return;
      field.addEventListener('blur', function() {
        var fieldValid = validateField(field);
        document.dispatchEvent(new CustomEvent('form:validate', {
          detail: { field: field.name, valid: fieldValid }
        }));
      });
    });

    form.addEventListener('submit', function(e) {
      var validName = nameField ? validateField(nameField) : true;
      var validEmail = emailField ? validateField(emailField) : true;
      var validMessage = messageField ? validateField(messageField) : true;
      var isValid = validName && validEmail && validMessage;

      document.dispatchEvent(new CustomEvent('form:submit', { detail: { valid: isValid } }));

      if (!isValid) {
        e.preventDefault();
        var firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
      } else {
        form.classList.add('is-loading');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    initMenuToggle();
    initContactFormValidation();

    setTimeout(function() {
      var menuBtn = document.querySelector('.js-menu');
      var form = document.querySelector('.js-form');
      if (!menuBtn && !form) {
        document.dispatchEvent(new CustomEvent('init:timeout'));
      }
    }, 2000);
  });
})();