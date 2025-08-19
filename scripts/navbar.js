document.addEventListener('DOMContentLoaded', function () {
    // Find all nav-groups that have a dropdown
    document.querySelectorAll('.nav-group').forEach(group => {
        const dropdown = group.querySelector('.nav-dropdown');
        const title = group.querySelector('.nav-title');
        if (!dropdown || !title) return;

        // create hamburger toggler if not exists
        if (!title.querySelector('.hamburger')) {
            const ham = document.createElement('span');
            ham.className = 'hamburger';
            ham.setAttribute('role', 'button');
            ham.setAttribute('aria-label', 'toggle menu');
            ham.tabIndex = 0;
            ham.innerHTML = '<i></i><i></i><i></i>';
            title.appendChild(ham);

            const toggle = () => {
                const isOpen = group.classList.toggle('open');
                // when opened, focus first link for keyboard users
                if (isOpen) {
                    const first = dropdown.querySelector('a');
                    if (first) first.focus();
                }
            };

            ham.addEventListener('click', (e) => {
                e.stopPropagation();
                toggle();
            });
            ham.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
            });
        }
    });

    // Close any open dropdown when clicking outside
    document.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-group.open').forEach(group => {
            if (!group.contains(e.target)) group.classList.remove('open');
        });
    });
});
