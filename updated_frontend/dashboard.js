// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4LJgQ7oxHk-LHNvJrnReWOP9c-WIAlDQ",
  authDomain: "sih-eca-2025.firebaseapp.com",
  projectId: "sih-eca-2025",
  storageBucket: "sih-eca-2025.appspot.com",
  messagingSenderId: "1083963361758",
  appId: "1:1083963361758:web:65841e1b6e66097e62f54f",
  measurementId: "G-GLKPFGLGC9"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Fetches attendance data from Firestore and renders it as a bar chart.
 */
async function loadAttendance() {
  try {
    // Get the attendance data for a specific date
    const snapshot = await getDocs(collection(db, "attendance/2025-09-05/students"));
    const students = snapshot.docs.map(doc => doc.data());

    // Define the subjects and initialize counters
    const subjects = ["MCC", "MCC_1", "MPMC", "CLOUD", "CLOUD_1", "ADHOC", "ME"];
    const counts = {};
    subjects.forEach(subj => counts[subj] = { present: 0, total: 0 });

    // Process each student's attendance
    students.forEach(stu => {
      subjects.forEach(subj => {
        if (stu[subj]) {
          counts[subj].total++;
          if (stu[subj].startsWith("Present")) {
            counts[subj].present++;
          }
        }
      });
    });

    // Prepare data for Chart.js
    const labels = subjects;
    const data = subjects.map(s =>
      counts[s].total > 0 ? (counts[s].present / counts[s].total) * 100 : 0
    );

    // Render the chart
    new Chart(document.getElementById("attendanceChart"), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Attendance %',
          data: data,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        // By setting this to true, the chart will maintain the aspect ratio defined in the canvas HTML element.
        // This prevents the chart from growing uncontrollably in height.
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
                callback: function(value) {
                    return value + "%"
                }
            }
          }
        }
      }
    });
  } catch (error) {
    console.error("Error loading attendance data:", error);
    // Optionally display an error message on the UI
    const chartArea = document.getElementById("attendanceChart").parentElement;
    chartArea.innerHTML = "<p style='color: red; text-align: center;'>Could not load chart data.</p>";
  }
}

// This runs after the HTML document has been fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const yearSelect = document.getElementById('yearSelect');

    // --- Event Listeners for UI elements ---
    hamburgerBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    yearSelect.addEventListener('change', (e) => {
        console.log(`Data for ${e.target.value} year selected.`);
        // In a real app, you might reload the chart with data for the selected year
    });

    // Load the attendance graph when the page is ready
    loadAttendance();
});

// These functions are called by the inline 'onclick' attributes in the HTML
window.showSection = function(sectionName) {
    console.log(`Navigating to the "${sectionName}" section.`);
    
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }
}

window.logout = function() {
    console.log('User logged out.');
    window.location.href = '/login/login.html';
}

