// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkrSgPE_uqrWfv8LW9SqYLievNei3ubfI",
  authDomain: "cash-2475a.firebaseapp.com",
  projectId: "cash-2475a",
  storageBucket: "cash-2475a.firebasestorage.app",
  messagingSenderId: "869117564785",
  appId: "1:869117564785:web:a01af2b48bea154f0508d0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const expenseForm = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');
const expenseChartCanvas = document.getElementById('expenseChart').getContext('2d');
const logoutBtn = document.getElementById('logoutBtn');
let expenseChart;
let currentUserId;

// Auth state listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        currentUserId = user.uid;
        loadExpenses();
    } else {
        // User is signed out
        window.location.href = 'index.html';
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        // Sign-out successful.
    }).catch((error) => {
        console.error("Error signing out: ", error);
    });
});

// Cargar y mostrar gastos
async function loadExpenses() {
    if (!currentUserId) return;
    expenseList.innerHTML = '';
    const q = query(collection(db, "gastos"), where("userId", "==", currentUserId));
    const querySnapshot = await getDocs(q);
    let expenses = [];
    querySnapshot.forEach((doc) => {
        expenses.push({ id: doc.id, ...doc.data() });
    });

    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    expenses.forEach(expense => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${expense.text} - <strong>${expense.amount}€</strong> - ${expense.category} - ${new Date(expense.date).toLocaleDateString()}</span>
            <div>
                <button class="edit-btn" data-id="${expense.id}">Editar</button>
                <button class="delete-btn" data-id="${expense.id}">Borrar</button>
            </div>
        `;
        expenseList.appendChild(li);
    });
    updateChart(expenses);
}

// Añadir o editar gasto
expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = document.getElementById('expenseText').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const date = document.getElementById('expenseDate').value;
    const category = document.getElementById('expenseCategory').value;
    const id = document.getElementById('expenseId').value;

    if (id) {
        // Actualizar
        const expenseRef = doc(db, "gastos", id);
        await updateDoc(expenseRef, { text, amount, date, category });
    } else {
        // Añadir nuevo
        await addDoc(collection(db, "gastos"), { text, amount, date, category, userId: currentUserId });
    }

    expenseForm.reset();
    document.getElementById('expenseId').value = '';
    loadExpenses();
});

// Funcionalidad de editar y borrar
expenseList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;
        await deleteDoc(doc(db, "gastos", id));
        loadExpenses();
    }

    if (e.target.classList.contains('edit-btn')) {
        const id = e.target.dataset.id;
        const expenseDoc = await getDoc(doc(db, "gastos", id));
        if (expenseDoc.exists()) {
            const expenseData = expenseDoc.data();
            document.getElementById('expenseText').value = expenseData.text;
            document.getElementById('expenseAmount').value = expenseData.amount;
            document.getElementById('expenseDate').value = expenseData.date;
            document.getElementById('expenseCategory').value = expenseData.category;
            document.getElementById('expenseId').value = id;
        }
    }
});

// Actualizar el gráfico
function updateChart(expenses) {
    const monthlyExpenses = {};
    expenses.forEach(expense => {
        const month = new Date(expense.date).toLocaleString('es-ES', { month: 'long', year: 'numeric' });
        if (!monthlyExpenses[month]) {
            monthlyExpenses[month] = {};
        }
        if (!monthlyExpenses[month][expense.category]) {
            monthlyExpenses[month][expense.category] = 0;
        }
        monthlyExpenses[month][expense.category] += expense.amount;
    });

    const latestMonth = Object.keys(monthlyExpenses).sort((a,b) => new Date(b.split(' de ')[1], getMonthIndex(b.split(' de ')[0])) - new Date(a.split(' de ')[1], getMonthIndex(a.split(' de ')[0])))[0];
    
    if(latestMonth){
      const chartData = monthlyExpenses[latestMonth];
      const labels = Object.keys(chartData);
      const data = Object.values(chartData);

      if (expenseChart) {
          expenseChart.destroy();
      }

      expenseChart = new Chart(expenseChartCanvas, {
          type: 'pie',
          data: {
              labels: labels,
              datasets: [{
                  label: 'Gastos de ' + latestMonth,
                  data: data,
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.7)',
                      'rgba(54, 162, 235, 0.7)',
                      'rgba(255, 206, 86, 0.7)',
                      'rgba(75, 192, 192, 0.7)'
                  ]
              }]
          }
      });
    } else {
        // Clear chart if no data
        if (expenseChart) {
            expenseChart.destroy();
        }
    }
}

function getMonthIndex(monthName){
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  return months.indexOf(monthName.toLowerCase());
}
