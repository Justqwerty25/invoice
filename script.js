let itemCount = 0;

// Auto-generate invoice number
document.getElementById('invoiceNumber').value = `2025-INV-${String(Math.random()).slice(-3).padStart(3, '0')}`;

function addItem() {
    const itemsTable = document.getElementById('items');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="text" placeholder="Beschrijving"></td>
        <td><input type="number" placeholder="Hoeveelheid" oninput="calculateTotals()"></td>
        <td><input type="number" placeholder="Prijs per eenheid" oninput="calculateTotals()"></td>
        <td>
            <select onchange="calculateTotals()">
                <option value="0.21">21%</option>
                <option value="0.09">9%</option>
                <option value="0">0%</option>
            </select>
        </td>
        <td><span>€0.00</span></td>
        <td><button onclick="removeItem(this.parentElement.parentElement)">Verwijder</button></td>
    `;
    itemsTable.appendChild(newRow);
    itemCount++;
}

function removeItem(row) {
    row.remove();
    calculateTotals();
}

function calculateTotals() {
    let subtotal = 0;
    const rows = document.querySelectorAll('#items tr');
    rows.forEach(row => {
        const quantity = parseFloat(row.querySelector('input[type="number"]').value) || 0;
        const price = parseFloat(row.querySelectorAll('input[type="number"]')[1].value) || 0;
        const vatRate = parseFloat(row.querySelector('select').value);
        const total = quantity * price * (1 + vatRate);
        subtotal += total;
        row.querySelector('span').textContent = `€${total.toFixed(2)}`;
    });

    const vat = subtotal * 0.21;
    const total = subtotal + vat;

    document.getElementById('subtotal').textContent = `€${subtotal.toFixed(2)}`;
    document.getElementById('vat').textContent = `€${vat.toFixed(2)}`;
    document.getElementById('total').textContent = `€${total.toFixed(2)}`;
}

function exportPDF() {
    console.log("Export PDF clicked");
    const container = document.querySelector('.container');

    // Replace inputs and selects with their values temporarily
    const inputs = container.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        const span = document.createElement('span');
        span.textContent = input.type === 'select-one' ? input.options[input.selectedIndex].text : input.value;
        span.style.display = 'inline-block';
        span.style.padding = input.style.padding;
        span.style.width = input.style.width;
        input.parentNode.replaceChild(span, input);
        input._replacement = span; // Store the replacement for later
    });

    // Generate PDF
    const doc = new jsPDF('p', 'mm', 'a4'); // Portrait mode, mm units, A4 size
    doc.html(container, {
        callback: function (doc) {
            doc.save('factuur.pdf');
            // Revert replacements
            inputs.forEach(input => {
                if (input._replacement) {
                    input._replacement.parentNode.replaceChild(input, input._replacement);
                    delete input._replacement;
                }
            });
        },
        x: 10,
        y: 10,
        width: 190, // Width of the content in the PDF
        windowWidth: 1000 // Width of the HTML content
    });
}

function sendEmail() {
    console.log("E-mail Factuur clicked");
    const email = document.getElementById('clientEmail').value;
    if (!email) {
        alert('Voer een geldig e-mailadres in.');
        return;
    }
    console.log("Sending email to:", email);
    window.location.href = `mailto:${email}?subject=Factuur&body=Bekijk uw factuur bijgevoegd.`;
}

// Example: Add an initial item
addItem();
