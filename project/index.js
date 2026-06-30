/* =========================
   LOAD DATA
========================= */

var data = JSON.parse(localStorage.getItem("wallet"));

if (!data) {
    data = {
        balance: 0,
        income: 0,
        expense: 0,
        transactions: []
    };
}

/* =========================
   SAVE DATA
========================= */

function save() {
    localStorage.setItem("wallet", JSON.stringify(data));
}

/* =========================
   UPDATE UI
========================= */

function update() {

    document.getElementById("balance").innerText = "₹" + data.balance;
    document.getElementById("income").innerText = "₹" + data.income;
    document.getElementById("expense").innerText = "₹" + data.expense;

    var box = document.getElementById("transactions");
    box.innerHTML = "";

    if (data.transactions.length === 0) {
        box.innerHTML = '<p class="empty">No transactions yet</p>';
    } else {

        for (var i = data.transactions.length - 1; i >= 0; i--) {

            var t = data.transactions[i];

            var sign = t.type === "in" ? "+" : "-";

            box.innerHTML += `
                <div class="transaction">
                    <div>
                        <b>${t.category}</b><br>
                        <small>${t.note || "No note"}<br>
                        Date: ${t.date || "N/A"}</small>
                    </div>
                    <div class="${t.type}">
                        ${sign}₹${t.amount}
                    </div>
                </div>
            `;
        }
    }

    // Progress calculation
    var percent = 0;

    if (data.income > 0) {
        percent = (data.expense / data.income) * 100;
    }

    if (percent > 100) percent = 100;

    document.getElementById("progressBar").style.width = percent + "%";
    document.getElementById("goalText").innerText = Math.round(percent) + "%";
}

/* =========================
   ADD MONEY
========================= */

function addMoney() {

    var input = document.getElementById("money").value;

    if (!input || isNaN(input) || Number(input) <= 0) {
        alert("Please enter a valid amount");
        return;
    }

    var amount = Number(input);

    data.balance += amount;
    data.income += amount;

    data.transactions.push({
        type: "in",
        amount: amount,
        category: "Money Added",
        note: "Balance updated",
        date: new Date().toLocaleDateString()
    });

    save();
    update();

    document.getElementById("money").value = "";
}

/* =========================
   ADD EXPENSE
========================= */

function addExpense() {

    var amountInput = document.getElementById("amount").value;
    var category = document.getElementById("category").value;
    var note = document.getElementById("note").value;
    var date = document.getElementById("expenseDate").value;

    if (!amountInput || isNaN(amountInput) || Number(amountInput) <= 0) {
        alert("Please enter a valid expense amount");
        return;
    }

    var amount = Number(amountInput);

    if (amount > data.balance) {
        alert("Not enough balance");
        return;
    }

    data.balance -= amount;
    data.expense += amount;

    data.transactions.push({
        type: "out",
        amount: amount,
        category: category,
        note: note,
        date: date || new Date().toLocaleDateString()
    });

    save();
    update();

    document.getElementById("amount").value = "";
    document.getElementById("note").value = "";
}

/* =========================
   RESET DATA (SAFE VERSION)
========================= */

function resetData() {

    var confirmReset = confirm("Are you sure you want to reset all data?");

    if (!confirmReset) return;

    localStorage.removeItem("wallet");

    data = {
        balance: 0,
        income: 0,
        expense: 0,
        transactions: []
    };

    update();
}

/* =========================
   INITIAL LOAD
========================= */

update();