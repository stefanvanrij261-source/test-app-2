document.addEventListener("DOMContentLoaded", () => {

  const toggleButton = document.getElementById("menuToggle");
  const sideMenu = document.getElementById("sideMenu");

 if (toggleButton && sideMenu) {
    toggleButton.addEventListener("click", () => {
      sideMenu.classList.toggle("open");
      toggleButton.classList.toggle("open");
    });
  }

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
  const videoTrigger = document.getElementById("videoCubeTrigger");
  const videoModal = document.getElementById("videoModal");
  const videoFrame = document.getElementById("videoModalFrame");
  const videoClose = document.getElementById("videoModalClose");
  const videoEmbedUrl = "https://www.youtube.com/embed/Y0fItGyUNPs?autoplay=1&rel=0";

  function openVideoModal() {
    if (!videoModal || !videoFrame) return;
    videoFrame.src = videoEmbedUrl;
    videoModal.classList.add("open");
    videoModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeVideoModal() {
    if (!videoModal || !videoFrame) return;
    videoModal.classList.remove("open");
    videoModal.setAttribute("aria-hidden", "true");
    videoFrame.src = "";
    document.body.style.overflow = "";
  }

  if (videoTrigger && videoModal && videoFrame && videoClose) {
    videoTrigger.addEventListener("click", openVideoModal);
    videoClose.addEventListener("click", closeVideoModal);

    videoModal.addEventListener("click", (event) => {
      if (event.target === videoModal) {
        closeVideoModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && videoModal.classList.contains("open")) {
        closeVideoModal();
      }
    });
  }
  /* =========================
     DEVICE DETECTION (ADDED)
     ========================= */

  function getDeviceType() {
    const width = window.innerWidth;

    if (width < 768) return "phone";
    if (width < 1024) return "tablet";
    return "laptop";
  }

  const deviceType = getDeviceType();
  document.body.setAttribute("data-device", deviceType);

  // Optional: verify in console
  console.log("Device type:", deviceType);

});
