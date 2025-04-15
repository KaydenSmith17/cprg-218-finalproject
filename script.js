// Wait for the DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Create a modal overlay container
    const modal = document.createElement("div");
    modal.id = "modal-overlay";
    Object.assign(modal.style, {
      display: "none",
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.6)",
      zIndex: "1000",
      justifyContent: "center",
      alignItems: "center",
      transition: "opacity 0.3s ease"
    });
  
    // Create modal content container
    const modalContent = document.createElement("div");
    modalContent.id = "modal-content";
    Object.assign(modalContent.style, {
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "5px",
      maxWidth: "600px",
      width: "80%",
      position: "relative",
      transform: "scale(0.8)",
      opacity: "0",
      transition: "transform 0.3s ease, opacity 0.3s ease"
    });
    modal.appendChild(modalContent);
  
    // Create a close button for the modal
    const closeButton = document.createElement("span");
    closeButton.innerHTML = "&times;";
    Object.assign(closeButton.style, {
      position: "absolute",
      top: "10px",
      right: "20px",
      fontSize: "30px",
      cursor: "pointer",
      color: "#003366"
    });
    modalContent.appendChild(closeButton);
  
    // Function to close the modal and clear its content
    const closeModal = () => {
      modalContent.style.transform = "scale(0.8)";
      modalContent.style.opacity = "0";
      setTimeout(() => {
        modal.style.display = "none";
        const innerContent = document.getElementById("modal-inner-content");
        if (innerContent) {
          innerContent.remove();
        }
      }, 300);
    };
  
    closeButton.addEventListener("click", closeModal);
    // Close modal if the user clicks outside the modal content
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  
    // Append the modal overlay to the document body
    document.body.appendChild(modal);
  
    // Function to open the modal with given HTML content
    const openModal = (content) => {
      const existingContent = document.getElementById("modal-inner-content");
      if (existingContent) {
        existingContent.remove();
      }
      const innerContent = document.createElement("div");
      innerContent.id = "modal-inner-content";
      innerContent.innerHTML = content;
      modalContent.appendChild(innerContent);
      modal.style.display = "flex";
      setTimeout(() => {
        modalContent.style.transform = "scale(1)";
        modalContent.style.opacity = "1";
      }, 50);
    };
  
    // Replace default alert behavior on elements with class "view-details"
    const detailEls = document.querySelectorAll(".view-details");
    detailEls.forEach(element => {
      element.addEventListener("click", (e) => {
        e.preventDefault();
        const detailsContent = element.getAttribute("data-details") || "<p>More details coming soon!</p>";
        openModal(detailsContent);
      });
    });
  
    // Close modal on Escape key press
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display === "flex") {
        closeModal();
      }
    });
  
    // For "Book Now" button in Home page, open a booking modal instead of navigating to "Book Now" page
    window.openBookingModal = () => {
      const bookingForm = document.getElementById("booking-form");
      let formHTML = "";
      if (bookingForm) {
        formHTML = bookingForm.outerHTML;
      } else {
        formHTML = "<p>Booking form not available.</p>";
      }
      openModal(formHTML);
    };
  
    // Prevent booking form submission for demo purposes
    document.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Booking submitted (demo)!");
      closeModal();
    });
  
    /***** Smooth Fade Transition for Page Switching *****/
    const pages = document.querySelectorAll(".page");
    pages.forEach(page => {
      page.style.transition = "opacity 0.5s ease-in-out";
    });
  
    // Override the original showPage function for a fade effect
    const originalShowPage = window.showPage;
    window.showPage = (pageId) => {
      pages.forEach(page => {
        page.style.opacity = "0";
        setTimeout(() => {
          page.classList.remove("active");
        }, 300);
      });
      const targetPage = document.getElementById(pageId);
      setTimeout(() => {
        targetPage.classList.add("active");
        targetPage.style.opacity = "1";
      }, 300);
    };
  
    /***** Sticky Navigation Bar *****/
    const navBar = document.querySelector("nav");
    const navOffset = navBar.offsetTop;
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > navOffset) {
        navBar.classList.add("sticky");
      } else {
        navBar.classList.remove("sticky");
      }
    });
  });
  
  // Weather Script for Cancún, Mexico
  function getLiveWeather() {
    const city = "Cancun";
    const country = "mx";
    const apiKey = "e32c788784693d57e04f53a8b74dc83e";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&appid=${apiKey}`;
  
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        return response.json();
      })
      .then(data => {
        const temperature = data.main.temp;
        const description = data.weather[0].description;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const weatherHTML = `
          <h3>Current Weather in ${city}</h3>
          <p><strong>Temperature:</strong> ${temperature}°C</p>
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Humidity:</strong> ${humidity}%</p>
          <p><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
        `;
        document.getElementById("weather").innerHTML = weatherHTML;
      })
      .catch(error => {
        console.error("Error fetching weather data:", error);
        document.getElementById("weather").innerHTML = "<p>Unable to fetch weather data at this time.</p>";
      });
  }
  
  document.addEventListener("DOMContentLoaded", getLiveWeather);
