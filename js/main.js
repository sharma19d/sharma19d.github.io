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

    // macOS Window Modal Logic for About Me
    const openFolderBtn = document.getElementById('open-bio-folder');
    const closeWindowBtn = document.getElementById('close-bio-modal');
    const bioModal = document.getElementById('bio-modal');

    if (openFolderBtn && bioModal) {
        const closeIcon = openFolderBtn.querySelector('.folder-close-state');
        const openIcon = openFolderBtn.querySelector('.folder-open-state');

        openFolderBtn.addEventListener('click', () => {
            bioModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Disable scroll under modal
            
            if (closeIcon && openIcon) {
                closeIcon.style.display = 'none';
                openIcon.style.display = 'inline-block';
            }
        });

        if (closeWindowBtn) {
            const closeModal = () => {
                bioModal.classList.remove('active');
                document.body.style.overflow = ''; // Re-enable scroll
                
                if (closeIcon && openIcon) {
                    closeIcon.style.display = 'inline-block';
                    openIcon.style.display = 'none';
                }
            };

            closeWindowBtn.addEventListener('click', closeModal);
            
            // Close modal when clicking outside the window
            bioModal.addEventListener('click', (e) => {
                if (e.target === bioModal) {
                    closeModal();
                }
            });

            // Close modal when pressing Escape key
            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && bioModal.classList.contains('active')) {
                    closeModal();
                }
            });
        }
    }

    console.log("Vanilla JS Portfolio Loaded. Ready to rock.");
});
