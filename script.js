// Sample campaign data
const campaigns = [
    {
        id: 1,
        title: "Education for Rural Children",
        description: "Help us build schools and provide educational resources for children in remote villages who have no access to quality education.",
        category: "education",
        target: 50000,
        raised: 35000,
        icon: "fas fa-graduation-cap",
        image: "education"
    },
    {
        id: 2,
        title: "Clean Water Initiative",
        description: "Install water purification systems in communities that lack access to clean drinking water, preventing waterborne diseases.",
        category: "healthcare",
        target: 75000,
        raised: 45000,
        icon: "fas fa-tint",
        image: "water"
    },
    {
        id: 3,
        title: "Food Security Program",
        description: "Provide nutritious meals and food security training to families struggling with hunger and malnutrition.",
        category: "hunger",
        target: 30000,
        raised: 18000,
        icon: "fas fa-utensils",
        image: "food"
    },
    {
        id: 4,
        title: "Medical Equipment Drive",
        description: "Supply essential medical equipment to rural clinics and hospitals to improve healthcare access for underserved communities.",
        category: "healthcare",
        target: 100000,
        raised: 65000,
        icon: "fas fa-medkit",
        image: "medical"
    },
    {
        id: 5,
        title: "Environmental Conservation",
        description: "Plant trees, clean up oceans, and implement sustainable practices to protect our environment for future generations.",
        category: "environment",
        target: 40000,
        raised: 25000,
        icon: "fas fa-leaf",
        image: "environment"
    },
    {
        id: 6,
        title: "Women's Empowerment",
        description: "Support women's education, skill development, and entrepreneurship programs to create economic opportunities.",
        category: "education",
        target: 60000,
        raised: 40000,
        icon: "fas fa-female",
        image: "women"
    },
    {
        id: 7,
        title: "Disaster Relief Fund",
        description: "Provide immediate assistance to communities affected by natural disasters with emergency supplies and shelter.",
        category: "healthcare",
        target: 80000,
        raised: 55000,
        icon: "fas fa-hands-helping",
        image: "disaster"
    },
    {
        id: 8,
        title: "Digital Literacy Program",
        description: "Teach computer skills and digital literacy to bridge the digital divide and create employment opportunities.",
        category: "education",
        target: 35000,
        raised: 22000,
        icon: "fas fa-laptop",
        image: "digital"
    }
];

// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const campaignsGrid = document.getElementById('campaignsGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const donationModal = document.getElementById('donationModal');
const closeModal = document.querySelector('.close');
const donationForm = document.getElementById('donationForm');
const amountButtons = document.querySelectorAll('.amount-btn');
const customAmountInput = document.getElementById('customAmount');

// Global variables
let currentCampaign = null;
let selectedAmount = 0;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    loadCampaigns();
    initializeFilters();
    initializeModal();
    initializeDonationForm();
    initializeSmoothScrolling();
    initializeAnimations();
});

// Navigation functionality
function initializeNavigation() {
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

// Load campaigns into the grid
function loadCampaigns(filter = 'all') {
    campaignsGrid.innerHTML = '';
    
    const filteredCampaigns = filter === 'all' 
        ? campaigns 
        : campaigns.filter(campaign => campaign.category === filter);

    filteredCampaigns.forEach(campaign => {
        const campaignCard = createCampaignCard(campaign);
        campaignsGrid.appendChild(campaignCard);
    });
}

// Create campaign card element
function createCampaignCard(campaign) {
    const card = document.createElement('div');
    card.className = 'campaign-card';
    card.setAttribute('data-category', campaign.category);
    
    const progressPercentage = (campaign.raised / campaign.target) * 100;
    
    card.innerHTML = `
        <div class="campaign-image">
            <i class="${campaign.icon}"></i>
        </div>
        <div class="campaign-content">
            <span class="campaign-category">${campaign.category.charAt(0).toUpperCase() + campaign.category.slice(1)}</span>
            <h3 class="campaign-title">${campaign.title}</h3>
            <p class="campaign-description">${campaign.description}</p>
            <div class="campaign-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                </div>
            </div>
            <div class="campaign-stats">
                <span>$${campaign.raised.toLocaleString()} raised</span>
                <span>$${campaign.target.toLocaleString()} goal</span>
            </div>
            <button class="donate-btn" onclick="openDonationModal(${campaign.id})">
                Donate Now
            </button>
        </div>
    `;
    
    return card;
}

// Initialize campaign filters
function initializeFilters() {
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Load campaigns with selected filter
            const filter = this.getAttribute('data-filter');
            loadCampaigns(filter);
        });
    });
}

