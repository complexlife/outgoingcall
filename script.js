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

// Calculator functionality
document.addEventListener('DOMContentLoaded', function() {
    const totalCallsInput = document.getElementById('total-calls');
    const callDurationInput = document.getElementById('call-duration');
    const dailyLimitInput = document.getElementById('daily-limit');
    const callRepetitionInput = document.getElementById('call-repetition');
    const specificPersonCheckbox = document.getElementById('specific-person');
    const operatorTrainingCheckbox = document.getElementById('operator-training');
    const maxCallAttemptsInput = document.getElementById('max-call-attempts');
    const callTypeRadios = document.querySelectorAll('input[name="call-type"]');
    const pricingCallTypeRadios = document.querySelectorAll('input[name="pricing-call-type"]');
    const paymentBtn = document.getElementById('payment-btn');
    const totalMinutesElement = document.getElementById('total-minutes');
    const totalPriceElement = document.getElementById('total-price');
    const repetitionPriceElement = document.getElementById('repetition-price');
    const callAttemptsPriceElement = document.getElementById('call-attempts-price');

    // Constants for price calculations
    const DURATION_THRESHOLD = 3;
    const DEFAULT_DAILY_LIMIT = 50;
    const DAILY_LIMIT_PRICE_MULTIPLIER = 0.1;
    const REPETITION_PRICE_MULTIPLIER = 0.05; // 5% increase per repetition
    const SPECIFIC_PERSON_PRICE = 500000;
    const OPERATOR_TRAINING_PRICE = 1000000;
    const CALL_ATTEMPTS_PRICE_MULTIPLIER = 0.02; // 2% increase per attempt

    // Pricing configuration
    const PRICING = {
        'happy-call': {
            pricePerCallUnder3Min: 8900,
            pricePerMinuteOver3Min: 4300
        },
        'sales': {
            pricePerCallUnder3Min: 12000,
            pricePerMinuteOver3Min: 5500
        },
        'info': {
            pricePerCallUnder3Min: 9500,
            pricePerMinuteOver3Min: 4800
        },
        'other': {
            pricePerCallUnder3Min: 10000,
            pricePerMinuteOver3Min: 5000
        }
    };

    // Slider configurations
    const sliderConfigs = {
        'total-calls': {
            min: 10,
            max: 1000,
            step: 10,
            defaultValue: 100,
            format: value => `${value.toLocaleString()} تماس`
        },
        'call-duration': {
            min: 1,
            max: 10,
            step: 0.5,
            defaultValue: 3,
            format: value => `${value} دقیقه`
        },
        'daily-limit': {
            min: 10,
            max: 200,
            step: 5,
            defaultValue: 50,
            format: value => `${value} تماس`
        },
        'call-repetition': {
            min: 1,
            max: 12,
            step: 1,
            defaultValue: 1,
            format: value => `${value} بار`
        },
        'max-call-attempts': {
            min: 2,
            max: 10,
            step: 1,
            defaultValue: 2,
            format: value => `${value} بار`
        }
    };

    // Initialize sliders with configurations
    Object.entries(sliderConfigs).forEach(([id, config]) => {
        const slider = document.getElementById(id);
        if (slider) {
            slider.min = config.min;
            slider.max = config.max;
            slider.step = config.step;
            slider.value = config.defaultValue;
            updateSliderValue(slider);
        }
    });

    function updateSliderValue(slider) {
        const labelValue = slider.closest('.form-group').querySelector('.label-value');
        const config = sliderConfigs[slider.id];
        if (config) {
            labelValue.textContent = config.format(parseFloat(slider.value));
        }
    }

    function calculateDailyLimitPrice() {
        const dailyLimit = parseInt(dailyLimitInput.value) || DEFAULT_DAILY_LIMIT;
        const totalCalls = parseInt(totalCallsInput.value) || 0;
        const callType = getSelectedCallType(callTypeRadios);
        const pricing = PRICING[callType];
        
        let extraPrice = 0;
        if (dailyLimit < DEFAULT_DAILY_LIMIT) {
            const callsPerDay = Math.ceil(totalCalls / 30); // Assuming 30 days
            if (callsPerDay > dailyLimit) {
                const extraCalls = callsPerDay - dailyLimit;
                extraPrice = Math.round(pricing.pricePerCallUnder3Min * DAILY_LIMIT_PRICE_MULTIPLIER * extraCalls);
            }
        }
        
        const dailyLimitPriceElement = document.getElementById('daily-limit-price');
        if (dailyLimitPriceElement) {
            dailyLimitPriceElement.textContent = extraPrice.toLocaleString();
        }
        return extraPrice;
    }

    function calculateRepetitionPrice() {
        const repetitions = parseInt(callRepetitionInput.value) || 1;
        const extraRepetitions = repetitions - 1;
        const priceIncrease = extraRepetitions * REPETITION_PRICE_MULTIPLIER * 100;
        repetitionPriceElement.textContent = priceIncrease.toFixed(0);
        return priceIncrease / 100;
    }

    function calculateCallAttemptsPrice() {
        const attempts = parseInt(maxCallAttemptsInput.value) || 2;
        const extraAttempts = attempts - 2;
        const priceIncrease = extraAttempts * CALL_ATTEMPTS_PRICE_MULTIPLIER * 100;
        callAttemptsPriceElement.textContent = priceIncrease.toFixed(0);
        return priceIncrease / 100;
    }

    function calculateTotalPrice() {
        const totalCalls = parseInt(totalCallsInput.value) || 0;
        const callDuration = parseFloat(callDurationInput.value) || 0;
        const callType = getSelectedCallType(callTypeRadios);
        const pricing = PRICING[callType];

        // Calculate total minutes
        const totalMinutes = totalCalls * callDuration;
        totalMinutesElement.textContent = totalMinutes.toLocaleString();

        // Calculate base price
        let totalPrice = 0;
        if (callDuration <= DURATION_THRESHOLD) {
            totalPrice = totalCalls * pricing.pricePerCallUnder3Min;
        } else {
            totalPrice = totalMinutes * pricing.pricePerMinuteOver3Min;
        }

        // Add daily limit extra price
        totalPrice += calculateDailyLimitPrice();

        // Add repetition price
        const repetitionMultiplier = 1 + calculateRepetitionPrice();
        totalPrice *= repetitionMultiplier;

        // Add specific person price if selected
        if (specificPersonCheckbox.checked) {
            totalPrice += SPECIFIC_PERSON_PRICE;
        }

        // Add operator training price if selected
        if (operatorTrainingCheckbox.checked) {
            totalPrice += OPERATOR_TRAINING_PRICE;
        }

        // Add call attempts price
        const attemptsMultiplier = 1 + calculateCallAttemptsPrice();
        totalPrice *= attemptsMultiplier;

        // Update price display
        totalPriceElement.textContent = Math.round(totalPrice).toLocaleString();
        
        return totalPrice;
    }

    function getSelectedCallType(radios) {
        return Array.from(radios).find(radio => radio.checked)?.value;
    }

    // Add event listeners for sliders
    [totalCallsInput, callDurationInput, dailyLimitInput, callRepetitionInput, maxCallAttemptsInput].forEach(slider => {
        slider.addEventListener('input', function() {
            updateSliderValue(this);
            calculateTotalPrice();
        });
    });

    // Add event listeners for call type changes
    callTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const customForm = document.getElementById('custom-form');
            const paymentSection = document.getElementById('payment-section');
            const consultationSection = document.getElementById('consultation-section');
            
            if (this.value === 'other') {
                customForm.style.display = 'block';
                paymentSection.style.display = 'none';
                consultationSection.style.display = 'block';
            } else {
                customForm.style.display = 'none';
                paymentSection.style.display = 'block';
                consultationSection.style.display = 'none';
            }
            calculateTotalPrice();
        });
    });

    // Add event listeners for pricing call type changes
    pricingCallTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            calculateTotalPrice();
        });
    });

    // Add event listeners for new inputs
    [specificPersonCheckbox, operatorTrainingCheckbox].forEach(checkbox => {
        checkbox.addEventListener('change', calculateTotalPrice);
    });

    // Add event listener for payment button
    paymentBtn.addEventListener('click', handlePayment);

    // Initial calculations and value updates
    [totalCallsInput, callDurationInput, dailyLimitInput, callRepetitionInput, maxCallAttemptsInput].forEach(slider => {
        updateSliderValue(slider);
    });
    calculateTotalPrice();
}); 
