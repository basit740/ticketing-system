(function () {
  const filterDropdowns = document.querySelectorAll(
    "#filterDropdown2, #filterDropdown3, #filterDropdown4, #filterDropdown5"
  );
  const searchInput = document.getElementById("searchInput");
  const dataTable = document.getElementById("dataTable");
  const resetButton = document.getElementById("resetButton");

  filterDropdowns.forEach(function (dropdown) {
    dropdown.addEventListener("change", filterTable);
  });
  searchInput.addEventListener("input", filterTable);
  resetButton.addEventListener("click", resetFilters);

  // Add event listeners to the "Delete" buttons in the table
  const deleteButtons = document.querySelectorAll("#dataTable .delete-button");
  deleteButtons.forEach(function (button) {
    button.addEventListener("click", deleteRow);
  });

  // Add event listeners to the "Edit" links in the table
  const editLinks = document.querySelectorAll("#dataTable .edit-button");
  editLinks.forEach(function (link) {
    link.addEventListener("click", editRow);
  });

  function filterTable() {
    const filterValues = Array.from(filterDropdowns).map(
      (dropdown) => dropdown.value.toLowerCase()
    );
    const searchQuery = searchInput.value.toLowerCase();

    const rows = dataTable.getElementsByTagName("tr");
    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName("td");
      let rowVisible = true;

      // ... (rest of the function remains unchanged)
    }
  }

  function resetFilters() {
    filterDropdowns.forEach(function (dropdown) {
      dropdown.value = "all";
    });
    searchInput.value = "";
    filterTable();
  }

  function deleteRow(event) {
    const row = event.target.parentNode.parentNode;
    row.parentNode.removeChild(row);
  }

  function editRow(event) {
    // Implement edit functionality here
    // For example, you can get the row data and populate an edit form
    // This function will be called when an "Edit" link is clicked
    alert("Edit functionality is not implemented in this example.");
  }

  // Initial filtering to ensure the table is displayed correctly
  filterTable();
})();
