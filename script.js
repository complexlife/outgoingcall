// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active class to nav items on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Package selection handling
document.querySelectorAll('.pricing-card .btn').forEach(button => {
    button.addEventListener('click', function(e) {
        if (!this.classList.contains('consultation-btn')) {
            e.preventDefault();
            const packageName = this.closest('.pricing-card').querySelector('h3').textContent;
            console.log(`Selected package: ${packageName}`);
        }
    });
});

// Consultation form handling
function showConsultationForm() {
    const formHtml = `
        <div class="consultation-form">
            <h3>فرم درخواست مشاوره</h3>
            <form id="consultationForm">
                <div class="form-group">
                    <label for="name">نام و نام خانوادگی</label>
                    <input type="text" id="name" required>
                </div>
                <div class="form-group">
                    <label for="phone">شماره تماس</label>
                    <input type="tel" id="phone" required>
                </div>
                <div class="form-group">
                    <label for="email">ایمیل</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label for="company">نام شرکت</label>
                    <input type="text" id="company" required>
                </div>
                <div class="form-group">
                    <label for="calls">تعداد تماس مورد نیاز</label>
                    <input type="number" id="calls" required>
                </div>
                <div class="form-group">
                    <label for="description">توضیحات</label>
                    <textarea id="description" rows="4"></textarea>
                </div>
                <button type="submit" class="btn btn-primary">ارسال درخواست</button>
            </form>
        </div>
    `;

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = formHtml;
    document.body.appendChild(modal);

    // Handle form submission
    const form = modal.querySelector('#consultationForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            company: document.getElementById('company').value,
            calls: document.getElementById('calls').value,
            description: document.getElementById('description').value
        };

        console.log('Consultation Request:', formData);
        alert('درخواست شما با موفقیت ثبت شد. کارشناسان ما در اسرع وقت با شما تماس خواهند گرفت.');
        
        // Remove modal
        document.body.removeChild(modal);
    });

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Base prices for each package
const basePrices = {
    base: 2500000,
    pro: 5000000,
    enterprise: 10000000,
    custom: 0
};

// Price multipliers for different durations
const durationMultipliers = {
    '3': 1,
    '4': 1.2,
    '5': 1.4
};

// Function to format price in Persian numbers
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "،");
}

// Function to update price based on duration
function updatePrice(select, packageType) {
    const duration = select.value;
    const basePrice = basePrices[packageType];
    const multiplier = durationMultipliers[duration];
    const newPrice = Math.round(basePrice * multiplier);
    
    const priceElement = select.closest('.package-card').querySelector('.amount');
    if (packageType === 'custom') {
        priceElement.textContent = 'مشاوره';
    } else {
        priceElement.textContent = formatPrice(newPrice);
    }
}

// Initialize prices on page load
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.duration-selector select').forEach(select => {
        const packageType = select.getAttribute('onchange').match(/'([^']+)'/)[1];
        updatePrice(select, packageType);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    // Pricing data for different types
    const pricingData = {
        'call-based': {
            packages: {
                starter: { price: 750000 },
                growth: { price: 6900000 },
                professional: { price: 63000000 },
                enterprise: { price: 0 }
            }
        },
        'minute-based': {
            packages: {
                starter: { price: 750000 },
                growth: { price: 6900000 },
                professional: { price: 63000000 },
                enterprise: { price: 0 }
            }
        }
    };

    function updatePricing(type) {
        const data = pricingData[type];
        const cards = document.querySelectorAll('.pricing-card');
        
        cards.forEach((card, index) => {
            const packageType = ['starter', 'growth', 'professional', 'enterprise'][index];
            const packageData = data.packages[packageType];
            const priceElement = card.querySelector('.price .amount');
            
            if (packageType === 'enterprise') {
                priceElement.textContent = 'مشاوره';
            } else {
                priceElement.textContent = packageData.price.toLocaleString();
            }
        });
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update pricing based on selected type
            const type = this.dataset.type;
            updatePricing(type);
        });
    });

    // Initialize with call-based pricing
    updatePricing('call-based');
}); 
