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

let expenseForm;
let expenseList;
let expenseChartCanvas;
let logoutBtn;
let expenseChart;
let currentUserId;
let today;

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    expenseForm = document.getElementById('expenseForm');
    expenseList = document.getElementById('expenseList');
    expenseChartCanvas = document.getElementById('expenseChart').getContext('2d');
    logoutBtn = document.getElementById('logoutBtn');

    // Set today's date as default
    today = new Date().toISOString().split('T')[0];
    document.getElementById('expenseDate').value = today;

    // Cancel edit button
    document.getElementById('cancelBtn').addEventListener('click', () => {
        expenseForm.reset();
        document.getElementById('expenseId').value = '';
        document.getElementById('expenseDate').value = today;
        document.querySelector('.form-container h2').textContent = '➕ Nuevo Gasto';
        document.getElementById('submitBtn').textContent = 'Guardar Gasto';
        document.getElementById('cancelBtn').style.display = 'none';
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            console.error("Error signing out: ", error);
        });
    });

    // Add expense form handler
    expenseForm.addEventListener('submit', handleExpenseSubmit);

    // Expense list click handler
    expenseList.addEventListener('click', handleExpenseListClick);
});

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

    // Calculate stats
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentMonthExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    });
    
    const totalMonth = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const numExpenses = currentMonthExpenses.length;
    const avgExpense = numExpenses > 0 ? totalMonth / numExpenses : 0;
    
    document.getElementById('totalMonth').textContent = totalMonth.toFixed(2) + '€';
    document.getElementById('totalExpenses').textContent = numExpenses;
    document.getElementById('avgExpense').textContent = avgExpense.toFixed(2) + '€';

    if (expenses.length === 0) {
        expenseList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <h3>No hay gastos registrados</h3>
                <p>Comienza añadiendo tu primer gasto</p>
            </div>
        `;
        updateChart([]);
        return;
    }

    expenses.forEach(expense => {
        const li = document.createElement('li');
        const categoryClass = expense.category.toLowerCase().replace(/\s+/g, '-');
        li.innerHTML = `
            <span>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                    <strong style="font-size: 16px; color: #1e293b;">${expense.text}</strong>
                    <span class="category-badge category-${categoryClass}">${expense.category}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 12px; font-size: 14px; color: #64748b;">
                    <strong style="font-size: 20px; color: #6366f1;">${expense.amount}€</strong>
                    <span>📅 ${new Date(expense.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
            </span>
            <div class="expense-actions">
                <button class="edit-btn" data-id="${expense.id}">✏️ Editar</button>
                <button class="delete-btn" data-id="${expense.id}">🗑️ Borrar</button>
            </div>
        `;
        expenseList.appendChild(li);
    });
    updateChart(expenses);
}

// Añadir o editar gasto
async function handleExpenseSubmit(e) {
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
    document.getElementById('expenseDate').value = today;
    document.querySelector('.form-container h2').textContent = '➕ Nuevo Gasto';
    document.getElementById('submitBtn').textContent = 'Guardar Gasto';
    document.getElementById('cancelBtn').style.display = 'none';
    loadExpenses();
}

// Funcionalidad de editar y borrar
async function handleExpenseListClick(e) {
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
            document.querySelector('.form-container h2').textContent = '✏️ Editar Gasto';
            document.getElementById('submitBtn').textContent = 'Actualizar Gasto';
            document.getElementById('cancelBtn').style.display = 'block';
            // Scroll to form
            document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

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
          type: 'doughnut',
          data: {
              labels: labels,
              datasets: [{
                  label: 'Gastos de ' + latestMonth,
                  data: data,
                  backgroundColor: [
                      'rgba(99, 102, 241, 0.8)',
                      'rgba(236, 72, 153, 0.8)',
                      'rgba(16, 185, 129, 0.8)',
                      'rgba(245, 158, 11, 0.8)'
                  ],
                  borderColor: [
                      'rgba(99, 102, 241, 1)',
                      'rgba(236, 72, 153, 1)',
                      'rgba(16, 185, 129, 1)',
                      'rgba(245, 158, 11, 1)'
                  ],
                  borderWidth: 2
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                  legend: {
                      position: 'bottom',
                      labels: {
                          padding: 20,
                          font: {
                              size: 14,
                              weight: '600'
                          }
                      }
                  },
                  title: {
                      display: true,
                      text: 'Gastos de ' + latestMonth,
                      font: {
                          size: 16,
                          weight: '700'
                      },
                      padding: 20
                  },
                  tooltip: {
                      callbacks: {
                          label: function(context) {
                              let label = context.label || '';
                              if (label) {
                                  label += ': ';
                              }
                              label += context.parsed + '€';
                              const total = context.dataset.data.reduce((a, b) => a + b, 0);
                              const percentage = ((context.parsed / total) * 100).toFixed(1);
                              label += ` (${percentage}%)`;
                              return label;
                          }
                      }
                  }
              }
          }
      });
    } else {
        // Clear chart if no data
        if (expenseChart) {
            expenseChart.destroy();
            expenseChart = null;
        }
        // Show empty state for chart
        const chartContainer = document.querySelector('.chart-container');
        const canvas = document.getElementById('expenseChart');
        if (canvas) {
            canvas.style.display = 'none';
        }
        if (!document.querySelector('.chart-empty-state')) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state chart-empty-state';
            emptyState.innerHTML = `
                <div class="empty-state-icon">📊</div>
                <h3>Sin datos para mostrar</h3>
                <p>Añade gastos para ver el gráfico</p>
            `;
            chartContainer.appendChild(emptyState);
        }
    }
    
    // Restore canvas if we have data
    if (expenses.length > 0) {
        const canvas = document.getElementById('expenseChart');
        if (canvas) {
            canvas.style.display = 'block';
        }
        const emptyState = document.querySelector('.chart-empty-state');
        if (emptyState) {
            emptyState.remove();
        }
    }
}

function getMonthIndex(monthName){
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  return months.indexOf(monthName.toLowerCase());
}
