document.addEventListener('DOMContentLoaded', () => {

    // --- Theme Management ---
    const getSystemTheme = () => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const getInitialTheme = () => {
        const savedTheme = localStorage.getItem('moedove-theme');
        if (savedTheme) return savedTheme;
        return getSystemTheme();
    };

    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('moedove-theme', theme);
    };

    const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    };

    // Initialize theme
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);

    // Theme toggle button event listener
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Listen for system theme changes (optional: auto-update if user hasn't manually set a preference)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only auto-update if user hasn't manually set a preference
        if (!localStorage.getItem('moedove-theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });


    // --- Custom Language Switcher Logic ---
    const customSelect = document.getElementById('custom-language-selector');
    const selectSelected = customSelect.querySelector('.select-selected');
    const selectItems = customSelect.querySelector('.select-items');
    const selectOptions = selectItems.querySelectorAll('div');
    const elementsToTranslate = document.querySelectorAll('[data-lang]');

    const languageMap = {
        'en': 'English',
        'zh-cn': '简体中文',
        'zh-tw': '繁體中文'
    };

    const setLanguage = (lang) => {
        document.documentElement.lang = lang;
        elementsToTranslate.forEach(element => {
            const key = element.getAttribute('data-lang');
            if (translations[lang] && translations[lang][key]) {
                element.innerHTML = translations[lang][key];
            }
        });
        localStorage.setItem('moedove-lang', lang);
        selectSelected.textContent = languageMap[lang];

        // Update selected state
        selectOptions.forEach(option => {
            option.classList.remove('same-as-selected');
            if (option.getAttribute('data-value') === lang) {
                option.classList.add('same-as-selected');
            }
        });
    };

    const getInitialLanguage = () => {
        const savedLang = localStorage.getItem('moedove-lang');
        if (savedLang && translations[savedLang]) return savedLang;
        const browserLang = navigator.language.slice(0, 2);
        if (browserLang === 'zh') return (navigator.language.match(/CN/i)) ? 'zh-cn' : 'zh-tw';
        if (browserLang === 'ru') return 'ru';
        return 'en';
    };

    // Toggle dropdown
    selectSelected.addEventListener('click', (e) => {
        e.stopPropagation();
        selectItems.classList.toggle('select-hide');
        selectSelected.classList.toggle('select-arrow-active');
    });

    // Select option
    selectOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const value = option.getAttribute('data-value');
            setLanguage(value);
            selectItems.classList.add('select-hide');
            selectSelected.classList.remove('select-arrow-active');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        selectItems.classList.add('select-hide');
        selectSelected.classList.remove('select-arrow-active');
    });

    const initialLang = getInitialLanguage();
    setLanguage(initialLang);

    // --- Header Scroll Effect ---
    const header = document.getElementById('main-header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // --- Mobile Menu Toggle ---
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    // --- NEW: Animated Counter for Stats Bar ---
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // The lower the number, the faster the count

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const inc = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + inc);
            setTimeout(() => animateCounter(counter), 1);
        } else {
            counter.innerText = target;
        }
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => {
                    animateCounter(counter);
                });
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, {
        threshold: 0.5 // Start animation when 50% of the element is visible
    });

    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
        observer.observe(statsBar);
    }
});