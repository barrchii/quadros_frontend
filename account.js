const API_URL = 'http://127.0.0.1:8000/api/accounts';

const loginDiv = document.querySelector('.login');
const emailInput = document.getElementById('emailAddress');
const continueBtn = loginDiv.querySelector('button');

let currentEmail = '';

// Step 1: Send code
continueBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  if (!email) return;

  currentEmail = email;

  const response = await fetch(`${API_URL}/send-code/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email }),
  });

  if (response.ok) {
    showCodeInput();
  }
});

// Step 2: Show code input
function showCodeInput() {
  loginDiv.innerHTML = `
    <label for="code">Enter the 6-digit code sent to ${currentEmail}</label>
    <input type="text" id="codeInput" maxlength="6" placeholder="000000" />
    <button id="verifyBtn">Verify</button>
  `;

  document.getElementById('verifyBtn').addEventListener('click', verifyCode);
}

// Step 3: Verify code
async function verifyCode() {
  const code = document.getElementById('codeInput').value.trim();
  if (code.length !== 6) return;

  const response = await fetch(`${API_URL}/verify-code/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email: currentEmail, code }),
  });

  if (response.ok) {
    const data = await response.json();
    showLoggedIn(data.user.email);
  }
}

// Step 4: Show logged in state
function showLoggedIn(email) {
  loginDiv.innerHTML = `
    <label>Signed in as ${email}</label>
    <button id="logoutBtn">Sign out</button>
  `;

  document.getElementById('logoutBtn').addEventListener('click', () => {
    loginDiv.innerHTML = `
      <label for="email">Sign in or create an account</label>
      <input type="email" id="emailAddress" name="emailAddress" placeholder="Email" />
      <button>Continue</button>
    `;
    // Re-attach the click listener to the new button
    loginDiv.querySelector('button').addEventListener('click', arguments.callee);
  });
}