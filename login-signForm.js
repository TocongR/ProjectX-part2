// Toggle between sign-up and login forms
document.getElementById('toggleForm').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior
    let signupForm = document.getElementById('signupForm');
    let loginForm = document.getElementById('loginForm');
    
    if (signupForm.style.display !== 'none') {
      signupForm.style.display = 'none';
      loginForm.style.display = 'block';
    } else {
      loginForm.style.display = 'none';
      signupForm.style.display = 'block';
    }
  });
  
  // Handle form submissions
  document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    let username = document.getElementById('signupUsername').value;
    let password = document.getElementById('signupPassword').value;
    
    // Here you can perform signup logic, like sending data to server or storing in Google Sheets
    
    // For demo, let's assume signup is successful and redirect to home.html
    window.location.href = 'home.html';
  });
  
  document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    let username = document.getElementById('loginUsername').value;
    let password = document.getElementById('loginPassword').value;
    
    // Here you can perform login logic, like checking credentials against database
    
    // For demo, let's assume login is successful and redirect to home.html
    window.location.href = 'home.html';
  });
  