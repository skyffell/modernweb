// Main JavaScript file
class WebsiteApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadServices();
        this.setupContactForm();
        this.initializeAnimations();
        this.setupMobileMenu();
    }

    setupEventListeners() {
        // Header scroll effect
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    handleScroll() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    }

    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking on links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    }

    async loadServices() {
        const container = document.getElementById('services-container');
        const fullContainer = document.getElementById('services-full-container');
        
        if (!container && !fullContainer) return;

        try {
            const response = await fetch('/api/services');
            const services = await response.json();

            const serviceHTML = services.map(service => `
                <div class="service-card animate-on-scroll">
                    <div class="service-icon">${service.icon}</div>
                    <h3>${service.title}</h3>
                    <p>${service.description}</p>
                </div>
            `).join('');

            if (container) container.innerHTML = serviceHTML;
            if (fullContainer) fullContainer.innerHTML = serviceHTML;

            // Re-initialize animations for dynamically loaded content
            this.initializeScrollAnimations();
        } catch (error) {
            console.error('Error loading services:', error);
            const errorHTML = '<p>Не удалось загрузить услуги. Пожалуйста, попробуйте позже.</p>';
            if (container) container.innerHTML = errorHTML;
            if (fullContainer) fullContainer.innerHTML = errorHTML;
        }
    }

    setupContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                message: formData.get('message')
            };

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            try {
                submitBtn.textContent = 'Отправка...';
                submitBtn.disabled = true;

                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                
                if (response.ok) {
                    this.showNotification('Сообщение успешно отправлено!', 'success');
                    form.reset();
                } else {
                    this.showNotification('Ошибка при отправке сообщения', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                this.showNotification('Ошибка сети. Попробуйте позже.', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        if (type === 'success') {
            notification.style.background = '#10b981';
        } else {
            notification.style.background = '#ef4444';
        }

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    initializeAnimations() {
        // Remove preloader
        window.addEventListener('load', () => {
            setTimeout(() => {
                const preloader = document.querySelector('.preloader');
                if (preloader) {
                    preloader.style.opacity = '0';
                    setTimeout(() => {
                        preloader.style.display = 'none';
                    }, 500);
                }
            }, 1000);
        });

        // Initial fade-up animations
        setTimeout(() => {
            document.querySelectorAll('.animate-fade-up').forEach((element, index) => {
                const delay = element.dataset.delay || 0;
                setTimeout(() => {
                    element.classList.add('animated');
                }, delay);
            });
        }, 300);

        // Scroll animations
        this.initializeScrollAnimations();
    }

    initializeScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WebsiteApp();
});