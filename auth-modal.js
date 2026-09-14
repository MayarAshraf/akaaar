/* ==========================================================================
   Auth Modal — Sign in / Register
   Self-contained IIFE. Exposes window.openAuthModal() and
   window.closeAuthModal(). Wire the navbar Login button to openAuthModal().
   ========================================================================== */
(function () {
  'use strict';

  const COUNTRIES = [
    { code: 'EG', flag: '🇪🇬', dial: '+20', name: 'Egypt' },
    { code: 'SA', flag: '🇸🇦', dial: '+966', name: 'Saudi Arabia' },
    { code: 'AE', flag: '🇦🇪', dial: '+971', name: 'UAE' },
    { code: 'KW', flag: '🇰🇼', dial: '+965', name: 'Kuwait' },
    { code: 'QA', flag: '🇶🇦', dial: '+974', name: 'Qatar' },
    { code: 'GB', flag: '🇬🇧', dial: '+44',  name: 'United Kingdom' },
  ];

  let selectedCountry = COUNTRIES[0];
  let dialOpen = false;

  /* ── Modal HTML ── */
  const MODAL_HTML = `
<div class="auth-overlay" id="authOverlay" role="dialog" aria-modal="true"
     aria-labelledby="auth-title" aria-hidden="true">
  <div class="auth-modal">

    <button class="auth-modal__close" id="authClose" aria-label="Close">&times;</button>

    <!-- Left panel -->
    <div class="auth-modal__left" aria-hidden="true">
      <div class="auth-modal__illus">
        <div class="auth-illus-circle">
          <svg class="auth-illus-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <span class="auth-illus-spark auth-illus-spark--a"></span>
        <span class="auth-illus-spark auth-illus-spark--b"></span>
        <span class="auth-illus-spark auth-illus-spark--c"></span>
      </div>
      <h3 class="auth-modal__tagline">Keep track of<br><span>your dream home</span></h3>
      <ul class="auth-modal__benefits">
        <li><span class="auth-benefit-dot"></span>Save and track favourite properties</li>
        <li><span class="auth-benefit-dot"></span>Be notified of any price change</li>
        <li><span class="auth-benefit-dot"></span>Unlock exclusive tools &amp; insights</li>
      </ul>
    </div>

    <!-- Right panel -->
    <div class="auth-modal__right">
      <h2 class="auth-modal__title" id="auth-title">Sign in or Register</h2>

      <!-- ── Step: phone ── -->
      <div class="auth-step" id="auth-step-phone">
        <label class="auth-label" for="auth-phone-input">WhatsApp number</label>
        <div class="auth-phone-row">
          <button class="auth-dial" id="authDial" type="button" aria-haspopup="listbox"
                  aria-expanded="false" aria-label="Select country code">
            <span class="auth-dial__flag" id="dialFlag">🇪🇬</span>
            <span class="auth-dial__code" id="dialCode">+20</span>
            <svg class="auth-dial__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            <div class="auth-dial-menu" id="authDialMenu" role="listbox">
              ${COUNTRIES.map((c, i) => `
              <div class="auth-dial-option${i === 0 ? ' is-active' : ''}" role="option"
                   data-idx="${i}" aria-selected="${i === 0}">
                <span>${c.flag}</span>
                <span>${c.name}</span>
                <span style="margin-left:auto;opacity:.5;font-size:11px">${c.dial}</span>
              </div>`).join('')}
            </div>
          </button>
          <input class="auth-input" type="tel" id="auth-phone-input"
                 placeholder="1XXXXXXXXX" inputmode="numeric" maxlength="14"
                 autocomplete="tel-national" />
          <button class="auth-go-btn" id="auth-phone-go" type="button">Sign in</button>
        </div>
        <div class="auth-or">OR</div>
        <div class="auth-social">
          <button class="auth-social-btn" id="auth-to-email" type="button"
                  title="Continue with Email" aria-label="Continue with Email">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </button>
          <button class="auth-social-btn" id="auth-google-1" type="button"
                  title="Continue with Google" aria-label="Continue with Google">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </button>
          <button class="auth-social-btn" id="auth-facebook-1" type="button"
                  title="Continue with Facebook" aria-label="Continue with Facebook">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
        </div>
        <p class="auth-terms">By registering you accept our
          <a href="#" onclick="return false">Terms &amp; Conditions</a> and
          <a href="#" onclick="return false">our privacy policy</a>.
        </p>
      </div>

      <!-- ── Step: OTP ── -->
      <div class="auth-step" id="auth-step-otp" hidden>
        <button class="auth-back" id="auth-back-otp" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>
        <p class="auth-otp-desc">
          Enter the 6-digit code sent to your WhatsApp at
          <strong id="auth-otp-number"></strong>
        </p>
        <div class="auth-otp-boxes" id="auth-otp-boxes">
          <input class="auth-otp-box" maxlength="1" inputmode="numeric" pattern="[0-9]" autocomplete="one-time-code">
          <input class="auth-otp-box" maxlength="1" inputmode="numeric" pattern="[0-9]">
          <input class="auth-otp-box" maxlength="1" inputmode="numeric" pattern="[0-9]">
          <input class="auth-otp-box" maxlength="1" inputmode="numeric" pattern="[0-9]">
          <input class="auth-otp-box" maxlength="1" inputmode="numeric" pattern="[0-9]">
          <input class="auth-otp-box" maxlength="1" inputmode="numeric" pattern="[0-9]">
        </div>
        <div class="auth-otp-actions">
          <button class="auth-resend" id="auth-resend" type="button" disabled>
            Resend code (<span id="auth-resend-timer">30</span>s)
          </button>
          <button class="auth-verify-btn" id="auth-verify" type="button">Verify</button>
        </div>
      </div>

      <!-- ── Step: email ── -->
      <div class="auth-step" id="auth-step-email" hidden>
        <button class="auth-back" id="auth-back-email" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>
        <label class="auth-label" for="auth-email-input">Email</label>
        <div class="auth-email-row" style="margin-bottom:12px">
          <input class="auth-input" type="email" id="auth-email-input"
                 placeholder="you@example.com" autocomplete="email" />
        </div>
        <label class="auth-label" for="auth-pw-input" id="auth-pw-label">Password</label>
        <div style="display:flex;gap:8px;margin-bottom:12px">
          <div class="auth-pw-wrap" id="auth-pw-wrap">
            <input class="auth-input" type="password" id="auth-pw-input"
                   placeholder="Enter password" autocomplete="current-password" />
            <button class="auth-pw-toggle" id="auth-pw-toggle" type="button" aria-label="Show password">
              <svg id="auth-eye-show" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <svg id="auth-eye-hide" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
          <button class="auth-go-btn" id="auth-email-go" type="button">Sign in</button>
        </div>
        <div class="auth-or">OR</div>
        <div class="auth-social">
          <button class="auth-social-btn" id="auth-to-phone" type="button"
                  title="Continue with WhatsApp" aria-label="Continue with WhatsApp">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.847L.057 23.886a.5.5 0 0 0 .612.612l6.039-1.465A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.807 9.807 0 0 1-5.017-1.375l-.36-.214-3.727.904.92-3.627-.235-.373A9.807 9.807 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
            </svg>
          </button>
          <button class="auth-social-btn" id="auth-google-2" type="button"
                  title="Continue with Google" aria-label="Continue with Google">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </button>
          <button class="auth-social-btn" id="auth-facebook-2" type="button"
                  title="Continue with Facebook" aria-label="Continue with Facebook">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
        </div>
        <p class="auth-terms">By registering you accept our
          <a href="#" onclick="return false">Terms &amp; Conditions</a> and
          <a href="#" onclick="return false">our privacy policy</a>.
        </p>
      </div>

      <!-- ── Step: success ── -->
      <div class="auth-step" id="auth-step-success" hidden>
        <div class="auth-success">
          <div class="auth-success__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <p class="auth-success__title">Welcome back!</p>
          <p class="auth-success__sub">You're now signed in.</p>
        </div>
      </div>
    </div><!-- /right -->
  </div><!-- /modal -->
</div><!-- /overlay -->`;

  /* ── State ── */
  let overlay, resendInterval;
  let phoneValue = '';

  /* ── Init ── */
  function init() {
    if (document.getElementById('authOverlay')) return;
    document.body.insertAdjacentHTML('beforeend', MODAL_HTML);
    overlay = document.getElementById('authOverlay');
    bindEvents();
    wireLoginBtns();
  }

  /* ── Expose public API ── */
  window.openAuthModal  = open;
  window.closeAuthModal = close;

  /* ── Open / Close ── */
  function open() {
    overlay.removeAttribute('aria-hidden');
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    showStep('phone');
    const firstInput = overlay.querySelector('#auth-phone-input');
    setTimeout(() => firstInput && firstInput.focus(), 60);
  }

  function close() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    clearInterval(resendInterval);
  }

  /* ── Steps ── */
  function showStep(name) {
    overlay.querySelectorAll('.auth-step').forEach(s => s.hidden = true);
    const step = document.getElementById('auth-step-' + name);
    if (step) { step.hidden = false; }
    if (name === 'email') {
      document.getElementById('auth-email-input').value = '';
      document.getElementById('auth-pw-input').value = '';
    }
  }

  /* ── Country dial ── */
  function selectCountry(idx) {
    selectedCountry = COUNTRIES[idx];
    document.getElementById('dialFlag').textContent = selectedCountry.flag;
    document.getElementById('dialCode').textContent = selectedCountry.dial;
    document.querySelectorAll('.auth-dial-option').forEach((el, i) => {
      el.classList.toggle('is-active', i === idx);
      el.setAttribute('aria-selected', i === idx);
    });
    closeDial();
  }

  function openDial() {
    dialOpen = true;
    document.getElementById('authDialMenu').classList.add('is-open');
    document.getElementById('authDial').setAttribute('aria-expanded', 'true');
  }

  function closeDial() {
    dialOpen = false;
    document.getElementById('authDialMenu').classList.remove('is-open');
    document.getElementById('authDial').setAttribute('aria-expanded', 'false');
  }

  /* ── OTP ── */
  function startOTP(phoneDisplay) {
    document.getElementById('auth-otp-number').textContent = phoneDisplay;
    showStep('otp');
    // clear boxes
    overlay.querySelectorAll('.auth-otp-box').forEach(b => {
      b.value = '';
      b.classList.remove('is-filled');
    });
    overlay.querySelector('.auth-otp-box').focus();
    startResendTimer();
  }

  function startResendTimer() {
    const resendBtn = document.getElementById('auth-resend');
    const timerEl  = document.getElementById('auth-resend-timer');
    let seconds = 30;
    resendBtn.disabled = true;
    timerEl.textContent = seconds;
    resendBtn.textContent = `Resend code (${seconds}s)`;
    clearInterval(resendInterval);
    resendInterval = setInterval(() => {
      seconds--;
      resendBtn.textContent = seconds > 0
        ? `Resend code (${seconds}s)`
        : 'Resend code';
      if (seconds <= 0) {
        clearInterval(resendInterval);
        resendBtn.disabled = false;
      }
    }, 1000);
  }

  function getOTPValue() {
    return [...overlay.querySelectorAll('.auth-otp-box')].map(b => b.value).join('');
  }

  /* ── Success ── */
  function showSuccess(name) {
    showStep('success');
    const successTitle = overlay.querySelector('.auth-success__title');
    if (name) successTitle.textContent = `Welcome, ${name}!`;
    setTimeout(() => {
      close();
      const loginBtn = document.querySelector('.navbar__login');
      const userEl   = document.querySelector('.navbar__user');
      if (loginBtn) loginBtn.hidden = true;
      if (userEl) {
        const initials = (name || 'U').charAt(0).toUpperCase();
        userEl.querySelector('.navbar__user-avatar').textContent = initials;
        userEl.querySelector('.navbar__user-name').textContent = name || 'User';
        userEl.classList.add('is-visible');
      }
    }, 1600);
  }

  /* ── Bind all events ── */
  function bindEvents() {
    /* Close */
    document.getElementById('authClose').addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
    });

    /* Dial toggle */
    document.getElementById('authDial').addEventListener('click', e => {
      e.stopPropagation();
      dialOpen ? closeDial() : openDial();
    });
    document.addEventListener('click', () => { if (dialOpen) closeDial(); });
    document.querySelectorAll('.auth-dial-option').forEach((opt, i) => {
      opt.addEventListener('click', e => { e.stopPropagation(); selectCountry(i); });
    });

    /* Phone Go */
    document.getElementById('auth-phone-go').addEventListener('click', () => {
      const val = document.getElementById('auth-phone-input').value.trim();
      if (!val) { document.getElementById('auth-phone-input').focus(); return; }
      phoneValue = selectedCountry.dial + val;
      startOTP(phoneValue);
    });
    document.getElementById('auth-phone-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('auth-phone-go').click();
    });

    /* OTP boxes auto-advance */
    const otpBoxes = [...overlay.querySelectorAll('.auth-otp-box')];
    otpBoxes.forEach((box, i) => {
      box.addEventListener('input', () => {
        box.value = box.value.replace(/\D/g, '').slice(-1);
        box.classList.toggle('is-filled', !!box.value);
        if (box.value && i < otpBoxes.length - 1) otpBoxes[i + 1].focus();
        if (getOTPValue().length === 6) document.getElementById('auth-verify').click();
      });
      box.addEventListener('keydown', e => {
        if (e.key === 'Backspace' && !box.value && i > 0) {
          otpBoxes[i - 1].value = '';
          otpBoxes[i - 1].classList.remove('is-filled');
          otpBoxes[i - 1].focus();
        }
      });
      box.addEventListener('paste', e => {
        e.preventDefault();
        const digits = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
        digits.split('').forEach((d, j) => {
          if (otpBoxes[i + j]) {
            otpBoxes[i + j].value = d;
            otpBoxes[i + j].classList.add('is-filled');
          }
        });
        const next = otpBoxes[i + digits.length] || otpBoxes[otpBoxes.length - 1];
        next.focus();
        if (getOTPValue().length === 6) document.getElementById('auth-verify').click();
      });
    });

    /* OTP verify */
    document.getElementById('auth-verify').addEventListener('click', () => {
      if (getOTPValue().length < 6) return;
      showSuccess('');
    });

    /* OTP back */
    document.getElementById('auth-back-otp').addEventListener('click', () => {
      clearInterval(resendInterval);
      showStep('phone');
    });

    /* Resend */
    document.getElementById('auth-resend').addEventListener('click', () => {
      startResendTimer();
    });

    /* Email social btn → email step */
    document.getElementById('auth-to-email').addEventListener('click', () => showStep('email'));

    /* Email step: Sign in → validate both fields */
    document.getElementById('auth-email-go').addEventListener('click', () => {
      const email = document.getElementById('auth-email-input').value.trim();
      if (!email || !email.includes('@')) {
        document.getElementById('auth-email-input').focus();
        return;
      }
      const pw = document.getElementById('auth-pw-input').value;
      if (!pw) { document.getElementById('auth-pw-input').focus(); return; }
      showSuccess(email.split('@')[0]);
    });
    document.getElementById('auth-email-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('auth-email-go').click();
    });
    document.getElementById('auth-pw-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('auth-email-go').click();
    });

    /* Password show/hide */
    document.getElementById('auth-pw-toggle').addEventListener('click', () => {
      const input = document.getElementById('auth-pw-input');
      const showIcon = document.getElementById('auth-eye-show');
      const hideIcon = document.getElementById('auth-eye-hide');
      const isText = input.type === 'text';
      input.type = isText ? 'password' : 'text';
      showIcon.style.display = isText ? '' : 'none';
      hideIcon.style.display = isText ? 'none' : '';
    });

    /* Email step: WhatsApp back */
    document.getElementById('auth-to-phone').addEventListener('click', () => showStep('phone'));
    document.getElementById('auth-back-email').addEventListener('click', () => showStep('phone'));

    /* Google / Facebook stubs */
    ['auth-google-1','auth-google-2','auth-facebook-1','auth-facebook-2'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', () => {
        const provider = id.includes('google') ? 'Google' : 'Facebook';
        alert(provider + ' login coming soon.');
      });
    });

    /* Keyboard focus trap */
    overlay.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      const focusable = [...overlay.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      )].filter(el => el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ── Wire all .navbar__login buttons on the page ── */
  function wireLoginBtns() {
    document.querySelectorAll('.navbar__login').forEach(btn => {
      btn.addEventListener('click', open);
    });
  }

  /* ── Bootstrap ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
