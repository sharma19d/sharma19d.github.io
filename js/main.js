document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // macOS Window Inline Logic for About Me
    const openFolderBtn = document.getElementById('open-bio-folder');
    const closeWindowBtn = document.getElementById('close-bio-modal');
    const minimizeWindowBtn = document.getElementById('minimize-bio-modal');
    const folderContainer = document.getElementById('bio-folder-container');
    const bioWindowWrapper = document.getElementById('bio-window-wrapper');

    if (openFolderBtn && bioWindowWrapper && folderContainer) {
        const openBio = () => {
            bioWindowWrapper.style.display = 'block';
            bioWindowWrapper.offsetHeight; // Force reflow
            bioWindowWrapper.classList.add('active');
            folderContainer.classList.add('hidden');
        };

        const closeBio = () => {
            bioWindowWrapper.classList.remove('active');
            folderContainer.classList.remove('hidden');
            setTimeout(() => {
                if (!bioWindowWrapper.classList.contains('active')) {
                    bioWindowWrapper.style.display = 'none';
                }
            }, 500);
        };

        openFolderBtn.addEventListener('click', openBio);

        if (closeWindowBtn) {
            closeWindowBtn.addEventListener('click', closeBio);
        }
        if (minimizeWindowBtn) {
            minimizeWindowBtn.addEventListener('click', closeBio);
        }

        // Close window when pressing Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && bioWindowWrapper.classList.contains('active')) {
                closeBio();
            }
        });
    }

    console.log("Vanilla JS Portfolio Loaded. Ready to rock.");
});
