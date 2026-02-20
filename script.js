// ============================================================
// VISITOR ATTENDANCE — localStorage Database
// Data is saved per date in browser storage. No setup needed.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('sheetDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    // Load data for today on startup
    loadData();

    // Auto-save and reload when date changes
    dateInput.addEventListener('change', () => {
        loadData();
    });
});

// ============================================================
// TABLE MANAGEMENT
// ============================================================
function addRows(count) {
    const tbody = document.getElementById('tableBody');
    const currentCount = tbody.children.length;

    for (let i = 0; i < count; i++) {
        const tr = document.createElement('tr');

        // Row number (static)
        const tdNo = document.createElement('td');
        tdNo.style.textAlign = 'center';
        tdNo.textContent = currentCount + i + 1;
        tr.appendChild(tdNo);

        // Editable data columns
        const fields = ['timeIn', 'name', 'visiting', 'address', 'purpose', 'timeOut', 'remarks'];
        fields.forEach(field => {
            const td = document.createElement('td');
            td.contentEditable = 'true';
            td.dataset.field = field;
            td.classList.add('editable-cell');

            // Auto-save on every keystroke
            td.addEventListener('input', () => saveData(true));
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    }
}

// ============================================================
// SAVE TO localStorage
// ============================================================
function saveData(silent = false) {
    const date = document.getElementById('sheetDate').value;
    if (!date) return;

    const tbody = document.getElementById('tableBody');
    const rows = [];

    tbody.querySelectorAll('tr').forEach(tr => {
        const rowData = {};
        tr.querySelectorAll('td[data-field]').forEach(td => {
            rowData[td.dataset.field] = td.innerText.trim();
        });
        rows.push(rowData);
    });

    localStorage.setItem(`visitors_${date}`, JSON.stringify(rows));

    if (!silent) {
        showToast('✅ Saved successfully!', 'success');
    }
}

// ============================================================
// LOAD FROM localStorage
// ============================================================
function loadData() {
    const date = document.getElementById('sheetDate').value;
    if (!date) return;

    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    const saved = localStorage.getItem(`visitors_${date}`);

    if (saved) {
        const rows = JSON.parse(saved);
        const totalRows = Math.max(rows.length + 5, 20);
        addRows(totalRows);

        const trs = tbody.querySelectorAll('tr');
        rows.forEach((rowData, idx) => {
            if (!trs[idx]) return;
            trs[idx].querySelectorAll('td[data-field]').forEach(td => {
                td.innerText = rowData[td.dataset.field] || '';
            });
        });

        showToast(`📂 Loaded records for ${date}`, 'info');
    } else {
        // No data for this date — start fresh
        addRows(20);
    }
}

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.add('hidden');
    }, 2500);
}
