/*!
* Start Bootstrap - Personal v1.0.1 (https://startbootstrap.com/template-overviews/personal)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-personal/blob/master/LICENSE)
*/
// This file is intentionally minimal
// Home contact form: construct a mailto link and open default email client
// Homepage email form removed (presentational only)

// Contact page: send using mailto or Gmail compose
(function () {
    var form = document.getElementById('contactFormSimple');
    if (!form) return;
    var emailInput = document.getElementById('contactEmail');
    var messageInput = document.getElementById('contactMessage');
    var gmailLink = document.getElementById('contactGmail');

    function getRecipient() {
        // TODO: replace with your real email
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

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        window.location.href = buildMailtoHref();
    });

    if (gmailLink) {
        gmailLink.addEventListener('click', function (e) {
            e.preventDefault();
            var href = buildGmailHref();
            window.open(href, '_blank', 'noopener');
        });
    }
})();