const Modal = {
  open() {
    document.querySelector(".modal-overlay").classList.add("active");
  },
  close() {
    document.querySelector(".modal-overlay").classList.remove("active");
  },
};

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [];
  },

  set(transactions) {
    localStorage.setItem(
      "dev.finances:transactions",
      JSON.stringify(transactions)
    );
  },
};

const Transaction = {
  all: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction);

    App.reload();
  },

  remove(index) {
    Transaction.all.splice(index, 1);

    App.reload();
  },

  incomes() {
    let income = 0;
    //pegar todas as transaçoes
    Transaction.all.forEach((transaction) => {
      //para cada transação
      if (transaction.amount > 0) {
        // se ela for maior que zero
        income = income + transaction.amount; // somar a uma variavel (income)
      }
    });
    return income; // retornar variavel
  },

  expenses() {
    let expense = 0;
    Transaction.all.forEach((transaction) => {
      if (transaction.amount < 0) {
        // se ela for menor que zero
        expense += transaction.amount;
      }
    });
    return expense;
  },

  total() {
    return Transaction.incomes() + Transaction.expenses(); // retornar o total somando entrada e saida(saida ja esta com valor negativo) podendo usar "+" no return
  },
};

const DOM = {
  transactionsContainer: document.querySelector("#data-table tbody"),

  addTransaction(transaction, index) {
    const tr = document.createElement("tr");
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;

    DOM.transactionsContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? "income" : "expense";
    const amount = Utils.formatCurrency(transaction.amount);
    const html = `
        
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
          <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação" />
        </td>
      `;
    return html;
  },

  updateBalance() {
    document.getElementById("incomeDisplay").innerHTML = Utils.formatCurrency(
      Transaction.incomes()
    );
    document.getElementById("expenseDisplay").innerHTML = Utils.formatCurrency(
      Transaction.expenses()
    );

    document.getElementById("totalDisplay").innerHTML = Utils.formatCurrency(
      Transaction.total()
    );
  },

  clearTransactions() {
    DOM.transactionsContainer.innerHTML = "";
  },
};

const Utils = {
  formatAmount(value) {
    value = Number(value.replace(/\,\./g, "")) * 100;

    return value;
  },

  formatDate(date) {
    const splittedDate = date.split("-"); // remove separador

    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`; // retorna data inserida em cada posição do array = 20/04/2022
  },

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

const Form = {
  description: document.querySelector("input#description"),
  amount: document.querySelector("input#amount"),
  date: document.querySelector("input#date"),

  getValues() {
    // objeto que retonar somente com os valores
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    };
  },

  validateFields() {
    const { description, amount, date } = Form.getValues();

    if (
      description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === ""
    ) {
      // trim = remove espaços vazios // verifica se tem valores
      throw new Error("Por favor, preencha todos os campos");
    }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues();

    amount = Utils.formatAmount(amount);

    date = Utils.formatDate(date);

    return {
      description: description,
      amount: amount,
      date: date,
    };
  },

  clearFields() {
    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  },

  submit(event) {
    event.preventDefault();

    try {
      Form.validateFields(); // validar se os campos foram preenchidos
      const transaction = Form.formatValues(); // formatar dados para salvar
      Transaction.add(transaction); //   salvar/add as transações // reutilizando o Transaction.add
      Form.clearFields(); // limpar os campos
      Modal.close(); // fecha modal
    } catch (error) {
      alert(error.message);
    }
  },
};

const App = {
  init() {
    Transaction.all.forEach((transaction, index) => {
      DOM.addTransaction(transaction, index); // adicona transação na dom
    });

    DOM.updateBalance(); // atualiza as cards com os valores

    Storage.set(Transaction.all); // atualiza o localstorage(dados)
  },

  reload() {
    DOM.clearTransactions();
    App.init();
  },
};

App.init();

// Transaction.add({
//   description: "teste",
//   amount: 600,
//   date: "18/04/2022",
// });

// Transaction.remove(2);
