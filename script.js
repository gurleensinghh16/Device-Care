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

// Sticky navbar shadow on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.pageYOffset > 8
    ? '0 4px 16px rgba(17,24,39,0.06)'
    : 'none';
});