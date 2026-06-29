/* ==========================================================================
   CryptoTradePro — settings.js
   Settings & profile page behavior: section nav, toggles, form validation.
   ========================================================================== */

(function () {
  'use strict';

  function initSettingsNav() {
    const links = document.querySelectorAll('.settings-nav a');
    const sections = document.querySelectorAll('[data-settings-section]');
    if (!links.length || !sections.length) return;

    links.forEach((link) => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const target = link.getAttribute('href').replace('#', '');
        links.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
        sections.forEach((section) => {
          section.style.display = section.getAttribute('data-settings-section') === target ? '' : 'none';
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  function initToggleSwitches() {
    document.querySelectorAll('.switch input[type="checkbox"]').forEach((input) => {
      input.addEventListener('change', function () {
        const label = input.closest('.settings-row')?.querySelector('strong')?.textContent || 'Setting';
        showToast({
          type: 'success',
          title: label + (input.checked ? ' enabled' : ' disabled')
        });
      });
    });
  }

  function initPasswordForm() {
    const form = document.querySelector('#changePasswordForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const newPass = document.querySelector('#newPassword');
      const confirmPass = document.querySelector('#confirmPassword');

      if (newPass && confirmPass && newPass.value !== confirmPass.value) {
        const group = confirmPass.closest('.form-group');
        if (group) group.classList.add('has-error');
        showToast({ type: 'error', title: 'Passwords do not match' });
        return;
      }

      if (newPass) {
        const group = newPass.closest('.form-group');
        if (group) group.classList.remove('has-error');
      }
      if (confirmPass) {
        const group = confirmPass.closest('.form-group');
        if (group) group.classList.remove('has-error');
      }

      showToast({ type: 'success', title: 'Password updated', message: 'Your password has been changed.' });
      form.reset();
    });
  }

  function initProfileForm() {
    const form = document.querySelector('#profileForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      showToast({ type: 'success', title: 'Profile saved', message: 'Your changes have been saved.' });
    });
  }

  function initAvatarUploadPreview() {
    const input = document.querySelector('#avatarUploadInput');
    const preview = document.querySelector('#avatarPreview');
    if (!input || !preview) return;

    input.addEventListener('change', function () {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        preview.setAttribute('src', e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  function init2FAToggle() {
    const toggle = document.querySelector('#twoFactorToggle');
    const modal = document.querySelector('#twoFactorModal');
    if (!toggle || !modal) return;

    toggle.addEventListener('change', function () {
      if (toggle.checked) {
        modal.classList.add('open');
      } else {
        showToast({ type: 'warn', title: 'Two-factor authentication disabled' });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initSettingsNav();
    initToggleSwitches();
    initPasswordForm();
    initProfileForm();
    initAvatarUploadPreview();
    init2FAToggle();
  });
})();
