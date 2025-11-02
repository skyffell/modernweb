// Advanced animations and effects
class AdvancedAnimations {
    constructor() {
        this.initParticleEffects();
        this.initParallax();
        this.initTextAnimations();
        this.initHoverEffects();
    }

    initParticleEffects() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;

        // Create particle container
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
            z-index: 1;
        `;
        heroSection.appendChild(particlesContainer);

        // Create particles
        for (let i = 0; i < 15; i++) {
            this.createParticle(particlesContainer);
        }
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--primary-color);
            border-radius: 50%;
            opacity: 0.3;
        `;

        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;

        container.appendChild(particle);

        // Animate particle
        this.animateParticle(particle);
    }

    animateParticle(particle) {
        const duration = 3000 + Math.random() * 4000;
        const delay = Math.random() * 2000;

        const keyframes = [
            { 
                transform: 'translateY(0) scale(1)',
                opacity: 0.3
            },
            { 
                transform: `translateY(${-20 - Math.random() * 50}px) scale(${0.5 + Math.random()})`,
                opacity: 0.1
            },
            { 
                transform: 'translateY(0) scale(1)',
                opacity: 0.3
            }
        ];

        const options = {
            duration: duration,
            delay: delay,
            iterations: Infinity
        };

        particle.animate(keyframes, options);
    }

    initParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    initTextAnimations() {
        // Animate text on hover
        const animatedTexts = document.querySelectorAll('.animated-text');
        
        animatedTexts.forEach(text => {
            text.addEventListener('mouseenter', (e) => {
                this.animateText(e.target);
            });
        });
    }

    animateText(element) {
        const letters = element.textContent.split('');
        element.textContent = '';
        
        letters.forEach((letter, index) => {
            const span = document.createElement('span');
            span.textContent = letter;
            span.style.display = 'inline-block';
            span.style.transition = 'transform 0.3s ease';
            
            element.appendChild(span);
            
            setTimeout(() => {
                span.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    span.style.transform = 'translateY(0)';
                }, 300);
            }, index * 50);
        });
    }

    initHoverEffects() {
        // Add hover effects to cards
        const cards = document.querySelectorAll('.feature-card, .service-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.tiltCard(e.currentTarget, 5);
            });
            
            card.addEventListener('mouseleave', (e) => {
                this.tiltCard(e.currentTarget, 0);
            });
        });
    }

    tiltCard(card, degrees) {
        card.style.transform = `perspective(1000px) rotateX(${degrees}deg) rotateY(${degrees}deg)`;
    }
}

// Initialize advanced animations
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedAnimations();
});

// Additional utility animations
const AnimationUtils = {
    // Typewriter effect
    typewriter(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    },

    // Fade in elements sequentially
    staggerFadeIn(elements, delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * delay);
        });
    },

    // Create ripple effect
    createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add('ripple');

        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
    }
};

// Add ripple effect to buttons
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', AnimationUtils.createRipple);
    });
});

// CSS for ripple effect
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.7);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .btn {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(rippleStyle);