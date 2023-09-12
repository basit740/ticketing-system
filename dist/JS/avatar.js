 window.onload = function () {
        const dropdownToggle = document.getElementById("dropdownToggle");
        const dropdownMenu = document.getElementById("dropdownMenu");

        dropdownToggle.addEventListener("click", function () {
          dropdownMenu.classList.toggle("hidden");
        });

        document.addEventListener("click", function (event) {
          const targetElement = event.target;
          if (!targetElement.closest(".relative")) {
            dropdownMenu.classList.add("hidden");
          }
        });
      };