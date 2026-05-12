document.addEventListener("DOMContentLoaded", function () {
  // Initialize AOS
  AOS.init({
    once: true,
    offset: 100,
    duration: 800,
  });

  // Initialize Input Mask
  var phoneInput = document.querySelector('input[name="phone"]');
  if (phoneInput) {
    var maskOptions = {
      mask: "+7 (000) 000 00 00",
    };
    IMask(phoneInput, maskOptions);
  }

  // Form Validation
  const form = document.querySelector("#contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let isValid = true;

      const reqInputs = form.querySelectorAll(".required");
      reqInputs.forEach((input) => {
        if (input.type === "checkbox") {
          if (!input.checked) {
            input.parentElement.classList.add("error");
            isValid = false;
          } else {
            input.parentElement.classList.remove("error");
          }
        } else {
          if (input.value.trim() === "") {
            input.classList.add("error");
            isValid = false;
          } else {
            if (
              input.name === "phone" &&
              input.value.replace(/\D/g, "").length < 11
            ) {
              input.classList.add("error");
              isValid = false;
            } else {
              input.classList.remove("error");
            }
          }
        }
      });

      if (isValid) {
        alert("Заявка успешно отправлена!");
        form.reset();
      }
    });

    form.querySelectorAll(".required").forEach((input) => {
      input.addEventListener("input", function () {
        if (this.type === "checkbox") {
          if (this.checked) this.parentElement.classList.remove("error");
        } else {
          this.classList.remove("error");
        }
      });
    });
  }

  // Mobile Menu Logic
  const burgerBtn = document.querySelector(".burger-menu");
  const closeBtn = document.querySelector("#closeMenu");
  const mobileMenu = document.querySelector("#mobileMenu");
  const mobileOverlay = document.querySelector("#mobileOverlay");

  if (burgerBtn && closeBtn && mobileMenu && mobileOverlay) {
    burgerBtn.addEventListener("click", () => {
      mobileMenu.classList.add("active");
      mobileOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
    });

    const closeMenu = () => {
      mobileMenu.classList.remove("active");
      mobileOverlay.classList.remove("active");
      document.body.style.overflow = "";
    };

    closeBtn.addEventListener("click", closeMenu);
    mobileOverlay.addEventListener("click", closeMenu);

    document.querySelectorAll(".mobile-nav a").forEach((link) => {
      link.addEventListener("click", function (e) {
        const isDropdown =
          this.parentElement.classList.contains("has-dropdown");
        const clickedArrow =
          e.target.classList.contains("dropdown-arrow") ||
          e.target.closest(".dropdown-arrow");

        if (isDropdown && clickedArrow) {
          e.preventDefault();
          this.parentElement.classList.toggle("open");
        } else if (!isDropdown) {
          closeMenu();
        }
      });
    });
  }

  // Animate Numbers
  const counters = document.querySelectorAll(".count");

  const animateCounters = () => {
    counters.forEach((counter) => {
      const updateCount = () => {
        const target = +counter.getAttribute("data-target");
        const count = +counter.innerText;

        let inc;
        if (target % 1 !== 0) {
          inc = target / 50;
          if (count < target) {
            let next = count + inc;
            if (next > target) next = target;
            counter.innerText = next.toFixed(1);
            setTimeout(updateCount, 30);
          } else {
            counter.innerText = target;
          }
        } else {
          inc = Math.ceil(target / 50);
          if (count < target) {
            let next = count + inc;
            if (next > target) next = target;
            counter.innerText = next;
            setTimeout(updateCount, 30);
          } else {
            counter.innerText = target;
          }
        }
      };
      updateCount();
    });
  };

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  };

  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const bubbleObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.2,
    },
  );

  document.querySelectorAll(".bubble").forEach((el) => {
    bubbleObserver.observe(el);
  });

  const datasBlock = document.querySelector(".datas-block");
  if (datasBlock) {
    countObserver.observe(datasBlock);
  }

  // Initialize Yandex Map
  initMap();
  async function initMap() {
    await ymaps3.ready;
    const {
      YMap,
      YMapDefaultSchemeLayer,
      YMapDefaultFeaturesLayer,
      YMapMarker,
      YMapControls,
    } = ymaps3;

    // Import zoom control
    let YMapZoomControl;
    try {
      const controls = await ymaps3.import("@yandex/ymaps3-controls@0.0.1");
      YMapZoomControl = controls.YMapZoomControl;
    } catch (e) {
      console.error("Yandex map import controls error", e);
    }

    const map = new YMap(document.getElementById("map"), {
      location: {
        center: [37.6266, 55.57767],
        zoom: 17,
      },
      behaviors: ["drag", "pinchZoom", "mouseTilt"],
    });

    map.addChild(new YMapDefaultSchemeLayer());
    map.addChild(new YMapDefaultFeaturesLayer());

    if (YMapZoomControl) {
      map.addChild(
        new YMapControls({ position: "right" }).addChild(
          new YMapZoomControl({}),
        ),
      );
    }

    // Marker container
    const markerContainer = document.createElement("div");
    markerContainer.style.display = "flex";
    markerContainer.style.flexDirection = "column";
    markerContainer.style.alignItems = "center";
    markerContainer.style.transform = "translate(-50%, -100%)";

    // Map address label
    const labelElement = document.createElement("div");
    labelElement.style.backgroundColor = "#fff";
    labelElement.style.padding = "8px 12px";
    labelElement.style.borderRadius = "12px";
    labelElement.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    labelElement.style.fontWeight = "600";
    labelElement.style.fontFamily = "Montserrat, sans-serif";
    labelElement.style.fontSize = "14px";
    labelElement.style.marginBottom = "5px";
    labelElement.style.whiteSpace = "nowrap";
    labelElement.innerText = "Москва, Востряковский проезд 10Б стр7";

    // Map icon (SVG)
    const svgHtml = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#F13484"/></svg>`;
    const iconElement = document.createElement("div");
    iconElement.innerHTML = svgHtml;

    markerContainer.appendChild(labelElement);
    markerContainer.appendChild(iconElement);

    map.addChild(
      new YMapMarker({ coordinates: [37.624793, 55.577632] }, markerContainer),
    );
  }
});
