function getDetails() {
    var input = document.getElementById('pincode').value.trim();
    if (input === "") {
        displayMessage('Please enter a valid PIN code or Branch Name.', 'error');
        return;
    }

    var url = '/get_details/' + encodeURIComponent(input);

    // Display the loading spinner
    document.getElementById('result').innerHTML = '<div class="loader"></div>';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            var resultDiv = document.getElementById('result');
            if (!data || !data.Status || data.Status !== 'Success' || !data.PostOffice || data.PostOffice.length === 0) {
                resultDiv.innerHTML = '<p>No valid data received from the server</p>';
                document.getElementById('result-search').style.display = 'none';  // Hide search box if no data
                return;
            }

            var postOffices = data.PostOffice;

            if (Array.isArray(postOffices) && postOffices.length > 0) {
                // Construct the table header and body in a structured way
                let tableHTML = `
                    <table id="result-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Branch Type</th>
                                <th>Delivery Status</th>
                                <th>Circle</th>
                                <th>District</th>
                                <th>Division</th>
                                <th>Region</th>
                                <th>Block</th>
                                <th>State</th>
                                <th>Pincode</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                // Loop through post offices to add each as a table row
                postOffices.forEach(office => {
                    tableHTML += `
                        <tr>
                            <td>${office.Name}</td>
                            <td>${office.BranchType}</td>
                            <td>${office.DeliveryStatus}</td>
                            <td>${office.Circle}</td>
                            <td>${office.District}</td>
                            <td>${office.Division}</td>
                            <td>${office.Region}</td>
                            <td>${office.Block}</td>
                            <td>${office.State}</td>
                            <td>${office.Pincode}</td>
                        </tr>
                    `;
                });

                // Close the table body and table tags properly
                tableHTML += `
                        </tbody>
                    </table>
                `;

                // Insert the generated table HTML into the result div
                resultDiv.innerHTML = tableHTML;

                // Show the search input box
                document.getElementById('result-search').style.display = 'block';

                // Add event listener for the search input
                document.getElementById('search').addEventListener('input', filterTable);
            } else {
                resultDiv.innerHTML = '<p>No Post Office details found</p>';
                document.getElementById('result-search').style.display = 'none';  // Hide search box if no data
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayMessage('Error fetching data. Please try again.', 'error');
        });
}

function displayMessage(message, type) {
    var resultDiv = document.getElementById('result');
    var messageHTML = `<p style="color: ${type === 'error' ? 'red' : 'green'};">${message}</p>`;
    resultDiv.innerHTML = messageHTML;
}

// Function to filter the table rows based on the search input
function filterTable() {
    var input = document.getElementById('search').value.toLowerCase();
    var table = document.getElementById('result-table');
    var rows = table.getElementsByTagName('tr');

    // Loop through all table rows, skipping the first row (the header)
    for (var i = 1; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName('td');
        var match = false;

        // Check each cell for matching text
        for (var j = 0; j < cells.length; j++) {
            if (cells[j].innerText.toLowerCase().includes(input)) {
                match = true;
                break;
            }
        }

        // Show or hide the row based on whether it matches the search input
        rows[i].style.display = match ? '' : 'none';
    }
}
