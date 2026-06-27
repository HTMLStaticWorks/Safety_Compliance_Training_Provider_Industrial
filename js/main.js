document.addEventListener('DOMContentLoaded', () => {
  // Initial Theme & RTL configuration
  initTheme();
  initRTL();

  // Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
    });
  }

  // Theme Toggles
  const themeToggleBtns = document.querySelectorAll('.theme-toggle');
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  // RTL Toggles
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle');
  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', toggleRTL);
  });

  // Animated Counters
  initCounters();

  // Form Submissions (Demo notices)
  initForms();

  // Cheese Collection Filters & Search
  initCollectionFilters();

  // Password Strength Indicator (For Signup page)
  initPasswordStrength();

  // Password Visibility Toggle
  initPasswordToggle();
});

/* Theme Functions */
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function toggleTheme() {
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
}

/* RTL Functions */
function initRTL() {
  const savedRTL = localStorage.getItem('rtl');
  if (savedRTL === 'true') {
    document.documentElement.setAttribute('dir', 'rtl');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
  }
}

function toggleRTL() {
  const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
  if (isRTL) {
    document.documentElement.setAttribute('dir', 'ltr');
    localStorage.setItem('rtl', 'false');
  } else {
    document.documentElement.setAttribute('dir', 'rtl');
    localStorage.setItem('rtl', 'true');
  }
}

/* Counters logic */
function initCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  if (counters.length === 0) return;

  const observerOptions = {
    threshold: 0.5
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        const duration = 1500; // ms
        const stepTime = Math.max(Math.floor(duration / target), 15);
        let start = 0;
        
        const timer = setInterval(() => {
          start += Math.ceil(target / (duration / stepTime));
          if (start >= target) {
            counter.innerText = target;
            clearInterval(timer);
          } else {
            counter.innerText = start;
          }
        }, stepTime);

        observer.unobserve(counter);
      }
    });
  }, observerOptions);

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
}

/* Form handling */
function initForms() {
  const forms = document.querySelectorAll('.inquiry-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simple validation visual feedback
      let isValid = true;
      const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
      inputs.forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('border-red-500');
          isValid = false;
        } else {
          input.classList.remove('border-red-500');
        }
      });

      if (!isValid) return;

      // Password confirmation check
      const password = form.querySelector('#signup-password');
      const confirmPassword = form.querySelector('#confirm-password');
      if (password && confirmPassword) {
        if (password.value !== confirmPassword.value) {
          password.classList.add('border-red-500');
          confirmPassword.classList.add('border-red-500');
          showToast('Passwords do not match. Please try again.');
          return;
        } else {
          password.classList.remove('border-red-500');
          confirmPassword.classList.remove('border-red-500');
        }
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg> Processing...
        `;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
        
        // Show floating toast/alert
        showToast('Thank you! Your submission was successfully received. Our team will contact you shortly.');
        form.reset();
      }, 1500);
    });
  });
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-5 left-5 right-5 md:left-auto md:right-5 bg-forest text-creamWhite py-3 px-6 rounded-lg shadow-2xl z-50 text-sm md:text-base border border-sage/30 flex items-center justify-between transition-all duration-300 transform translate-y-10 opacity-0';
  toast.innerHTML = `
    <span>${message}</span>
    <button class="ml-4 text-creamWhite hover:text-honey font-bold">&times;</button>
  `;
  document.body.appendChild(toast);
  
  // Close toast trigger
  toast.querySelector('button').addEventListener('click', () => {
    toast.remove();
  });

  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-y-10', 'opacity-0');
  }, 100);

  // Auto remove
  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

/* Course Catalog Filters & Search */
function initCollectionFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const collectionItems = document.querySelectorAll('.collection-item');
  const searchInput = document.getElementById('course-search');

  if (filterBtns.length === 0 && !searchInput) return;

  let activeCategory = 'all';
  let searchQuery = '';

  function filterCourseList() {
    collectionItems.forEach(item => {
      const category = item.getAttribute('data-category');
      const title = item.querySelector('.course-name').innerText.toLowerCase();
      const desc = item.querySelector('.course-desc').innerText.toLowerCase();
      
      const matchesCategory = activeCategory === 'all' || category === activeCategory;
      const matchesSearch = title.includes(searchQuery) || desc.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        item.style.display = 'block';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 50);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('bg-forest', 'text-creamWhite', 'active'));
      filterBtns.forEach(b => b.classList.add('bg-softBeige', 'text-forest'));
      
      btn.classList.remove('bg-softBeige', 'text-forest');
      btn.classList.add('bg-forest', 'text-creamWhite', 'active');
      
      activeCategory = btn.getAttribute('data-filter');
      filterCourseList();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase();
      filterCourseList();
    });
  }
}

/* Password Strength Indicator */
function initPasswordStrength() {
  const passwordInput = document.getElementById('signup-password');
  const strengthIndicator = document.getElementById('password-strength');
  const strengthText = document.getElementById('password-strength-text');

  if (!passwordInput || !strengthIndicator) return;

  passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    let score = 0;

    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[a-z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    // Update meter bar colors & labels
    strengthIndicator.className = 'h-2 rounded transition-all duration-300 ';
    if (val.length === 0) {
      strengthIndicator.classList.add('bg-gray-200', 'w-0');
      strengthText.innerText = '';
    } else if (score <= 2) {
      strengthIndicator.classList.add('bg-red-500', 'w-1/3');
      strengthText.innerText = 'Weak';
      strengthText.className = 'text-xs text-red-500 mt-1 block';
    } else if (score <= 4) {
      strengthIndicator.classList.add('bg-yellow-500', 'w-2/3');
      strengthText.innerText = 'Medium';
      strengthText.className = 'text-xs text-yellow-500 mt-1 block';
    } else {
      strengthIndicator.classList.add('bg-green-500', 'w-full');
      strengthText.innerText = 'Strong';
      strengthText.className = 'text-xs text-green-500 mt-1 block';
    }
  });
}

/* Password Visibility Toggle */
function initPasswordToggle() {
  const toggleBtns = document.querySelectorAll('.toggle-password');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const passwordInput = document.getElementById(targetId);
      if (!passwordInput) return;

      const icon = btn.querySelector('i');
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        if (icon) {
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        }
      } else {
        passwordInput.type = 'password';
        if (icon) {
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      }
    });
  });
}
