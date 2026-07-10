// ===================================================
// Mobile menu toggle
// ===================================================
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('is-open');
});

// Close mobile menu when a link is tapped
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
  });
});

// ===================================================
// Scroll-spy: highlight active nav link
// ===================================================
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

function onScrollSpy(){
  const scrollY = window.pageYOffset;
  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 120;
    const sectionId = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${sectionId}"]`);
    if (!link) return;
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
      navAnchors.forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    }
  });
}
window.addEventListener('scroll', onScrollSpy);
onScrollSpy();

// Sticky navbar shadow + scroll-progress bar
const navbar = document.getElementById('navbar');
const navProgress = document.getElementById('navProgress');

function onNavbarScroll(){
  const scrollY = window.pageYOffset;

  navbar.style.boxShadow = scrollY > 8
    ? '0 4px 16px rgba(17,24,39,0.06)'
    : 'none';

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? scrollY / scrollable : 0;
  navProgress.style.transform = `scaleX(${progress})`;
}
window.addEventListener('scroll', onNavbarScroll);
onNavbarScroll();

// ===================================================
// Booking Modal
// ===================================================
//
// Connected to your Google Form. Every submission from this modal
// is posted straight to Google's response endpoint in the background,
// so the visitor only ever sees this custom modal — never the real
// Google Form — while every booking still lands in your linked
// Google Sheet automatically.
const GOOGLE_FORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLSeq_oxck7BQ-w11w9OaGAiDc7WIkGYRJjVae8AMjIsgnmkr5A/formResponse';
const GOOGLE_FORM_FIELDS = {
  name:    'entry.147115035',
  phone:   'entry.1935412222',
  email:   'entry.474584703',
  address: 'entry.1793288027',
  service: 'entry.343233456',
  service_sentinel: 'entry.343233456_sentinel',
  addons:  'entry.1574616029',
  date_year:   'entry.1552333553_year',
  date_month:  'entry.1552333553_month',
  date_day:    'entry.1552333553_day',
  time_hour:   'entry.1013509127_hour',
  time_minute: 'entry.1013509127_minute',
};

const bookingOverlay = document.getElementById('bookingOverlay');
const bookingClose = document.getElementById('bookingClose');
const bookingForm = document.getElementById('bookingForm');
const bookingSubmit = document.getElementById('bookingSubmit');
const bookingFormView = document.getElementById('bookingFormView');
const bookingSuccessView = document.getElementById('bookingSuccessView');
const bookingDone = document.getElementById('bookingDone');
// ============================================
// Prevent selecting past dates
// ============================================

const dateInput = document.getElementById('bkDate');
const timeInput = document.getElementById('bkTime');
const bkPlanSelect = document.getElementById('bkPlanSelect');
const planError = document.getElementById('planError');
const dateTimeError = document.getElementById('dateTimeError');

// Clear errors as soon as the user fixes the field
bkPlanSelect.querySelectorAll('input[name="service"]').forEach(input => {
  input.addEventListener('change', () => {
    planError.classList.remove('is-visible');
    bkPlanSelect.classList.remove('has-error');
  });
});

[dateInput, timeInput].forEach(input => {
  input.addEventListener('input', () => {
    dateTimeError.classList.remove('is-visible');
    dateInput.classList.remove('has-error');
    timeInput.classList.remove('has-error');
  });
});

const today = new Date().toISOString().split('T')[0];
dateInput.min = today;

dateInput.addEventListener('change', () => {

    const today = new Date().toISOString().split('T')[0];

    if (dateInput.value === today) {

        const now = new Date();

        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        timeInput.min = `${hours}:${minutes}`;

    } else {

        timeInput.min = "";

    }

});

