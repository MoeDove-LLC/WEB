document.addEventListener('DOMContentLoaded', () => {

    // --- Language Switcher Logic (Same as before) ---
    const languageSwitcher = document.getElementById('language-switcher');
    const elementsToTranslate = document.querySelectorAll('[data-lang]');

    const setLanguage = (lang) => {
        document.documentElement.lang = lang;
        elementsToTranslate.forEach(element => {
            const key = element.getAttribute('data-lang');
            if (translations[lang] && translations[lang][key]) {
                element.innerHTML = translations[lang][key];
            }
        });
        localStorage.setItem('moedove-lang', lang);
    };

    const getInitialLanguage = () => {
        const savedLang = localStorage.getItem('moedove-lang');
        if (savedLang && translations[savedLang]) return savedLang;
        const browserLang = navigator.language.slice(0, 2);
        if (browserLang === 'zh') return (navigator.language.match(/CN/i)) ? 'zh-cn' : 'zh-tw';
        if (browserLang === 'ru') return 'ru';
        return 'en';
    };

    languageSwitcher.addEventListener('change', (event) => setLanguage(event.target.value));

    const initialLang = getInitialLanguage();
    languageSwitcher.value = initialLang;
    setLanguage(initialLang);

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