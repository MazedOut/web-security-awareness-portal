/**
 * password_meter.js — Real-time client-side password strength meter
 *
 * Features:
 * - Length, uppercase, lowercase, number, symbol checks
 * - Common password dictionary check (top 100)
 * - Entropy-based scoring
 * - Visual strength bar (red → yellow → green)
 * - HTMX-triggered HIBP breach check via /api/check-password-breach
 */

(function () {
    "use strict";

    // Top 100 common passwords (subset for client-side check)
    const COMMON_PASSWORDS = [
        "123456", "password", "12345678", "qwerty", "123456789", "12345",
        "1234", "111111", "1234567", "dragon", "123123", "baseball",
        "abc123", "football", "monkey", "letmein", "shadow", "master",
        "666666", "qwerty123", "mustang", "michael", "password1",
        "654321", "superman", "1qaz2wsx", "7777777", "121212",
        "000000", "qazwsx", "trustno1", "jordan", "hunter", "jennifer",
        "thomas", "ranger", "buster", "soccer", "harley", "batman",
        "andrew", "tigger", "sunshine", "iloveyou", "2000", "charlie",
        "robert", "daniel", "starwars", "klaster", "112233", "696969",
        "passw0rd", "admin", "welcome", "monkey123", "master123",
        "hello", "charlie", "donald", "loveme", "hockey", "summer",
        "princess", "ashley", "michael1", "india123", "password123",
        "welcome1", "admin123", "abcd1234", "india1", "test123"
    ];

    /**
     * Calculate password strength score (0-100)
     */
    function calculateStrength(password) {
        if (!password) return { score: 0, checks: {}, label: "Empty", color: "#6b7280" };

        const checks = {
            length8: password.length >= 8,
            length12: password.length >= 12,
            length16: password.length >= 16,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            symbol: /[^A-Za-z0-9]/.test(password),
            noCommon: !COMMON_PASSWORDS.includes(password.toLowerCase()),
            noRepeats: !/(.)\1{2,}/.test(password),
            noSequential: !/(012|123|234|345|456|567|678|789|abc|bcd|cde|def)/i.test(password),
        };

        let score = 0;
        if (checks.length8) score += 10;
        if (checks.length12) score += 10;
        if (checks.length16) score += 10;
        if (checks.uppercase) score += 10;
        if (checks.lowercase) score += 10;
        if (checks.number) score += 10;
        if (checks.symbol) score += 15;
        if (checks.noCommon) score += 10;
        if (checks.noRepeats) score += 5;
        if (checks.noSequential) score += 5;

        // Bonus for mixed character types
        const typesUsed = [checks.uppercase, checks.lowercase, checks.number, checks.symbol]
            .filter(Boolean).length;
        if (typesUsed >= 3) score += 5;

        score = Math.min(score, 100);

        let label, color;
        if (score < 20) { label = "Very Weak"; color = "#ef4444"; }
        else if (score < 40) { label = "Weak"; color = "#f97316"; }
        else if (score < 60) { label = "Fair"; color = "#eab308"; }
        else if (score < 80) { label = "Strong"; color = "#22c55e"; }
        else { label = "Very Strong"; color = "#00ff41"; }

        return { score, checks, label, color };
    }

    /**
     * Update the UI with strength results
     */
    function updateMeter(inputId, barId, labelId, checklistId) {
        const input = document.getElementById(inputId);
        if (!input) return;

        const password = input.value;
        const result = calculateStrength(password);

        // Update progress bar
        const bar = document.getElementById(barId);
        if (bar) {
            bar.style.width = result.score + "%";
            bar.style.backgroundColor = result.color;
            bar.setAttribute("aria-valuenow", result.score);
        }

        // Update label
        const label = document.getElementById(labelId);
        if (label) {
            label.textContent = result.label;
            label.style.color = result.color;
        }

        // Update checklist
        const checklist = document.getElementById(checklistId);
        if (checklist) {
            const checkItems = [
                { key: "length8", text: "At least 8 characters" },
                { key: "length12", text: "At least 12 characters" },
                { key: "uppercase", text: "Contains uppercase letter" },
                { key: "lowercase", text: "Contains lowercase letter" },
                { key: "number", text: "Contains number" },
                { key: "symbol", text: "Contains special character" },
                { key: "noCommon", text: "Not a common password" },
                { key: "noRepeats", text: "No repeated characters (aaa)" },
            ];

            checklist.innerHTML = checkItems.map(item => {
                const passed = result.checks[item.key];
                const icon = passed ? "✅" : "❌";
                const cls = passed ? "text-success" : "text-danger";
                return `<li class="${cls} small">${icon} ${item.text}</li>`;
            }).join("");
        }
    }

    /**
     * Trigger HIBP breach check via the API
     */
    function checkBreach(inputId, resultId) {
        const input = document.getElementById(inputId);
        const resultDiv = document.getElementById(resultId);
        if (!input || !resultDiv) return;

        const password = input.value;
        if (!password || password.length < 1) {
            resultDiv.innerHTML = "";
            return;
        }

        resultDiv.innerHTML = '<span class="text-muted small"><i class="bi bi-hourglass-split"></i> Checking breach databases...</span>';

        fetch("/api/check-password-breach", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.breach_count > 0) {
                resultDiv.innerHTML =
                    `<div class="alert alert-danger py-2 small">
                        <i class="bi bi-exclamation-triangle-fill"></i>
                        <strong>Warning!</strong> This password has been found in
                        <strong>${data.breach_count.toLocaleString()}</strong> data breaches.
                        You should never use this password.
                    </div>`;
            } else {
                resultDiv.innerHTML =
                    `<div class="alert alert-success py-2 small">
                        <i class="bi bi-shield-check"></i>
                        This password has <strong>not been found</strong> in any known data breaches.
                    </div>`;
            }
        })
        .catch(() => {
            resultDiv.innerHTML =
                `<div class="alert alert-secondary py-2 small">
                    <i class="bi bi-info-circle"></i>
                    Unable to check breach status right now. Try again later.
                </div>`;
        });
    }

    // Debounce helper
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    /**
     * Initialize the password meter on a page.
     * Call this with the IDs of your elements.
     */
    window.initPasswordMeter = function (options) {
        const opts = Object.assign({
            inputId: "password-input",
            barId: "strength-bar",
            labelId: "strength-label",
            checklistId: "strength-checklist",
            breachResultId: "breach-result",
        }, options);

        const input = document.getElementById(opts.inputId);
        if (!input) return;

        // Real-time strength check on every keystroke
        input.addEventListener("input", function () {
            updateMeter(opts.inputId, opts.barId, opts.labelId, opts.checklistId);
        });

        // Debounced breach check (800ms after user stops typing)
        const debouncedBreach = debounce(function () {
            checkBreach(opts.inputId, opts.breachResultId);
        }, 800);

        input.addEventListener("input", debouncedBreach);
    };
})();
