let arr = [];
let arr1;
let arr2;
let transactions; // To store all transactions data
let customers; // To store all customers data

async function getData() {
  try {
    let response = await fetch("https://mocki.io/v1/a73d7d4d-32b2-4f1d-9d07-7a2ac6771b0f");
    let data = await response.json();

    customers = data.customers;
    transactions = data.transactions;

    arr1 = customers.map((customer) => customer.name);
    arr2 = transactions.map((transaction) => transaction.amount);

    console.log(customers);
    console.log(transactions);
    console.log(arr1);
    console.log(arr2);

    display();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

getData();

function display() {
  let cartona = "";
  for (let i = 0; i < arr1.length; i++) {
    cartona += `
      <tr>
        <td>${arr1[i]}</td>
        <td>${arr2[i]}</td>
        <td>
          <button class="btn btn-outline-info btn-sm" onclick="showChart(${i})">View Transaction</button>
        </td>
      </tr>`;
  }

  document.getElementById("body").innerHTML = cartona;
}

function searchByName() {
  let term = document.getElementById("searchInput").value.toLowerCase().trim();
  let cartona = "";

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].toLowerCase().includes(term)) {
      cartona += `
        <tr>
          <td>${arr1[i]}</td>
          <td>${arr2[i]}</td>
          <td>
            <button class="btn btn-outline-info btn-sm" onclick="showChart(${i})">View Transaction</button>
          </td>
        </tr>`;
    }
  }

  document.getElementById("body").innerHTML = cartona;
}

document.getElementById("searchInput").addEventListener("input", searchByName);

let chart; // Variable to hold the chart instance

function showChart(index) {
  const customerName = arr1[index];
  const customerId = customers[index].id;

  const customerTransactions = transactions.filter(
    (transaction) => transaction.customer_id === customerId
  );

  const labels = customerTransactions.map((transaction, index) => `Day ${index + 1}`);
  const data = customerTransactions.map((transaction) => transaction.amount);

  if (chart) {
    chart.destroy(); // Destroy previous chart instance if exists
  }

  const transactionChart = document.getElementById("transactionChart").getContext("2d");
  chart = new Chart(transactionChart, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: `Transactions for ${customerName}`,
          data: data,
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        x: {
          beginAtZero: true,
        },
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  // Display the chart container
  const chartContainer = document.getElementById("chartContainer");
  chartContainer.style.display = "block";

  // Scroll to the chart container for better user experience
  window.scrollTo(0, chartContainer.offsetTop);
}
