// -------------------- SLIDER LOGIC --------------------
let slideIndex = 0;
let slideTimer;

function showSlides() {
  const slides = document.getElementsByClassName("slides");
  const dots = document.getElementsByClassName("dot");
  if (slides.length === 0) return;

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  slideIndex++;
  if (slideIndex > slides.length) { slideIndex = 1; }

  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active-dot", "");
  }

  slides[slideIndex - 1].style.display = "block";
  if (dots[slideIndex - 1]) dots[slideIndex - 1].className += " active-dot";

  slideTimer = setTimeout(showSlides, 5000);
}

function plusSlides(n) {
  clearTimeout(slideTimer);
  slideIndex += n - 1;
  showSlides();
}

function currentSlide(n) {
  clearTimeout(slideTimer);
  slideIndex = n - 1;
  showSlides();
}

// -------------------- DOM READY --------------------
document.addEventListener("DOMContentLoaded", function () {
  showSlides();

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      mainNav.classList.toggle('open');
      
      // Update toggle icon based on state
      this.innerHTML = expanded ? '&#9776;' : '&#10005;';
    });

    // Close nav when clicking a link (mobile)
    const navLinks = document.querySelectorAll('.navmenu a');
    navLinks.forEach(link => link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.innerHTML = '&#9776;'; // Reset to hamburger icon
    }));
    
    // Close nav when clicking outside (mobile)
    document.addEventListener('click', function(event) {
      if (!mainNav.contains(event.target) && !navToggle.contains(event.target)) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '&#9776;'; // Reset to hamburger icon
      }
    });
  }

  // Scroll Up button
  const scrollUpBtn = document.getElementById("scrollUpBtn") || document.querySelector('.scroll-up');
  function scrollFunction() {
    if (!scrollUpBtn) return;
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
      scrollUpBtn.style.display = "block";
    } else {
      scrollUpBtn.style.display = "none";
    }
  }
  window.addEventListener('scroll', scrollFunction);
  if (scrollUpBtn) {
    scrollUpBtn.addEventListener('click', function () {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    });
  }

  // Keyboard accessibility for slider
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') plusSlides(-1);
    if (e.key === 'ArrowRight') plusSlides(1);
  });

  // Chatbot is handled by chatbot.js
});

/* ==================================
   IMAGE LIGHTBOX
================================== */

document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    const closeBtn = document.querySelector(".close-modal");

    document.querySelectorAll("img").forEach(img => {

        img.addEventListener("click", () => {

            if (
                img.closest(".logo") ||
                img.classList.contains("modal-content")
            ) {
                return;
            }

            modal.style.display = "flex";
            modalImg.src = img.src;
            modalImg.alt = img.alt;
        });

    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    modal.addEventListener("click", () => {
        modal.style.display = "none";
    });

});