// scripts/projects.js
document.addEventListener("DOMContentLoaded", () => {
  // Add preview image
  document.querySelectorAll(".project-slide").forEach(slide => {
    if (!slide.querySelector(".preview-image")) {
      const firstImg = slide.querySelector(".content-project-canvas img");
      if (firstImg) {
        const clone = firstImg.cloneNode(true);
        clone.classList.add("preview-image");
        const info = slide.querySelector(".project-info");
        slide.insertBefore(clone, info.nextSibling || null);
      }
    }
  });

  // --- SLIDER INITIALIZATION ---
  function initContentSlider(canvas) {
    if (!canvas || canvas.dataset.initialized === "1") return;
    canvas.dataset.initialized = "1";

    const slider = canvas.querySelector(".content-slider");
    const images = slider?.querySelectorAll("img") || [];
    const dotsContainer = canvas.querySelector(".dots");
    if (!slider || !images.length || !dotsContainer) return;

    let current = 0;

    dotsContainer.innerHTML = "";

    images.forEach((img, idx) => {
      img.style.opacity = idx === 0 ? "1" : "0.5";

      const dot = document.createElement("span");
      dot.className = "dot" + (idx === 0 ? " active" : "");
      dot.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent triggering slide collapse
        show(idx);
      });
      dotsContainer.appendChild(dot);

      img.addEventListener("click", (e) => {
        e.stopPropagation(); // same here
        show((current + 1) % images.length);
      });
    });

    function scrollToIndex(index, behavior = "smooth") {
      slider.scrollTo({ left: images[index].offsetLeft, behavior });
    }

    function show(index) {
      if (index === current) return;
      images[current].style.opacity = "0.5";
      images[index].style.opacity = "1";

      dotsContainer.children[current].classList.remove("active");
      dotsContainer.children[index].classList.add("active");

      current = index;
      scrollToIndex(current);
    }

    // Optional: swipe + resize + keyboard
    const ro = new ResizeObserver(() => scrollToIndex(current, "auto"));
    ro.observe(slider);
    canvas.tabIndex = 0;
  }

  // --- SLIDE POSING ---
  function setPose(el, { tx = "0%", ty = "0px", scale = 1, opacity = 1, z = 1, pe = "auto" }) {
    el.style.setProperty("--tx", tx);
    el.style.setProperty("--ty", ty);
    el.style.setProperty("--scale", scale);
    el.style.opacity = opacity;
    el.style.zIndex = z;
    el.style.pointerEvents = pe;
  }




  // --- CAROUSEL LOGIC ---
  document.querySelectorAll(".carousel-container").forEach(container => {
    const track  = container.querySelector(".carousel-track");
    const slides = Array.from(track.querySelectorAll(".project-slide"));
    const EXPANDED_Z = 998;
    let currentIndex = 5; //can chose where to start

    function collapseAll() {
      slides.forEach(s => s.classList.remove("expanded"));
      container.classList.remove("expanded-mode");
    }

    function updateCarousel() {
      const total = slides.length;

      slides.forEach((slide, i) => {
        const rel = (i - currentIndex + total) % total;
        // Expanded + focused: give full control
        if (slide.classList.contains("expanded") && rel === 1) {
          slide.classList.remove("left", "focused", "right", "behind");
          setPose(slide, { tx: "0%", ty: "0%", scale: 1, opacity: 1, z: EXPANDED_Z, pe: "auto" });

          const canvas = slide.querySelector(".content-project-canvas");
          if (canvas) initContentSlider(canvas);
          return;
        }

        // Reset classes
        slide.classList.remove("left", "focused", "right", "behind");

        // Front 3
        if (rel === 0) {
          slide.classList.add("left");
          setPose(slide, { tx: "-140%", ty: "0px", scale: 0.95, opacity: 1, z: total });
          return;
        }
        if (rel === 1) {
          slide.classList.add("focused");
          setPose(slide, { tx: "0%", ty: "20%", scale: 1.25, opacity: 1, z: total + 1 });
          return;
        }
        if (rel === 2) {
          slide.classList.add("right");
          setPose(slide, { tx: "140%", ty: "0px", scale: 0.95, opacity: 1, z: total });
          return;
        }

        // === BEHIND (spread out with depth) ===
        slide.classList.add("behind");

        const behindIndex = rel - 3;
        const totalBehind = slides.length - 3;
        const t = totalBehind > 1 ? behindIndex / (totalBehind - 1) : 0.5;

        const xMin = 180, xMax = -180;
        const yMin = -90, yMax = -180;
        const scaleMin = 0.8, scaleMax = 0.6;

        const midIndex = Math.floor(totalBehind / 2);
        const behindZ = Math.abs(behindIndex - midIndex);
        const zMax = totalBehind + 1;

        const x = xMin + (xMax - xMin) * t;
        const y = yMax - Math.abs(t - 0.5) * 2 * (yMax - yMin);
        const scale = scaleMax - Math.abs(t - 0.5) * 2 * (scaleMax - scaleMin);
        const z = zMax - (midIndex - behindZ);

        setPose(slide, {
          tx: `${x}%`,
          ty: `${y}px`,
          scale,
          opacity: 1,
          z,
          pe: "auto"
        });
      });
    }

    // Collapse on any click outside the expanded slide
    container.addEventListener("click", (e) => {
      const expanded = container.querySelector(".project-slide.expanded");
      if (expanded && !expanded.contains(e.target)) {
        collapseAll();
        updateCarousel();
      }
    });


    container.querySelector(".carousel-arrow.left")?.addEventListener("click", () => {
      const expanded = container.querySelector(".project-slide.expanded");
      if(expanded) return;
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });

    container.querySelector(".carousel-arrow.right")?.addEventListener("click", () => {
      const expanded = container.querySelector(".project-slide.expanded");
      if(expanded) return;
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });


    slides.forEach((slide, i) => {
      slide.addEventListener("click", () => {
        const rel = (i - currentIndex + slides.length) % slides.length;

        if (rel === 1) {
          // Already focused → expand
          slide.classList.add("expanded");
          container.classList.add("expanded-mode");
          updateCarousel();
        } else {
          // Already expanded → ignore
          const expanded = container.querySelector(".project-slide.expanded");
          if (expanded) return;

          const targetIndex = (i - 1 + slides.length) % slides.length; // rel === 1

          const forwardSteps = (targetIndex - currentIndex + slides.length) % slides.length;
          const backwardSteps = (currentIndex - targetIndex + slides.length) % slides.length;

          const direction = forwardSteps <= backwardSteps ? 1 : -1;
          let steps = Math.min(forwardSteps, backwardSteps);

          const step = () => {
            currentIndex = (currentIndex + direction + slides.length) % slides.length;
            updateCarousel();
            steps--;
            if (steps > 0) {
              setTimeout(step, 300);
            }
          };

          step();
        }
      });
    });



    updateCarousel();
  });
});
