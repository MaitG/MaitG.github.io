// The Ultimate Theme Toggle
(function () {
    function calculateSettingAsThemeString({ localStorageTheme, systemSettingDark }) {
        if (localStorageTheme !== null) {
            return localStorageTheme;
        }

        if (systemSettingDark.matches) {
            return "dark";
        }

        return "light";
    }

    function updateButton({ buttonEl, isDark }) {
        const newCta = isDark ? "Change to light theme" : "Change to dark theme";
        const newIcon = isDark ? "bi-sun" : "bi-moon-stars";
        
        buttonEl.setAttribute("aria-label", newCta);
        buttonEl.innerHTML = `<i class="bi ${newIcon}"></i>`;
    }

    function updateThemeOnHtmlEl({ theme }) {
        document.querySelector("html").setAttribute("data-theme", theme);
    }

    const button = document.querySelector("[data-theme-toggle]");
    const localStorageTheme = localStorage.getItem("theme");
    const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

    let currentThemeSetting = calculateSettingAsThemeString({ localStorageTheme, systemSettingDark });

    updateButton({ buttonEl: button, isDark: currentThemeSetting === "dark" });
    updateThemeOnHtmlEl({ theme: currentThemeSetting });

    button.addEventListener("click", () => {
        const newTheme = currentThemeSetting === "dark" ? "light" : "dark";

        localStorage.setItem("theme", newTheme);
        updateButton({ buttonEl: button, isDark: newTheme === "dark" });
        updateThemeOnHtmlEl({ theme: newTheme });

        currentThemeSetting = newTheme;
    });
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
