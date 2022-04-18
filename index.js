const Modal = {
  open() {
    document.querySelector(".modal-overlay").classList.add("active");
  },
  close() {
    document.querySelector(".modal-overlay").classList.remove("active");
  },
};

const transactions = [
  {
    id: 1,
    description: "Luz",
    amount: -50005,
    date: "13/04/2022",
  },
  {
    id: 2,
    description: "Website",
    amount: 50000,
    date: "13/04/2022",
  },
  {
    id: 3,
    description: "Internet",
    amount: -10000,
    date: "13/04/2022",
  },

  {
    id: 4,
    description: "App",
    amount: 200015,
    date: "13/04/2022",
  },
];

const Transaction = {
  income() {
    //somar as entradas
  },
  expense() {
    //somar as saídas
  },
  total() {
    // entradas - saídas
  },
};

const DOM = {
  transactionsContainer: document.querySelector("#data-table tbody"),

  addTransaction(transaction, index) {
    const tr = document.createElement("tr");
    tr.innerHTML = DOM.innerHTMLTransaction(transaction);

    DOM.transactionsContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction) {
    const CSSclass = transaction.amount > 0 ? "income" : "expense";
    const amount = Utils.formatCurrency(transaction.amount);
    const html = `
        
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
          <img src="./assets/minus.svg" alt="Remover Transação" />
        </td>
      `;
    return html;
  },
};

const Utils = {
  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : "";

    value = String(value).replace(/\D/g, ""); // expressão regular = "/ /" - "\D" =(especial da exp.reg) ache só numeros - "g" = global

    value = Number(value) / 100;

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return signal + value;
  },
};

transactions.forEach(function (transaction) {
  DOM.addTransaction(transaction);
});