function openBookingModal(){
  bookingOverlay.classList.add('is-open');
  bookingOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeBookingModal(){
  bookingOverlay.classList.remove('is-open');
  bookingOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function resetBookingModal(){
  bookingForm.reset();
  bookingForm.hidden = false;
  bookingFormView.hidden = false;
  bookingSuccessView.hidden = true;
  planError.classList.remove('is-visible');
  dateTimeError.classList.remove('is-visible');
  bkPlanSelect.classList.remove('has-error');
  dateInput.classList.remove('has-error');
  timeInput.classList.remove('has-error');
}

// Every "Book Now" / "Book Service" link on the page opens the modal
// instead of jumping to a page anchor.
document.querySelectorAll('a[href="#booking"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    openBookingModal();
  });
});

bookingClose.addEventListener('click', closeBookingModal);
bookingDone.addEventListener('click', () => {
  closeBookingModal();
  resetBookingModal();
});

// Click outside the modal card closes it
bookingOverlay.addEventListener('click', (e) => {
  if (e.target === bookingOverlay) closeBookingModal();
});

// Escape key closes it
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && bookingOverlay.classList.contains('is-open')){
    closeBookingModal();
  }
});

// Submit the form data straight to the Google Form's response
// endpoint in the background, so the visitor never sees the real
// Google Form — only this custom-designed modal.
bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // ============================================
// Validate selected date and time
// ============================================

const selectedDate = dateInput.value;
const selectedTime = timeInput.value;

const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
const currentDateTime = new Date();

if (selectedDateTime < currentDateTime) {
  dateTimeError.classList.add('is-visible');
  dateInput.classList.add('has-error');
  timeInput.classList.add('has-error');
  return;
} else {
  dateTimeError.classList.remove('is-visible');
  dateInput.classList.remove('has-error');
  timeInput.classList.remove('has-error');
}

const selectedPlan = bookingForm.querySelector('input[name="service"]:checked');
if (!selectedPlan) {
  planError.classList.add('is-visible');
  bkPlanSelect.classList.add('has-error');
  return;
} else {
  planError.classList.remove('is-visible');
  bkPlanSelect.classList.remove('has-error');
}


  
  const [year, month, day] = document.getElementById('bkDate').value.split('-');
  const [hour, minute] = document.getElementById('bkTime').value.split(':');

  const values = {
  name: document.getElementById('bkName').value,
  phone: document.getElementById('bkPhone').value,
  email: document.getElementById('bkEmail').value,
  address: document.getElementById('bkAddress').value,
  service: selectedPlan ? selectedPlan.value : '',
  addons: document.getElementById('bkAddons').value,
  date_year: year || '',
  date_month: month || '',
  date_day: day || '',
  time_hour: hour || '',
  time_minute: minute || '',
};

  const formData = new FormData();
  Object.keys(GOOGLE_FORM_FIELDS).forEach(key => {
    formData.append(GOOGLE_FORM_FIELDS[key], values[key] || '');
  });

  bookingSubmit.disabled = true;
  bookingSubmit.textContent = 'Sending…';

  // mode: 'no-cors' is required for Google Forms' endpoint — the
  // response is opaque (unreadable) either way, so we just assume
  // success once the request has been sent.
  fetch(GOOGLE_FORM_ACTION, {
    method: 'POST',
    mode: 'no-cors',
    body: formData,
  })
    .catch(() => { /* opaque response — ignore network-level errors from no-cors */ })
    .finally(() => {
      bookingSubmit.disabled = false;
      bookingSubmit.textContent = 'Confirm Booking';
      bookingFormView.hidden = true;
      bookingSuccessView.hidden = false;
    });
});
// ===================================================
// Scroll reveal (Intersection Observer)
// ===================================================

// Hero elements animate on page load with a slight delay (not scroll-triggered,
// since they're visible immediately)
document.querySelectorAll('.navbar [data-reveal], .hero [data-reveal]').forEach((el, i) => {
  setTimeout(() => el.classList.add('is-visible'), 300 + i * 150);
});

const revealElements = document.querySelectorAll('[data-reveal]:not(.navbar [data-reveal]):not(.hero [data-reveal])');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));