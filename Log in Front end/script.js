// fake users for now, need to conect a real database later
var users = [
  { email: "test@movieistad.com", password: "123456" },
  { email: "admin@movieistad.com", password: "admin123" }
];

// get the accounts people made with the sign up form
function getSavedUsers() {
  try {
    var data = localStorage.getItem("movieistad_users");
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

var savedUsers = getSavedUsers();

var taken = ["A4", "A5", "B7", "C2", "C3", "D6", "D7", "E9", "F3", "F4"];
var mySeat = "";

// making the seats
var letters = ["A", "B", "C", "D", "E", "F"];
var map = document.getElementById("seatMap");

for (var i = 0; i < letters.length; i++) {
  var row = document.createElement("div");
  row.className = "seat-row";

  for (var j = 1; j <= 12; j++) {
    var seat = document.createElement("button");
    var name = letters[i] + j;
    seat.className = "seat";
    seat.id = name;

    if (taken.includes(name)) {
      seat.className = "seat taken";
      seat.disabled = true;
    }

    seat.onclick = function () {
      // remove the old one first
      var old = document.querySelector(".picked");
      if (old) old.classList.remove("picked");

      this.classList.add("picked");
      mySeat = this.id;
      document.getElementById("seatText").innerText = "Seat " + mySeat + " looks good. Sign in to book it.";
    };

    row.appendChild(seat);
  }
  map.appendChild(row);
}

// switch between login, sign up and forgot password
var viewNames = ["loginView", "signupView", "forgotView"];

function showView(name) {
  for (var v = 0; v < viewNames.length; v++) {
    document.getElementById(viewNames[v]).classList.add("hidden");
  }
  document.getElementById(name).classList.remove("hidden");

  // tabs only light up for login / signup
  document.getElementById("tabLogin").classList.toggle("active", name == "loginView");
  document.getElementById("tabSignup").classList.toggle("active", name == "signupView");
}

function showSignup() {
  showView("signupView");
  document.getElementById("signError").className = "msg";
}

function showLogin() {
  showView("loginView");
}

function showForgot() {
  showView("forgotView");
  document.getElementById("forgotError").className = "msg";
  document.getElementById("step1").classList.remove("hidden");
  document.getElementById("step2").classList.add("hidden");
  document.getElementById("forgotSub").innerText = "No worries, we'll send you a code to reset it";
  // if they already typed their email, reuse it
  document.getElementById("fEmail").value = document.getElementById("email").value;
}

// look for a user (accounts from sign up first, then the demo ones)
function findUser(email) {
  for (var k = 0; k < savedUsers.length; k++) {
    if (savedUsers[k].email == email) return savedUsers[k];
  }
  for (var k = 0; k < users.length; k++) {
    if (users[k].email == email) return users[k];
  }
  return null;
}

// show / hide password
var passInput = document.getElementById("password");
document.getElementById("showBtn").onclick = function () {
  if (passInput.type == "password") {
    passInput.type = "text";
    this.innerText = "Hide";
  } else {
    passInput.type = "password";
    this.innerText = "Show";
  }
};

var errorBox = document.getElementById("error");
var btn = document.getElementById("loginBtn");

function showMsg(box, text, type) {
  box.innerText = text;
  box.className = "msg " + type;
}

// ---- LOGIN ----
function login() {
  errorBox.className = "msg";
  var email = document.getElementById("email").value.trim();
  var pass = passInput.value;

  if (email == "" || pass == "") {
    showMsg(errorBox, "Enter your email and password.", "bad");
    return;
  }
  if (!email.includes("@") || !email.includes(".")) {
    showMsg(errorBox, "That email doesn't look right.", "bad");
    return;
  }
  if (pass.length < 6) {
    showMsg(errorBox, "Password must be at least 6 characters.", "bad");
    return;
  }

  btn.disabled = true;
  btn.innerText = "Signing in...";

  // fake delay so it feels real
  setTimeout(function () {
    var found = findUser(email);
    var ok = found && found.password == pass;

    if (!ok) {
      showMsg(errorBox, "Wrong email or password. Try again.", "bad");
      btn.disabled = false;
      btn.innerText = "Sign in";
      return;
    }

    try {
      // var store = remember.checked ? localStorage : sessionStorage;
      var store = document.getElementById("remember").checked ? localStorage : sessionStorage;
      store.setItem("movieistad_user", JSON.stringify({ email: email, seat: mySeat }));
    } catch (e) {
      console.log("cant save", e);
    }

    console.log("logged in", email); // remove later
    // window.location.href = "/movies";   <-- use this on the real site
    btn.innerText = "Signed in";
    showMsg(errorBox, "You're in. On the real site this goes to /movies.", "good");
  }, 800);
}

btn.onclick = login;

// ---- SIGN UP ----
var signBox = document.getElementById("signError");

document.getElementById("signupBtn").onclick = function () {
  signBox.className = "msg";

  var name = document.getElementById("sName").value.trim();
  var email = document.getElementById("sEmail").value.trim();
  var pass = document.getElementById("sPass").value;
  var pass2 = document.getElementById("sPass2").value;

  if (name == "" || email == "" || pass == "" || pass2 == "") {
    showMsg(signBox, "Please fill in every field.", "bad");
    return;
  }
  if (!email.includes("@") || !email.includes(".")) {
    showMsg(signBox, "That email doesn't look right.", "bad");
    return;
  }
  if (pass.length < 6) {
    showMsg(signBox, "Password must be at least 6 characters.", "bad");
    return;
  }
  if (pass != pass2) {
    showMsg(signBox, "Passwords don't match.", "bad");
    return;
  }

  // check if the email is already used
  var everyone = users.concat(savedUsers);
  for (var k = 0; k < everyone.length; k++) {
    if (everyone[k].email == email) {
      showMsg(signBox, "That email already has an account. Try signing in.", "bad");
      return;
    }
  }

  savedUsers.push({ name: name, email: email, password: pass });
  try {
    localStorage.setItem("movieistad_users", JSON.stringify(savedUsers));
  } catch (e) {
    console.log("cant save", e);
  }

  // go back to login with the email already filled in
  showLogin();
  document.getElementById("email").value = email;
  passInput.value = "";
  showMsg(errorBox, "Account created. Sign in to continue.", "good");
};

// ---- FORGOT PASSWORD ----
var forgotBox = document.getElementById("forgotError");
var resetCode = "";
var resetEmail = "";

// step 1 - ask for the email
document.getElementById("sendBtn").onclick = function () {
  forgotBox.className = "msg";
  var email = document.getElementById("fEmail").value.trim();

  if (email == "") {
    showMsg(forgotBox, "Enter the email you signed up with.", "bad");
    return;
  }
  if (!email.includes("@") || !email.includes(".")) {
    showMsg(forgotBox, "That email doesn't look right.", "bad");
    return;
  }
  if (!findUser(email)) {
    showMsg(forgotBox, "We couldn't find an account with that email.", "bad");
    return;
  }

  // make a random 6 digit code
  resetCode = String(Math.floor(100000 + Math.random() * 900000));
  resetEmail = email;

  document.getElementById("step1").classList.add("hidden");
  document.getElementById("step2").classList.remove("hidden");
  document.getElementById("forgotSub").innerText = "We sent a code to " + email;
  // no real email yet so show the code here
  document.getElementById("demoBox").innerHTML = "Demo only, no real email is sent. Your code is <b>" + resetCode + "</b>";
};

// step 2 - code + new password
document.getElementById("resetBtn").onclick = function () {
  forgotBox.className = "msg";
  var code = document.getElementById("fCode").value.trim();
  var pass = document.getElementById("fPass").value;
  var pass2 = document.getElementById("fPass2").value;

  if (code == "" || pass == "" || pass2 == "") {
    showMsg(forgotBox, "Please fill in every field.", "bad");
    return;
  }
  if (code != resetCode) {
    showMsg(forgotBox, "That code is wrong. Check it and try again.", "bad");
    return;
  }
  if (pass.length < 6) {
    showMsg(forgotBox, "Password must be at least 6 characters.", "bad");
    return;
  }
  if (pass != pass2) {
    showMsg(forgotBox, "Passwords don't match.", "bad");
    return;
  }

  // remove the old saved one (if there is one) and save the new password
  savedUsers = savedUsers.filter(function (u) { return u.email != resetEmail; });
  savedUsers.push({ email: resetEmail, password: pass });
  try {
    localStorage.setItem("movieistad_users", JSON.stringify(savedUsers));
  } catch (e) {
    console.log("cant save", e);
  }

  resetCode = "";
  showLogin();
  document.getElementById("email").value = resetEmail;
  passInput.value = "";
  showMsg(errorBox, "Password updated. Sign in with your new password.", "good");
};

document.onkeydown = function (e) {
  if (e.key != "Enter") return;
  // only submit whichever form is showing
  if (!document.getElementById("loginView").classList.contains("hidden")) {
    login();
  } else if (!document.getElementById("signupView").classList.contains("hidden")) {
    document.getElementById("signupBtn").click();
  } else if (!document.getElementById("step1").classList.contains("hidden")) {
    document.getElementById("sendBtn").click();
  } else {
    document.getElementById("resetBtn").click();
  }
};
