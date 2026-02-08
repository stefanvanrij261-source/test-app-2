document.addEventListener("DOMContentLoaded", () => {

  const toggleButton = document.getElementById("menuToggle");
  const sideMenu = document.getElementById("sideMenu");

  toggleButton.addEventListener("click", () => {
    sideMenu.classList.toggle("open");
    toggleButton.classList.toggle("open");
  });

  // Slideshow
  let slideIndex = 0;
  const slides = document.querySelectorAll(".slide");

  function showSlides() {
    slides.forEach(s => s.style.display = "none");
    slideIndex++;
    if (slideIndex > slides.length) slideIndex = 1;
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 3000);
  }

  if (slides.length > 0) showSlides();

});
