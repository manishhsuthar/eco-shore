// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            // Add rotation animation to hamburger icon
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = mobileMenu.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(90deg)';
            }
        });

        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.style.transform = 'rotate(0deg)';
                }
            });
        });
    }

    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('nav');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Enhanced scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-up');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections and cards for scroll animations
    const animatedElements = document.querySelectorAll('.animate-fade-up, .animate-zoom-in, .bg-white.rounded-2xl, section');
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
        observer.observe(element);
    });

    // Enhanced button interactions with ripple effect
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Add pulse effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Add hover sound effect simulation (visual feedback)
    const interactiveElements = document.querySelectorAll('.card-hover, button, a');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.3s ease-out';
        });
    });

    // Form submission handling (placeholder)
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Add loading state to submit button
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Message Sent!';
                submitBtn.classList.remove('from-ocean-blue', 'to-turquoise');
                submitBtn.classList.add('from-seafoam', 'to-emerald-500');
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('from-seafoam', 'to-emerald-500');
                    submitBtn.classList.add('from-ocean-blue', 'to-turquoise');
                    this.reset();
                }, 2000);
            }, 1500);
        });
    }

    // Enhanced carousel functionality for touch devices
    const carousels = document.querySelectorAll('.animate-slide');
    carousels.forEach(carousel => {
        let isTouch = false;
        
        carousel.addEventListener('touchstart', () => {
            isTouch = true;
            carousel.style.animationPlayState = 'paused';
        });
        
        carousel.addEventListener('touchend', () => {
            if (isTouch) {
                setTimeout(() => {
                    carousel.style.animationPlayState = 'running';
                }, 2000);
            }
        });
        
        carousel.addEventListener('mouseenter', () => {
            if (!isTouch) {
                carousel.style.animationPlayState = 'paused';
            }
        });
        
        carousel.addEventListener('mouseleave', () => {
            if (!isTouch) {
                carousel.style.animationPlayState = 'running';
            }
        });
    });

    // Parallax effect for hero video
    const heroVideo = document.querySelector('video');
    if (heroVideo) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            heroVideo.style.transform = `translateY(${parallax}px)`;
        });
    }

    // Enhanced page transition effects
    const pageLinks = document.querySelectorAll('a[href$=".html"]');
    pageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== window.location.pathname.split('/').pop()) {
                e.preventDefault();
                
                // Add fade out effect
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.3s ease';
                
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        });
    });

    // Fade in effect on page load
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.5s ease';
    });
});