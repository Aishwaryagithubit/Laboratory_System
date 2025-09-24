let slideIndex = 0;
let slideTimer;

function showSlides() {
  let slides = document.getElementsByClassName("slides");
  let dots = document.getElementsByClassName("dot");

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }

  slideIndex++;
  if (slideIndex > slides.length) { slideIndex = 1 }    

  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active-dot", "");
  }

  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active-dot";

  slideTimer = setTimeout(showSlides, 5000); // 5s autoplay
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

// Start slider
showSlides();

// ===== Scroll Up Button =====
let scrollUpBtn = document.getElementById("scrollUpBtn");

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    scrollUpBtn.style.display = "block";
  } else {
    scrollUpBtn.style.display = "none";
  }
}

scrollUpBtn.addEventListener("click", function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});




