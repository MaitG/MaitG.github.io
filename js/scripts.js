// The Ultimate Theme Toggle
(function () {
    var STORAGE_KEY = 'theme';
    var CLICK_HANDLER_BOUND = false;

    function safeGet(key) {
        try { return localStorage.getItem(key); } catch (e) { return null; }
    }

    function safeSet(key, value) {
        try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
    }

    function calculateSettingAsThemeString(params) {
        var localStorageTheme = params.localStorageTheme;
        var systemSettingDark = params.systemSettingDark;
        if (localStorageTheme !== null && (localStorageTheme === 'light' || localStorageTheme === 'dark')) {
            return localStorageTheme;
        }
        if (systemSettingDark && systemSettingDark.matches) {
            return 'dark';
        }
        return 'light';
    }

    function updateButton(args) {
        var buttonEl = args.buttonEl;
        var isDark = args.isDark;
        if (!buttonEl) return; // Guard against null button
        var newCta = isDark ? 'Change to light theme' : 'Change to dark theme';
        var newIcon = isDark ? 'bi-sun' : 'bi-moon-stars';
        buttonEl.setAttribute('aria-label', newCta);
        buttonEl.innerHTML = '<i class="bi ' + newIcon + '"></i>';
    }

    function updateThemeOnHtmlEl(args) {
        var theme = args.theme;
        document.documentElement.setAttribute('data-theme', theme);
    }

    function ensureToggleButton() {
        var btn = document.querySelector('[data-theme-toggle]');
        if (btn) return btn;
        // Create one if missing
        btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'theme-toggle floating-btn';
        btn.setAttribute('data-theme-toggle', '');
        btn.setAttribute('aria-label', 'Change theme');
        // Visual icon placeholder; will be updated by updateButton
        btn.innerHTML = '<i class="bi bi-moon-stars"></i>';
        // Append late to avoid layout shift during parse
        (document.body || document.documentElement).appendChild(btn);
        return btn;
    }

    function initializeThemeToggle() {
        var button = ensureToggleButton();
        var localStorageTheme = safeGet(STORAGE_KEY);
        var systemSettingDark = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')) || null;

        var currentThemeSetting = calculateSettingAsThemeString({ localStorageTheme: localStorageTheme, systemSettingDark: systemSettingDark });

        // Apply theme immediately
        updateThemeOnHtmlEl({ theme: currentThemeSetting });

        // Update button UI
        updateButton({ buttonEl: button, isDark: currentThemeSetting === 'dark' });

        // Bind click handler exactly once
        if (button && !CLICK_HANDLER_BOUND) {
            button.onclick = function () {
                var newTheme = currentThemeSetting === 'dark' ? 'light' : 'dark';
                safeSet(STORAGE_KEY, newTheme);
                updateButton({ buttonEl: button, isDark: newTheme === 'dark' });
                updateThemeOnHtmlEl({ theme: newTheme });
                currentThemeSetting = newTheme;
            };
            CLICK_HANDLER_BOUND = true;
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeThemeToggle);
    } else {
        initializeThemeToggle();
    }
})();

// Contact form functionality
(function() {
    var form = document.getElementById('contactFormSimple');
    if (!form) return;
    
    var emailInput = document.getElementById('contactEmail');
    var messageInput = document.getElementById('contactMessage');
    var gmailLink = document.getElementById('contactGmail');

    function getRecipient() {
        return 'mbgada@andrew.cmu.edu';
    }

    function buildMailtoHref() {
        var to = getRecipient();
        var subject = 'Contact via website (' + (emailInput && emailInput.value ? emailInput.value : 'visitor') + ')';
        var body = (messageInput && messageInput.value ? messageInput.value : '') + '\n\nFrom: ' + (emailInput && emailInput.value ? emailInput.value : '');
        return 'mailto:' + encodeURIComponent(to) + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    }

    function buildGmailHref() {
        var to = getRecipient();
        var subject = 'Contact via website';
        var body = (messageInput && messageInput.value ? messageInput.value : '') + '\n\nFrom: ' + (emailInput && emailInput.value ? emailInput.value : '');
        var base = 'https://mail.google.com/mail/?view=cm&fs=1&tf=1';
        return base + '&to=' + encodeURIComponent(to) + '&su=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        window.location.href = buildMailtoHref();
    });

    if (gmailLink) {
        gmailLink.addEventListener('click', function(e) {
            e.preventDefault();
            var href = buildGmailHref();
            window.open(href, '_blank', 'noopener');
        });
    }
})();