// Modal functionality
function initializeModal() {
    // Close modal when clicking the X
    closeModal.addEventListener('click', closeDonationModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === donationModal) {
            closeDonationModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && donationModal.style.display === 'block') {
            closeDonationModal();
        }
    });
}

// Open donation modal
function openDonationModal(campaignId) {
    currentCampaign = campaigns.find(campaign => campaign.id === campaignId);
    
    if (currentCampaign) {
        document.getElementById('modalCampaignTitle').textContent = currentCampaign.title;
        document.getElementById('modalCampaignDescription').textContent = currentCampaign.description;
        donationModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Close donation modal
function closeDonationModal() {
    donationModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    resetDonationForm();
}

// Initialize donation form
function initializeDonationForm() {
    // Amount button selection
    amountButtons.forEach(button => {
        button.addEventListener('click', function() {
            amountButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            selectedAmount = parseInt(this.getAttribute('data-amount'));
            customAmountInput.value = '';
        });
    });
    
    // Custom amount input
    customAmountInput.addEventListener('input', function() {
        if (this.value) {
            amountButtons.forEach(btn => btn.classList.remove('active'));
            selectedAmount = parseFloat(this.value) || 0;
        }
    });
    
    // Form submission
    donationForm.addEventListener('submit', handleDonationSubmission);
}

// Handle donation form submission
function handleDonationSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(donationForm);
    const donorName = document.getElementById('donorName').value;
    const donorEmail = document.getElementById('donorEmail').value;
    const donorMessage = document.getElementById('donorMessage').value;
    
    // Validate form
    if (!donorName || !donorEmail) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    if (selectedAmount <= 0) {
        showMessage('Please select a donation amount.', 'error');
        return;
    }
    
    // Simulate donation processing
    const submitButton = donationForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.innerHTML = '<span class="loading"></span> Processing...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        // Simulate successful donation
        showMessage(`Thank you, ${donorName}! Your donation of $${selectedAmount} has been processed successfully.`, 'success');
        
        // Update campaign progress (simulate)
        if (currentCampaign) {
            currentCampaign.raised += selectedAmount;
            loadCampaigns(); // Reload to show updated progress
        }
        
        // Reset form and close modal
        setTimeout(() => {
            closeDonationModal();
            showMessage('Thank you for making a difference!', 'success');
        }, 2000);
        
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}

// Reset donation form
function resetDonationForm() {
    donationForm.reset();
    amountButtons.forEach(btn => btn.classList.remove('active'));
    customAmountInput.value = '';
    selectedAmount = 0;
    currentCampaign = null;
}

// Show message to user
function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;
    
    // Insert message at the top of the modal content
    const modalContent = document.querySelector('.modal-content');
    modalContent.insertBefore(messageDiv, modalContent.firstChild);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll to section function (for hero buttons)
function scrollToSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Initialize animations and effects
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.campaign-card, .feature, .impact-stat, .story');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Counter animation for stats
    animateCounters();
}

// Animate counter numbers
function animateCounters() {
    const counters = document.querySelectorAll('.impact-stat h3, .stat h3');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target.toLocaleString() + (counter.textContent.includes('K') ? 'K+' : '');
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current).toLocaleString() + (counter.textContent.includes('K') ? 'K+' : '');
                    }
                }, 16);
                
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

// Contact form handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                alert('Thank you for your message! We\'ll get back to you soon.');
                this.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1500);
        });
    }
});

// Newsletter subscription
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter');
    if (newsletterForm) {
        const button = newsletterForm.querySelector('button');
        const input = newsletterForm.querySelector('input');
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (input.value && input.value.includes('@')) {
                const originalText = button.textContent;
                button.textContent = 'Subscribing...';
                button.disabled = true;
                
                setTimeout(() => {
                    alert('Thank you for subscribing to our newsletter!');
                    input.value = '';
                    button.textContent = originalText;
                    button.disabled = false;
                }, 1000);
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Progress bar animation
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                progressBar.style.width = '0%';
                
                setTimeout(() => {
                    progressBar.style.transition = 'width 1.5s ease';
                    progressBar.style.width = width;
                }, 200);
                
                progressObserver.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => progressObserver.observe(bar));
}

// Initialize progress bar animations when campaigns are loaded
const originalLoadCampaigns = loadCampaigns;
loadCampaigns = function(filter = 'all') {
    originalLoadCampaigns(filter);
    setTimeout(animateProgressBars, 100);
};

// Add some interactive hover effects
document.addEventListener('DOMContentLoaded', function() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn, .donate-btn, .amount-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
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
        });
    });
});

// Add ripple effect CSS
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

