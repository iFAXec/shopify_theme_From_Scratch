(function () {
    var wrapper = document.getElementById('sidebarDrawer');
    var closeBtn = wrapper.querySelector('.sidebar-drawer-close-btn');
    var backdrop = wrapper.querySelector('.sidebar-drawer-backdrop');

    function openSidebar() {
        wrapper.classList.add('open');
    }
    function closeSidebar() {
        wrapper.classList.remove('open');
    }
    // Open sidebar on cart icon click
    document.getElementById("header-cart-icon").addEventListener('click', (e) => {
        e.preventDefault();
        if (wrapper.classList.contains('open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    closeBtn.addEventListener('click', closeSidebar);
    backdrop.addEventListener('click', closeSidebar);
    document.addEventListener('keydown', function (e) {
        if (wrapper.classList.contains('open') && e.key === 'Escape') {
            closeSidebar();
        }
    });
})();