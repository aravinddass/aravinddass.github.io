/* =========================================================
   Aravind Dass — Portfolio interactions
   ========================================================= */

(function () {
    "use strict";

    var root = document.documentElement;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- Theme ---------- */

    var themeToggle = document.querySelector("[data-theme-toggle]");
    var themeMeta = document.querySelector('meta[name="theme-color"]');

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        if (themeMeta) {
            themeMeta.setAttribute("content", theme === "dark" ? "#0c0c0e" : "#f4f1ea");
        }
        if (themeToggle) {
            themeToggle.setAttribute(
                "aria-label",
                theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            );
        }
    }

    applyTheme(root.getAttribute("data-theme") || "light");

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
            applyTheme(next);
            try {
                localStorage.setItem("theme", next);
            } catch (e) {
                /* storage unavailable — theme still applies for this visit */
            }
        });
    }

    /* ---------- Mobile menu ---------- */

    var menuToggle = document.querySelector("[data-menu-toggle]");
    var navLinks = document.querySelector("[data-nav-links]");

    function setMenu(open) {
        if (!menuToggle || !navLinks) return;
        navLinks.classList.toggle("open", open);
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function () {
            setMenu(!navLinks.classList.contains("open"));
        });

        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                setMenu(false);
            });
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") setMenu(false);
        });

        document.addEventListener("click", function (event) {
            if (
                navLinks.classList.contains("open") &&
                !navLinks.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                setMenu(false);
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 900) setMenu(false);
        });
    }

    /* ---------- Header + scroll progress ---------- */

    var header = document.querySelector("[data-header]");
    var progress = document.querySelector("[data-progress]");
    var ticking = false;

    function onScroll() {
        var y = window.scrollY || document.documentElement.scrollTop;

        if (header) header.classList.toggle("scrolled", y > 8);

        if (progress) {
            var max = document.documentElement.scrollHeight - window.innerHeight;
            var ratio = max > 0 ? Math.min(y / max, 1) : 0;
            progress.style.width = (ratio * 100).toFixed(2) + "%";
        }

        ticking = false;
    }

    window.addEventListener(
        "scroll",
        function () {
            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(onScroll);
            }
        },
        { passive: true }
    );

    onScroll();

    /* ---------- Reveal on scroll ---------- */

    var revealItems = document.querySelectorAll(".reveal");

    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealItems.forEach(function (item) {
            item.classList.add("in");
        });
    } else {
        var revealObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );

        revealItems.forEach(function (item) {
            revealObserver.observe(item);
        });
    }

    /* ---------- Active nav link ---------- */

    var sections = document.querySelectorAll("main section[id]");
    var navAnchors = document.querySelectorAll(".nav-links a[href^='#']");

    if ("IntersectionObserver" in window && sections.length && navAnchors.length) {
        var spy = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    var id = entry.target.getAttribute("id");
                    navAnchors.forEach(function (anchor) {
                        anchor.classList.toggle(
                            "active",
                            anchor.getAttribute("href") === "#" + id
                        );
                    });
                });
            },
            { rootMargin: "-40% 0px -52% 0px", threshold: 0 }
        );

        sections.forEach(function (section) {
            spy.observe(section);
        });
    }

    /* ---------- Copy email ---------- */

    var copyButton = document.querySelector("[data-copy-email]");
    var email = "aravind181229@gmail.com";

    function legacyCopy(text) {
        var area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        try {
            document.execCommand("copy");
        } catch (e) {
            /* ignore */
        }
        document.body.removeChild(area);
    }

    if (copyButton) {
        copyButton.addEventListener("click", function () {
            var label = copyButton.querySelector("[data-copy-label]");
            var original = label ? label.textContent : "Copy email";
            var done = function () {
                if (!label) return;
                label.textContent = "Copied!";
                copyButton.classList.add("copied");
                window.setTimeout(function () {
                    label.textContent = original;
                    copyButton.classList.remove("copied");
                }, 2000);
            };

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(done, function () {
                    legacyCopy(email);
                    done();
                });
            } else {
                legacyCopy(email);
                done();
            }
        });
    }

    /* ---------- Portrait tilt ---------- */

    var tiltTarget = document.querySelector("[data-tilt]");

    if (
        tiltTarget &&
        !reduceMotion &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
        var tiltFrame = null;

        tiltTarget.addEventListener("pointermove", function (event) {
            var rect = tiltTarget.getBoundingClientRect();
            var px = (event.clientX - rect.left) / rect.width - 0.5;
            var py = (event.clientY - rect.top) / rect.height - 0.5;

            if (tiltFrame) window.cancelAnimationFrame(tiltFrame);
            tiltFrame = window.requestAnimationFrame(function () {
                tiltTarget.style.setProperty("--ry", (px * 6).toFixed(2) + "deg");
                tiltTarget.style.setProperty("--rx", (-py * 5).toFixed(2) + "deg");
            });
        });

        tiltTarget.addEventListener("pointerleave", function () {
            tiltTarget.style.setProperty("--ry", "0deg");
            tiltTarget.style.setProperty("--rx", "0deg");
        });
    }

    /* ---------- Card glow follows pointer ---------- */

    if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
        document.querySelectorAll(".card").forEach(function (card) {
            card.addEventListener("pointermove", function (event) {
                var rect = card.getBoundingClientRect();
                card.style.setProperty("--mx", event.clientX - rect.left + "px");
                card.style.setProperty("--my", event.clientY - rect.top + "px");
            });
        });
    }

    /* ---------- Footer year ---------- */

    var year = document.querySelector("[data-year]");
    if (year) year.textContent = String(new Date().getFullYear());
})();
