const API_URL = 'http://127.0.0.1:8000/api/accounts';

const loginDiv = document.querySelector('.login');
let currentEmail = '';

function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}


// Check if user is already logged in
async function checkAuth() {
  const response = await fetch(`${API_URL}/check/`, {
    credentials: 'include',
  });
  const data = await response.json();
  if (data.authenticated) {
    showSignedIn(data.email);
  }
}

// Step 1: Send code
function attachContinueListener() {
  const emailInput = document.getElementById('emailAddress');
  const continueBtn = loginDiv.querySelector('button');

  const handleSend = async () => {
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
  };

  continueBtn.addEventListener('click', handleSend);
  emailInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });
}

// Step 2: Show code input
function showCodeInput() {
  loginDiv.innerHTML = `
    <label for="code">Enter the 6-digit code sent to ${sanitize(currentEmail)}</label>
    <input type="text" id="codeInput" maxlength="6" placeholder="000000" />
    <button id="verifyBtn">Verify</button>
  `;

  document.getElementById('verifyBtn').addEventListener('click', verifyCode);
  document.getElementById('codeInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') verifyCode();
  });
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
    showSignedIn(data.user.email);
  }
}

// Signed-in view
function showSignedIn(email) {
  loginDiv.innerHTML = `
    <label>You're signed in using ${sanitize(email)}</label>
    <button id="signOutBtn">Sign out</button>
    <button id="deleteBtn">Delete account</button>
  `;

  document.getElementById('signOutBtn').addEventListener('click', async () => {
    await fetch(`${API_URL}/logout/`, {
      method: 'POST',
      credentials: 'include',
    });
    showSignedOut();
  });

  document.getElementById('deleteBtn').addEventListener('click', showDeleteConfirm);
}

// Delete confirmation view
function showDeleteConfirm() {
  loginDiv.innerHTML = `
    <label>Wanna delete your account?</label>
    <button id="noDeleteBtn">No, take me back</button>
    <button id="yesDeleteBtn">Yeah, delete it</button>
  `;

  document.getElementById('noDeleteBtn').addEventListener('click', () => {
    checkAuth();
  });

  document.getElementById('yesDeleteBtn').addEventListener('click', async () => {
    await fetch(`${API_URL}/delete/`, {
      method: 'DELETE',
      credentials: 'include',
    });
    showSignedOut();
  });
}

// Signed-out view
function showSignedOut() {
  loginDiv.innerHTML = `
    <label for="email">Sign in or create an account</label>
    <input type="email" id="emailAddress" name="emailAddress" placeholder="Email" />
    <button>Continue</button>
  `;
  attachContinueListener();
}

// Init
checkAuth();
attachContinueListener();