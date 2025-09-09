"use strict";

(function () {
    let siteData = null;

    function getFilename() {
        const path = window.location.pathname;
        const last = path.substring(path.lastIndexOf("/") + 1);
        return last || "index.html";
    }

    function byId(id) {
        try { return document.getElementById(id) || null; } catch (_) { return null; }
    }

    function setText(el, text) {
        if (el && typeof text === "string" && text.trim().length > 0) {
            el.textContent = text;
        }
    }

    function setHTML(el, html) {
        if (el && typeof html === "string") {
            el.innerHTML = html;
        }
    }

    function setHref(el, href) {
        if (!el) return;
        if (typeof href === "string" && href.trim().length > 0) {
            el.setAttribute("href", href);
        }
    }

    function hide(el) {
        if (el) el.style.display = "none";
    }

    function createEl(tag, className) {
        const el = document.createElement(tag);
        if (className) el.className = className;
        return el;
    }

    function resolve(obj, path, fallback) {
        try {
            const val = path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
            return val !== undefined && val !== null ? val : fallback;
        } catch (_) {
            return fallback;
        }
    }

    function applySEO() {
        if (!siteData || !siteData.site || !siteData.site.seo) return;
        const filename = getFilename();
        const seo = siteData.site.seo;
        const description = (seo.pages && seo.pages[filename]) || seo.default_description || "";

        // Title: keep existing if already specific, else use site name
        const existingTitle = document.title || "";
        if (!existingTitle || existingTitle.toLowerCase().includes("start bootstrap") || existingTitle === "") {
            if (filename === "index.html") {
                document.title = siteData.site.name || existingTitle || document.title;
            } else {
                document.title = `${siteData.site.name || ""}`.trim() || existingTitle || document.title;
            }
        }

        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
            meta = document.createElement("meta");
            meta.setAttribute("name", "description");
            document.head.appendChild(meta);
        }
        if (description) meta.setAttribute("content", description);
    }

    function renderHero() {
        if (!siteData || !siteData.site) return;
        // Navbar brand text
        const brand = document.querySelector(".navbar .navbar-brand");
        setText(brand, siteData.site.name || brand?.textContent || "");

        // Header elements on index page
        const header = document.querySelector("header");
        if (!header) return;

        const sub = header.querySelector(".fs-3.fw-light, .fs-3.fw-light.text-muted");
        const mainSpan = header.querySelector("h1.display-3 .text-gradient.d-inline, h1.display-3 span");
        const ctaButtons = header.querySelectorAll("a.btn");

        const headline = resolve(siteData, "site.hero_headline", null);
        const subheadline = resolve(siteData, "site.hero_subheadline", null);
        if (subheadline) setText(sub, subheadline);
        if (headline) setText(mainSpan, headline);

        // Buttons: assume first is resume, second is projects (matching current markup)
        if (ctaButtons && ctaButtons.length >= 2) {
            const resumeBtn = ctaButtons[0];
            const projectsBtn = ctaButtons[1];
            const resumeHref = resolve(siteData, "site.cta_resume_href", "resume.html");
            const projectsHref = resolve(siteData, "site.cta_projects_href", "projects.html");
            setHref(resumeBtn, resumeHref || "resume.html");
            setHref(projectsBtn, projectsHref || "projects.html");
        }
    }

    function renderProjects() {
        if (!siteData || !Array.isArray(siteData.projects)) return;
        const projects = siteData.projects;
        if (projects.length === 0) {
            // Try to hide container if present
            const container = document.querySelector("section.py-5 .container.px-5.mb-5, #projects-list");
            hide(container);
            return;
        }

        // Prefer an explicit container if author adds one later
        let container = document.getElementById("projects-list");
        if (!container) {
            container = document.querySelector("section.py-5 .container.px-5.mb-5");
        }
        if (!container) return;

        // Build list
        const wrapperRow = createEl("div", "row gx-5 justify-content-center");
        const col = createEl("div", "col-lg-11 col-xl-9 col-xxl-8");
        wrapperRow.appendChild(col);

        projects.forEach((proj) => {
            const card = createEl("div", "card overflow-hidden shadow rounded-4 border-0 mb-5");
            const body = createEl("div", "card-body p-0");
            const flex = createEl("div", "d-flex align-items-center");

            const left = createEl("div", "p-5");
            const h2 = createEl("h2", "fw-bolder");
            setText(h2, proj.title || "");
            const p = document.createElement("p");
            setText(p, proj.summary || "");

            // Tags
            const tagsWrap = createEl("div", "mt-3");
            if (Array.isArray(proj.stack)) {
                proj.stack.forEach((tag) => {
                    const badge = createEl("span", "badge border me-2");
                    badge.style.borderColor = "var(--bs-primary)";
                    badge.style.color = "var(--bs-primary)";
                    setText(badge, String(tag));
                    tagsWrap.appendChild(badge);
                });
            }

            // Links
            const linkWrap = createEl("div", "mt-3");
            if (proj.links && (proj.links.github || proj.links.demo || proj.links.post)) {
                if (proj.links.github) {
                    const a = createEl("a", "btn btn-sm btn-outline-dark me-2");
                    setText(a, "GitHub");
                    setHref(a, proj.links.github);
                    linkWrap.appendChild(a);
                }
                if (proj.links.demo) {
                    const a = createEl("a", "btn btn-sm btn-outline-dark me-2");
                    setText(a, "Demo");
                    setHref(a, proj.links.demo);
                    linkWrap.appendChild(a);
                }
                if (proj.links.post) {
                    const a = createEl("a", "btn btn-sm btn-outline-dark");
                    setText(a, "Post");
                    setHref(a, proj.links.post);
                    linkWrap.appendChild(a);
                }
            }

            left.appendChild(h2);
            left.appendChild(p);
            if (tagsWrap.childElementCount) left.appendChild(tagsWrap);
            if (linkWrap.childElementCount) left.appendChild(linkWrap);

            const img = createEl("img", "img-fluid");
            img.alt = proj.title || "Project image";
            if (proj.cover_image) img.src = proj.cover_image;
            img.addEventListener("error", () => { img.style.display = "none"; });

            flex.appendChild(left);
            flex.appendChild(img);
            body.appendChild(flex);
            card.appendChild(body);
            col.appendChild(card);
        });

        // Swap content only inside container
        container.innerHTML = "";
        container.appendChild(wrapperRow);
    }

    function renderWork() {
        if (!siteData || !Array.isArray(siteData.work)) return;
        const work = siteData.work;
        if (work.length === 0) {
            // resume.html experience section
            const expHeader = document.querySelector("h2.text-primary.fw-bolder, h2.text-primary");
            if (expHeader) hide(expHeader.closest("section"));
            // work.html main
            const main = document.querySelector("main");
            if (main) hide(main);
            return;
        }

        // resume.html Experience section
        const expHeader = document.querySelector("h2.text-primary.fw-bolder, h2.text-primary");
        if (expHeader) {
            const section = expHeader.closest("section");
            if (section) {
                // Remove existing cards
                const cards = section.querySelectorAll(".card");
                cards.forEach((c) => c.remove());

                work.forEach((job) => {
                    const card = createEl("div", "card shadow border-0 rounded-4 mb-5");
                    const body = createEl("div", "card-body p-5");
                    const row = createEl("div", "row align-items-center gx-5");

                    const leftCol = createEl("div", "col text-center text-lg-start mb-4 mb-lg-0");
                    const leftBox = createEl("div", "bg-light p-4 rounded-4");
                    const dateDiv = createEl("div", "text-primary fw-bolder mb-2");
                    setText(dateDiv, job.dates || "");
                    const roleDiv = createEl("div", "small fw-bolder");
                    setText(roleDiv, job.role || "");
                    const companyDiv = createEl("div", "small text-muted");
                    setText(companyDiv, job.company || "");
                    const locDiv = createEl("div", "small text-muted");
                    setText(locDiv, job.location || "");
                    leftBox.appendChild(dateDiv);
                    leftBox.appendChild(roleDiv);
                    leftBox.appendChild(companyDiv);
                    leftBox.appendChild(locDiv);
                    leftCol.appendChild(leftBox);

                    const rightCol = createEl("div", "col-lg-8");
                    const bulletsWrap = createEl("ul", "mb-0");
                    if (Array.isArray(job.bullets)) {
                        job.bullets.forEach((b) => {
                            const li = document.createElement("li");
                            setText(li, b);
                            bulletsWrap.appendChild(li);
                        });
                    }
                    rightCol.appendChild(bulletsWrap);

                    row.appendChild(leftCol);
                    row.appendChild(rightCol);
                    body.appendChild(row);
                    card.appendChild(body);
                    section.appendChild(card);
                });
            }
        }

        // work.html
        const workMain = document.querySelector("body.work main, body main");
        // Only render if we're actually on work.html (by filename)
        if (getFilename() === "work.html") {
            const main = document.querySelector("main");
            if (main) {
                // Keep the h2 heading (if present) and replace the rest
                const heading = main.querySelector("h2");
                const newContent = createEl("div", "container px-5 my-4");

                work.forEach((job) => {
                    const card = createEl("div", "card shadow border-0 rounded-4 mb-4");
                    const body = createEl("div", "card-body p-4");
                    const title = createEl("div", "fw-bolder");
                    setText(title, `${job.role || ""} — ${job.company || ""}`.trim());
                    const meta = createEl("div", "small text-muted mb-2");
                    setText(meta, [job.dates, job.location].filter(Boolean).join(" · "));
                    const ul = createEl("ul", "mb-0");
                    if (Array.isArray(job.bullets)) {
                        job.bullets.forEach((b) => {
                            const li = document.createElement("li");
                            setText(li, b);
                            ul.appendChild(li);
                        });
                    }
                    body.appendChild(title);
                    body.appendChild(meta);
                    body.appendChild(ul);
                    card.appendChild(body);
                    newContent.appendChild(card);
                });

                // Replace main content preserving heading if exists
                main.innerHTML = heading ? "" : main.innerHTML;
                if (heading) main.appendChild(heading);
                main.appendChild(newContent);
            }
        }
    }

    function renderEducation() {
        if (!siteData || !siteData.education) return;
        const edu = siteData.education;
        const degrees = Array.isArray(edu.degrees) ? edu.degrees : [];
        const courses = edu.courses || { current: [], planned: [] };

        // resume.html Education section
        const eduHeader = document.querySelector("h2.text-secondary.fw-bolder, h2.text-secondary");
        if (eduHeader) {
            const section = eduHeader.closest("section");
            if (section) {
                // Remove existing cards
                const cards = section.querySelectorAll(".card");
                cards.forEach((c) => c.remove());

                degrees.forEach((d) => {
                    const card = createEl("div", "card shadow border-0 rounded-4 mb-5");
                    const body = createEl("div", "card-body p-5");
                    const row = createEl("div", "row align-items-center gx-5");

                    const leftCol = createEl("div", "col text-center text-lg-start mb-4 mb-lg-0");
                    const leftBox = createEl("div", "bg-light p-4 rounded-4");
                    const dateDiv = createEl("div", "text-secondary fw-bolder mb-2");
                    setText(dateDiv, d.dates || "");
                    const schoolDiv = createEl("div", "mb-2");
                    const schoolInner = createEl("div", "small fw-bolder");
                    setText(schoolInner, d.school || "");
                    const locationDiv = createEl("div", "small text-muted");
                    setText(locationDiv, d.program || "");
                    schoolDiv.appendChild(schoolInner);
                    schoolDiv.appendChild(locationDiv);
                    const italic = createEl("div", "fst-italic");
                    const degreeType = createEl("div", "small text-muted");
                    setText(degreeType, d.program || "");
                    const notesDiv = createEl("div", "small text-muted");
                    setText(notesDiv, d.notes || "");
                    italic.appendChild(degreeType);
                    if (d.notes) italic.appendChild(notesDiv);
                    leftBox.appendChild(dateDiv);
                    leftBox.appendChild(schoolDiv);
                    leftBox.appendChild(italic);
                    leftCol.appendChild(leftBox);

                    const rightCol = createEl("div", "col-lg-8");
                    const p = document.createElement("div");
                    setText(p, d.notes || "");
                    rightCol.appendChild(p);

                    row.appendChild(leftCol);
                    row.appendChild(rightCol);
                    body.appendChild(row);
                    card.appendChild(body);
                    section.appendChild(card);
                });
            }
        }

        // education.html page
        if (getFilename() === "education.html") {
            const main = document.querySelector("main");
            if (main) {
                const h2 = main.querySelector("h2") || createEl("h2", "");
                setText(h2, "Education");
                const container = createEl("div", "container px-5 my-4");

                // Degrees
                degrees.forEach((d) => {
                    const card = createEl("div", "card shadow border-0 rounded-4 mb-4");
                    const body = createEl("div", "card-body p-4");
                    const title = createEl("div", "fw-bolder");
                    setText(title, `${d.school || ""}`);
                    const meta = createEl("div", "small text-muted mb-2");
                    setText(meta, [d.program, d.dates].filter(Boolean).join(" · "));
                    const notes = document.createElement("div");
                    setText(notes, d.notes || "");
                    body.appendChild(title);
                    body.appendChild(meta);
                    if (d.notes) body.appendChild(notes);
                    card.appendChild(body);
                    container.appendChild(card);
                });

                // Courses
                const coursesRow = createEl("div", "row g-4");
                const currentCol = createEl("div", "col-md-6");
                const plannedCol = createEl("div", "col-md-6");
                const curHeader = createEl("h3", "fw-bolder"); setText(curHeader, "Current Courses");
                const planHeader = createEl("h3", "fw-bolder"); setText(planHeader, "Planned Courses");
                const curUl = createEl("ul", "mb-0");
                const planUl = createEl("ul", "mb-0");
                (Array.isArray(courses.current) ? courses.current : []).forEach((c) => {
                    const li = document.createElement("li"); setText(li, c); curUl.appendChild(li);
                });
                (Array.isArray(courses.planned) ? courses.planned : []).forEach((c) => {
                    const li = document.createElement("li"); setText(li, c); planUl.appendChild(li);
                });
                currentCol.appendChild(curHeader); currentCol.appendChild(curUl);
                plannedCol.appendChild(planHeader); plannedCol.appendChild(planUl);
                coursesRow.appendChild(currentCol); coursesRow.appendChild(plannedCol);

                main.innerHTML = "";
                main.appendChild(h2);
                main.appendChild(container);
                if (curUl.childElementCount || planUl.childElementCount) main.appendChild(coursesRow);
            }
        }
    }

    function initWithData(data) {
        siteData = data;
        try { applySEO(); } catch (_) {}
        try { renderHero(); } catch (_) {}
        try { if (getFilename() === "projects.html") renderProjects(); } catch (_) {}
        try { if (getFilename() === "resume.html" || getFilename() === "work.html") renderWork(); } catch (_) {}
        try { if (getFilename() === "resume.html" || getFilename() === "education.html") renderEducation(); } catch (_) {}
    }

    document.addEventListener("DOMContentLoaded", function () {
        const url = "data/content.json" + (window.location.hostname ? `?v=${Date.now()}` : "");
        fetch(url)
            .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to load content.json"))))
            .then((json) => initWithData(json))
            .catch(() => {
                // If content is missing, hide dynamic sections to avoid broken UI
                const filename = getFilename();
                if (filename === "projects.html") {
                    const container = document.querySelector("section.py-5 .container.px-5.mb-5, #projects-list");
                    hide(container);
                }
            });
    });

    // Expose helpers if needed for manual invocation
    window.applySEO = applySEO;
    window.renderHero = renderHero;
    window.renderProjects = renderProjects;
    window.renderWork = renderWork;
    window.renderEducation = renderEducation;
})();


