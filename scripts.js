function displayDate() {
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  document.getElementById("dateDisplay").innerText = "Today Date: " + today.toLocaleDateString("en-US", options);
  }

function checkPasswordMatch() {
  const pw = document.getElementById("password").value;
  const repw = document.getElementById("repassword").value;
  if (pw !== repw) {
    alert("Passwords do not match.");
  }
}

function updateSliderValue() {
  const slider = document.getElementById("health");
  const output = document.getElementById("healthValue");
  output.textContent = slider.value;
}

function truncateZip() {
  const zip = document.getElementById("zip");
  zip.value = zip.value.substring(0, 5);
}

function lowercaseUserID() {
  const userid = document.getElementById("userid");
  userid.value = userid.value.toLowerCase();
}

function reviewForm() {
  const fields = [
    "userid", "fname", "mi", "lname", "dob", "email", "phone",
    "addr1", "addr2", "city", "state", "zip", "gender", "race", "insurance"
  ];
  let output = "<h3>PLEASE REVIEW THIS INFORMATION</h3><ul>";
  fields.forEach(id => {
    const el = document.getElementById(id);
    let val = el?.value || document.querySelector(`input[name="${id}"]:checked`)?.value || "";
    output += `<li><strong>${id}:</strong> ${val}</li>`;
  });
  output += "</ul>";
  document.getElementById("reviewArea").innerHTML = output;
}

function validatePasswordStrength() {
  const pw = document.getElementById("password").value;
  const length = pw.length >= 8;
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasSpecial = /[!@#%^&*()\-_=+\\/><.,`~]/.test(pw);
  toggleRequirement("length", length);
  toggleRequirement("uppercase", hasUpper);
  toggleRequirement("lowercase", hasLower);
  toggleRequirement("special", hasSpecial);
}

function toggleRequirement(id, isValid) {
  const item = document.getElementById(id);
  item.style.color = isValid ? "green" : "red";
}

function validateDateRange(id, type) {
  const input = document.getElementById(id);
  const date = new Date(input.value);
  const today = new Date();
  const oldest = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
  if (type === "dob" && (date > today || date < oldest)) {
    alert("Date of birth must be within the last 120 years and not in the future.");
  }
  if (type === "future" && date < today) {
    alert("This date must be in the future.");
  }
}

