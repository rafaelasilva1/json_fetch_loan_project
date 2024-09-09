let selectedLoanId = null; // Declare this globally, so it's accessible in both listeners

document.getElementById('fetchBtn').addEventListener('click', function() {
    const loanListElement = document.getElementById('loanList');
    const outputElement = document.getElementById('output');
    const renewalForm = document.getElementById('renewalForm');

    // Fetch the JSON from Beeceptor (correct URL)
    fetch('https://earnest-gen.free.beeceptor.com/loans')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const loans = data.data.me.loans;
            loanListElement.innerHTML = ''; // Clear existing loans

            loans.forEach(loan => {
                // Create a radio button for each loan
                const loanCheckbox = document.createElement('input');
                loanCheckbox.type = 'radio';
                loanCheckbox.name = 'loanSelection';
                loanCheckbox.value = loan.id;
                loanCheckbox.id = loan.id;

                // Label for the checkbox
                const loanLabel = document.createElement('label');
                loanLabel.htmlFor = loan.id;
                loanLabel.textContent = ` ${loan.product} - Amount Due: $${loan.currentAmountDue}`;

                // Add event listener to show form when a loan is selected
                loanCheckbox.addEventListener('change', function() {
                    selectedLoanId = loan.id; // Set the selected loan ID
                    renewalForm.style.display = 'block'; // Show the renewal form
                });

                // Append checkbox and label to the loan list
                loanListElement.appendChild(loanCheckbox);
                loanListElement.appendChild(loanLabel);
                loanListElement.appendChild(document.createElement('br'));
            });
        })
        .catch(error => {
            outputElement.textContent = 'Fetch error: ' + error.message;
        });
});

// Handle form submission and send POST request
document.getElementById('renewalForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const selectedMonth = document.getElementById('renewalMonth').value;

    if (!selectedLoanId || !selectedMonth) {
        alert('Please select a loan and choose a month.');
        return;
    }

    // Prepare the data to send in the POST request
    const postData = {
        loanId: selectedLoanId,
        renewalMonth: selectedMonth
    };

    // Send POST request to Beeceptor (correct URL for POST)
    fetch('https://earnest-gen.free.beeceptor.com/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // Display a success message when the POST request is successful
        document.getElementById('output').textContent = `Loan renewal successful! Loan ID: ${selectedLoanId}, Renewal Month: ${selectedMonth}.`;
    })
    .catch(error => {
        document.getElementById('output').textContent = 'POST error: ' + error.message;
    });
});