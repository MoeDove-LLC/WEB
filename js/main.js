document.addEventListener('DOMContentLoaded', () => {
    const supportedLanguages = ['en', 'zh-cn', 'zh-tw'];
    const themeStorageKey = 'moedove-theme-v2';

    const setTheme = (theme) => {
        const safeTheme = theme === 'dark' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', safeTheme);
        localStorage.setItem(themeStorageKey, safeTheme);

        const themeColor = document.querySelector('meta[name="theme-color"]');
        if (themeColor) {
            themeColor.setAttribute('content', safeTheme === 'dark' ? '#181820' : '#fffdf7');
        }
    };

    setTheme(localStorage.getItem(themeStorageKey) || 'light');

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    const languageSelector = document.getElementById('language-selector');
    const elementsToTranslate = document.querySelectorAll('[data-lang]');

    const getInitialLanguage = () => {
        const savedLanguage = localStorage.getItem('moedove-lang');
        if (supportedLanguages.includes(savedLanguage)) {
            return savedLanguage;
        }

        const browserLanguage = (navigator.language || '').toLowerCase();
        if (browserLanguage.startsWith('zh')) {
            return /cn|hans/.test(browserLanguage) ? 'zh-cn' : 'zh-tw';
        }
        return 'en';
    };

    const setLanguage = (language) => {
        const safeLanguage = supportedLanguages.includes(language) ? language : 'en';
        const dictionary = typeof translations !== 'undefined' ? translations[safeLanguage] : null;
        if (!dictionary) return;

        document.documentElement.lang = safeLanguage;
        elementsToTranslate.forEach((element) => {
            const key = element.getAttribute('data-lang');
            if (dictionary[key]) {
                element.innerHTML = dictionary[key];
            }
        });

        const titleElement = document.querySelector('title[data-lang]');
        const titleKey = titleElement ? titleElement.getAttribute('data-lang') : null;
        if (titleKey && dictionary[titleKey]) {
            document.title = dictionary[titleKey];
        }

        if (languageSelector) {
            languageSelector.value = safeLanguage;
        }
        localStorage.setItem('moedove-lang', safeLanguage);
    };

    if (languageSelector) {
        languageSelector.addEventListener('change', (event) => {
            setLanguage(event.target.value);
        });
    }
    setLanguage(getInitialLanguage());

    const header = document.getElementById('main-header');
    if (header) {
        const updateHeader = () => {
            header.classList.toggle('scrolled', window.scrollY > 18);
        };
        updateHeader();
        window.addEventListener('scroll', updateHeader, { passive: true });
    }

    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    const closeMobileMenu = () => {
        if (!mobileMenuToggle || !mobileMenu) return;
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    };

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active', isOpen);
            mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
            document.body.classList.toggle('menu-open', isOpen);
        });

        mobileMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMobileMenu);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeMobileMenu();
        });
    }

    const counters = document.querySelectorAll('.stat-number[data-target]');
    const animateCounter = (counter) => {
        if (counter.dataset.animated === 'true') return;
        counter.dataset.animated = 'true';

        const target = Number(counter.getAttribute('data-target')) || 0;
        const duration = 1200;
        const startTime = performance.now();

        const tick = (time) => {
            const progress = Math.min((time - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            counter.textContent = Math.round(target * eased).toString();
            if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    };

    if (counters.length) {
        const statsBar = document.querySelector('.stats-bar');
        if ('IntersectionObserver' in window && statsBar) {
            const observer = new IntersectionObserver((entries, observerInstance) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    counters.forEach(animateCounter);
                    observerInstance.unobserve(entry.target);
                });
            }, { threshold: 0.25 });
            observer.observe(statsBar);
        } else {
            counters.forEach(animateCounter);
        }
    }

    if (window.lucide) {
        window.lucide.createIcons();
    }
});
