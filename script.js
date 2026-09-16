/**
 * Pasar Connect Hotspot Portal — script.js
 * Supports: Voucher/Member toggle, Carousel Slider with Dots,
 * Marquee Ticker, Password Show/Hide, QR Scan Modal,
 * Auto-login via URL params, Offline demo simulation.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ===================================================
    // ELEMENT REFERENCES
    // ===================================================
    const inputLabel       = document.getElementById('input-label-username');
    const usernameInput    = document.getElementById('username');
    const passwordContainer = document.getElementById('password-container');
    const passwordInput    = document.getElementById('password');
    const loginForm        = document.getElementById('login-form');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const errorBox         = document.getElementById('error-box');
    const toggleMemberLogin = document.getElementById('toggle-member-login');

    let currentTab = 'voucher'; // 'voucher' or 'member'

    // ===================================================
    // CAROUSEL SLIDER LOGIC (with dot indicators)
    // ===================================================
    let currentSlide = 0;
    const slides  = document.querySelectorAll('.carousel-slide');
    const dots    = document.querySelectorAll('.carousel-dot');
    const nextBtn = document.querySelector('.carousel-btn-next');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const SLIDE_INTERVAL = 5000;
    let slideInterval;

    function showSlide(index) {
        if (!slides || slides.length === 0) return;
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function nextSlide() { showSlide(currentSlide + 1); }
    function prevSlide() { showSlide(currentSlide - 1); }

    function startSlideShow() {
        slideInterval = setInterval(nextSlide, SLIDE_INTERVAL);
    }

    function resetSlideShow() {
        clearInterval(slideInterval);
        startSlideShow();
    }

    // Attach carousel button events
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetSlideShow(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetSlideShow(); });

    // Dot click events
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.getAttribute('data-index'), 10);
            if (!isNaN(idx)) {
                showSlide(idx);
                resetSlideShow();
            }
        });
    });

    // Init slider
    if (slides && slides.length > 0) {
        showSlide(0);
        startSlideShow();
    }

    // ===================================================
    // MEMBER / VOUCHER MODE TOGGLE
    // ===================================================
    if (toggleMemberLogin) {
        toggleMemberLogin.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentTab === 'voucher') {
                switchToMember();
            } else {
                switchToVoucher();
            }
        });
    }

    function switchToMember() {
        currentTab = 'member';
        if (inputLabel) inputLabel.innerText = 'Username Member';
        if (usernameInput) {
            usernameInput.placeholder = 'Masukkan username member';
            usernameInput.setAttribute('autocapitalize', 'none');
            usernameInput.classList.remove('uppercase-input');
        }
        if (passwordContainer) passwordContainer.style.display = 'block';
        if (passwordInput) passwordInput.required = true;

        if (toggleMemberLogin) {
            toggleMemberLogin.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-3-12v.75m0 3v.75m0 3v.75m0 3V18M3 6.75A2.25 2.25 0 0 1 5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 17.25V6.75Z" />
                </svg>
                Voucher
            `;
        }
        clearError();
        if (usernameInput) usernameInput.focus();
    }

    function switchToVoucher() {
        currentTab = 'voucher';
        if (inputLabel) inputLabel.innerText = 'Kode Voucher';
        if (usernameInput) {
            usernameInput.placeholder = 'Contoh: ABCD1234';
            usernameInput.setAttribute('autocapitalize', 'characters');
            usernameInput.classList.add('uppercase-input');
        }
        if (passwordContainer) passwordContainer.style.display = 'none';
        if (passwordInput) {
            passwordInput.required = false;
            passwordInput.value = '';
        }

        if (toggleMemberLogin) {
            toggleMemberLogin.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                Member
            `;
        }
        clearError();
        if (usernameInput) usernameInput.focus();
    }

    // ===================================================
    // PASSWORD EYE TOGGLE
    // ===================================================
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';

            if (isPassword) {
                togglePasswordBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor" style="width:16px;height:16px;">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                `;
            } else {
                togglePasswordBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor" style="width:16px;height:16px;">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                `;
            }
        });
    }

    // ===================================================
    // AUTO-LOGIN VIA URL QUERY PARAMS (QR SCAN REDIRECT)
    // ===================================================
    const urlParams  = new URLSearchParams(window.location.search);
    const queryUser  = urlParams.get('username') || urlParams.get('user');
    const queryPass  = urlParams.get('password') || urlParams.get('pass');

    if (queryUser) {
        if (usernameInput) usernameInput.value = '';
        if (passwordInput) passwordInput.value = '';

        const autoLoginOverlay = document.createElement('div');
        autoLoginOverlay.className = 'scanner-modal';
        autoLoginOverlay.style.zIndex = '2000';
        autoLoginOverlay.innerHTML = `
            <div class="scanner-modal-content" style="text-align: center; max-width: 280px; padding: 28px 22px;">
                <div style="width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,#F97316,#C2410C);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;box-shadow:0 6px 18px rgba(249,115,22,0.3);">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" style="width:24px;height:24px;">
                        <path fill-rule="evenodd" d="M1.371 8.143a.75.75 0 0 1 1.022-.24 15.618 15.618 0 0 1 19.214 0 .75.75 0 1 1-.782 1.28 14.118 14.118 0 0 0-17.65 0 .75.75 0 0 1-1.804-1.04ZM4.143 11.23a.75.75 0 0 1 1.002-.276 11.118 11.118 0 0 1 13.71 0 .75.75 0 1 1-.84 1.246 9.618 9.618 0 0 0-11.87 0 .75.75 0 0 1-1.002-.97ZM6.963 14.28a.75.75 0 0 1 .978-.328 6.618 6.618 0 0 1 8.118 0 .75.75 0 1 1-.896 1.206 5.118 5.118 0 0 0-6.222 0 .75.75 0 0 1-.978-.878ZM9.75 17.25a.75.75 0 0 1 1.097-.66 2.13 2.13 0 0 1 2.306 0 .75.75 0 1 1-.818 1.258.63.63 0 0 0-.67 0 .75.75 0 0 1-.915-.598Z" clip-rule="evenodd" />
                    </svg>
                </div>
                <h3 style="color: var(--primary-dark); margin-bottom: 8px; font-size: 14px; font-weight: 800;">Mendeteksi Voucher QR</h3>
                <div class="loading-dots" style="margin: 14px 0 8px;">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
                <p style="font-size: 10.5px; color: var(--text-muted); font-weight: 600;">Menghubungkan otomatis ke Pasar Connect...</p>
            </div>
        `;
        document.body.appendChild(autoLoginOverlay);

        setTimeout(() => {
            if (queryPass) {
                switchToMember();
                if (usernameInput) usernameInput.value = queryUser;
                if (passwordInput) passwordInput.value = queryPass;
            } else {
                switchToVoucher();
                if (usernameInput) usernameInput.value = queryUser;
            }

            setTimeout(() => {
                if (autoLoginOverlay) autoLoginOverlay.remove();
                if (loginForm) {
                    if (isDemoEnv()) {
                        simulateLogin(queryPass ? 'Member' : 'Voucher', queryUser);
                    } else {
                        loginForm.submit();
                    }
                }
            }, 1000);
        }, 1200);
    }

    // ===================================================
    // FORM VALIDATION & OFFLINE SIMULATION
    // ===================================================
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            const uVal = usernameInput ? usernameInput.value.trim() : '';
            const pVal = passwordInput ? passwordInput.value.trim() : '';

            if (currentTab === 'voucher') {
                if (!uVal) {
                    e.preventDefault();
                    showError('Silakan masukkan kode voucher Anda terlebih dahulu!');
                    return;
                }
                // MikroTik Voucher: password = username
                if (passwordInput) passwordInput.value = uVal.toUpperCase();

                if (isDemoEnv()) {
                    e.preventDefault();
                    simulateLogin('Voucher', uVal.toUpperCase());
                }
            } else {
                if (!uVal || !pVal) {
                    e.preventDefault();
                    showError('Harap lengkapi username dan password member Anda!');
                    return;
                }
                if (isDemoEnv()) {
                    e.preventDefault();
                    simulateLogin('Member', uVal);
                }
            }
        });
    }

    // ===================================================
    // QR SCAN GUIDE & REDIRECT CONTROLLER
    // ===================================================
    // Konfigurasi URL Scanner Eksternal (Walled Garden)
    // Kosongkan "" jika ingin menggunakan modal panduan biasa
    const EXTERNAL_QR_SCANNER_URL = "https://templatehotspot.com/scan";

    const scannerModal    = document.getElementById('scanner-modal');
    const shortcutScanBtn = document.getElementById('shortcut-scan-btn');
    const navScanBtn      = document.getElementById('nav-scan-btn');
    const closeScanner    = document.getElementById('close-scanner');
    const closeGuideBtn   = document.getElementById('close-guide-btn');

    function handleScanAction(e) {
        if (e) e.preventDefault();

        if (EXTERNAL_QR_SCANNER_URL && EXTERNAL_QR_SCANNER_URL.trim() !== '') {
            const currentBase = window.location.href.split('?')[0];
            const baseRedirectParam = `redirect=${encodeURIComponent(currentBase)}`;
            const isAndroid = /Android/i.test(navigator.userAgent);

            if (isAndroid) {
                let cleanUrl = EXTERNAL_QR_SCANNER_URL;
                let scheme = 'https';
                if (cleanUrl.startsWith('https://')) { cleanUrl = cleanUrl.slice(8); scheme = 'https'; }
                else if (cleanUrl.startsWith('http://')) { cleanUrl = cleanUrl.slice(7); scheme = 'http'; }
                const innerSeparator = cleanUrl.includes('?') ? '&' : '?';
                const fallbackTargetUrl = `${EXTERNAL_QR_SCANNER_URL}${innerSeparator}${baseRedirectParam}`;
                const intentUrl = `intent://${cleanUrl}${innerSeparator}${baseRedirectParam}#Intent;scheme=${scheme};package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(fallbackTargetUrl)};end`;
                window.location.href = intentUrl;
            } else {
                const separator = EXTERNAL_QR_SCANNER_URL.includes('?') ? '&' : '?';
                window.location.href = `${EXTERNAL_QR_SCANNER_URL}${separator}${baseRedirectParam}`;
            }
        } else {
            openScannerModal();
        }
    }

    function openScannerModal() {
        if (scannerModal) scannerModal.style.display = 'flex';
    }

    function closeScannerModal() {
        if (scannerModal) scannerModal.style.display = 'none';
    }

    if (shortcutScanBtn) shortcutScanBtn.addEventListener('click', handleScanAction);
    if (navScanBtn) navScanBtn.addEventListener('click', handleScanAction);
    if (closeScanner) closeScanner.addEventListener('click', closeScannerModal);
    if (closeGuideBtn) closeGuideBtn.addEventListener('click', closeScannerModal);

    if (scannerModal) {
        scannerModal.addEventListener('click', (e) => {
            if (e.target === scannerModal) closeScannerModal();
        });
    }

    // ===================================================
    // HELPERS
    // ===================================================
    function showError(msg) {
        if (errorBox) {
            errorBox.innerHTML = `<span>⚠️</span> <div>${msg}</div>`;
            errorBox.style.display = 'flex';
        } else {
            alert(msg);
        }
    }

    function clearError() {
        if (errorBox) errorBox.style.display = 'none';
    }

    function isDemoEnv() {
        return window.location.hostname === 'localhost' ||
               window.location.hostname === '127.0.0.1' ||
               window.location.protocol === 'file:';
    }

    function simulateLogin(type, name) {
        localStorage.setItem('pasarconnect_active', 'true');
        localStorage.setItem('pasarconnect_username', name);
        localStorage.setItem('pasarconnect_type', type);
        localStorage.setItem('pasarconnect_ip', '192.168.100.23');
        localStorage.setItem('pasarconnect_mac', '00:1A:2B:3C:4D:5E');
        localStorage.setItem('pasarconnect_login_time', new Date().toLocaleTimeString());
        window.location.href = 'redirect.html';
    }

}); // end DOMContentLoaded


// ===================================================
// OFFLINE SIMULATOR — STATUS PAGE
// ===================================================
function initStatusPage() {
    const active = localStorage.getItem('pasarconnect_active');
    const isLocal = window.location.hostname === 'localhost' ||
                    window.location.hostname === '127.0.0.1' ||
                    window.location.protocol === 'file:';

    if (active !== 'true' && isLocal) {
        window.location.href = 'login.html';
        return;
    }

    const username = localStorage.getItem('pasarconnect_username') || 'Trial';
    const type     = localStorage.getItem('pasarconnect_type') || 'Voucher';
    const ip       = localStorage.getItem('pasarconnect_ip') || '192.168.100.23';
    const mac      = localStorage.getItem('pasarconnect_mac') || '00:1A:2B:3C:4D:5E';

    const userEl   = document.getElementById('stat-username');
    const ipEl     = document.getElementById('stat-ip');
    const macEl    = document.getElementById('stat-mac');
    const uptimeEl = document.getElementById('stat-uptime');
    const typeEl   = document.getElementById('stat-type');

    if (userEl) userEl.textContent = username;
    if (ipEl)   ipEl.textContent   = ip;
    if (macEl)  macEl.textContent  = mac;
    if (typeEl) typeEl.textContent = type;

    // Uptime counter simulation
    let count = 0;
    setInterval(() => {
        count++;
        const hrs  = Math.floor(count / 3600);
        const mins = Math.floor((count % 3600) / 60);
        const secs = count % 60;
        const hrsStr  = hrs  > 0 ? hrs  + 'j ' : '';
        const minsStr = mins > 0 ? mins + 'm ' : '';
        if (uptimeEl) uptimeEl.textContent = hrsStr + minsStr + secs + 's';
    }, 1000);

    // Logout simulation (local only)
    const logoutForm = document.getElementById('logout-form');
    if (logoutForm && isLocal) {
        logoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = 'logout.html';
        });
    }
}
