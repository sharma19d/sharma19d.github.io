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

    const hackerName = document.querySelector('.hacker-name');
    if (hackerName) {
        const originalName = hackerName.getAttribute('aria-label') || hackerName.textContent.trim();
        const substitutions = {
            a: ['4', '@'],
            e: ['3'],
            i: ['1', '!'],
            o: ['0'],
            r: ['4'],
            s: ['5', '$'],
            v: ['\\/'],
            y: ['7']
        };

        let charIndex = 0;
        let variantIndex = 0;

        const mutableIndexes = [...originalName]
            .map((char, index) => ({ char: char.toLowerCase(), index }))
            .filter(({ char }) => substitutions[char]);

        const renderMutation = () => {
            if (!mutableIndexes.length) {
                return;
            }

            const { char, index } = mutableIndexes[charIndex];
            const options = substitutions[char];
            const replacement = options[variantIndex % options.length];
            const nextName = [...originalName]
                .map((letter, letterIndex) => (letterIndex === index ? replacement : letter))
                .join('');

            hackerName.textContent = nextName;
            hackerName.setAttribute('data-text', nextName);

            window.setTimeout(() => {
                hackerName.textContent = originalName;
                hackerName.setAttribute('data-text', originalName);
            }, 520);

            variantIndex += 1;
            charIndex = (charIndex + 1) % mutableIndexes.length;
        };

        renderMutation();
        window.setInterval(renderMutation, 1500);
    }

    console.log('Vanilla JS Portfolio Loaded. Ready to rock.');
});
