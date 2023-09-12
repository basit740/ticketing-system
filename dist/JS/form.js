const fileInput = document.getElementById("fileInput");
      const customAlert = document.getElementById("customAlert");
      const alertMessage = document.getElementById("alertMessage");

      fileInput.addEventListener("change", handleFileSelect);

      function handleFileSelect(event) {
        const file = event.target.files[0];
        const maxSize = 25 * 1024 * 1024; // 25MB in bytes

        if (file && file.size > maxSize) {
          showAlert("File size exceeds the maximum limit of 25MB.");
          fileInput.value = ""; // Clear the file input to allow the user to select another file.
        } else {
          // File size is within the limit, proceed with the upload.
          // You can implement the upload functionality here.
        }
      }

      function showAlert(message) {
        alertMessage.textContent = message;
        customAlert.classList.remove("hidden");
      }

      function closeAlert() {
        customAlert.classList.add("hidden");
      }