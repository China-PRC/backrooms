document.addEventListener('DOMContentLoaded', function () {
    // small debounce helper
    function debounce(fn, wait) { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); }; }

    // enhance each nav-group with accessible hamburger and delayed close
    document.querySelectorAll('.nav-group').forEach(group => {
        const dropdown = group.querySelector('.nav-dropdown');
        const title = group.querySelector('.nav-title');
        if (!dropdown || !title) return;

        // ensure aria attributes
        title.setAttribute('role', 'button');
        title.setAttribute('tabindex', '0');
        group.setAttribute('aria-haspopup', 'true');

        // inject hamburger toggler if not present
        if (!title.querySelector('.hamburger')) {
            const ham = document.createElement('span');
            ham.className = 'hamburger';
            ham.setAttribute('role', 'button');
            ham.setAttribute('aria-label', 'toggle menu');
            ham.tabIndex = 0;
            ham.innerHTML = '<i></i><i></i><i></i>';
            title.appendChild(ham);

            const openGroup = () => {
                group.classList.add('open');
                title.setAttribute('aria-expanded', 'true');
                const first = dropdown.querySelector('a'); if (first) first.focus();
            };
            const closeGroup = () => { group.classList.remove('open'); title.setAttribute('aria-expanded', 'false'); };
            const toggle = () => (group.classList.contains('open') ? closeGroup() : openGroup());

            // click and keyboard for hamburger
            ham.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
            ham.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });

            // also allow clicking the title label to toggle (but not following links if it's an <a>)
            title.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
            title.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });

            // close on ESC when group is open
            document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeGroup(); });

            // delayed close on pointerleave to make it usable on hover/touch
            let leaveTimer = null;
            const scheduleClose = debounce(() => { closeGroup(); }, 1000);
            group.addEventListener('pointerleave', () => scheduleClose());
            group.addEventListener('pointerenter', () => { /* cancel close by calling debounce with immediate clear */ scheduleClose.cancel && scheduleClose.cancel(); });

            // expose cancel on debounce (lightweight)
            scheduleClose.cancel = () => { /* no-op for current simple debounce */ };
        }
    });

    // Close any open dropdown when clicking outside (debounced to avoid flicker)
    document.addEventListener('click', debounce((e) => {
        document.querySelectorAll('.nav-group.open').forEach(group => {
            if (!group.contains(e.target)) group.classList.remove('open');
        });
    }, 50));
});
