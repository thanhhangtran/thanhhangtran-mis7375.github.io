// Program name: patient-form.html
// Author: Thanh Tran
// Date created: Oct 6, 2025
// Date last edited: Dec 6, 2025
// Version: 3.0
// Description: External javascript sheet for index.html

function updateDateTime() {
  const now = new Date();
  const options = { 
    weekday: 'long', year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit' 
  };
  document.getElementById("dateDisplay").innerText =
    "Today Date: " + now.toLocaleString("en-US", options);
}

function displayDate() {
  updateDateTime();
  setInterval(updateDateTime, 1000);
  applyPatternValidation();
  setDOBRange();
  validateDOBOnBlur();
  formatSSN();
  formatPhone();
  updateSliderValue();
  loadStates();
  document.querySelector("form").addEventListener("reset", clearReviewTable);
  document.getElementById("medications").addEventListener("blur", function () {
    if (/["]/.test(this.value)) {
      this.setCustomValidity("Please avoid using double quotes.");
      this.reportValidity();
    } else {
      this.setCustomValidity("");
    }
  });
  const savedName = getCookie("fname");
  const greetingDiv = document.getElementById("greeting");
  const fnameField = document.getElementById("fname");
  if (savedName) {
    const message = "Welcome back " + savedName +
      ".\nPress OK to confirm or Cancel if this isn't " + savedName + ".";
    if (confirm(message)) {
      if (fnameField) fnameField.value = savedName;
      greetingDiv.innerHTML = "Hello " + savedName + ", welcome back!";
      nonSecureFields.forEach(id => {
        const el = document.getElementById(id);
        const val = localStorage.getItem(id);
        if (el && val) el.value = val;
      });
      ["gender","race","insurance"].forEach(name => {
        const val = localStorage.getItem(name);
        if (val) {
          const radio = document.querySelector(`input[name="${name}"][value="${val}"]`);
          if (radio) radio.checked = true;
        }
      });
    } else {
      deleteCookie("fname");
      localStorage.clear();
      greetingDiv.innerHTML = "Hello New User!";
    }
  } else {
    greetingDiv.innerHTML = "Hello New User!";
  }
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

document.getElementById("fname").addEventListener("blur", function() {
  const fname = this.value.trim();
  const rememberMe = document.getElementById("rememberMe").checked;
  if (rememberMe && fname.length >= 2) {
    setCookie("fname", fname, 2);
  } else {
    deleteCookie("fname");
  }
});

document.getElementById("rememberMe").addEventListener("change", function() {
  if (!this.checked) {
    deleteCookie("fname");
  }
});

const nonSecureFields = [
  "userid","fname","mi","lname","dob","email","phone",
  "addr1","addr2","city","state","zip","gender","race","insurance","diagnosis-other","medications","health"
];

nonSecureFields.forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("blur", () => {
      localStorage.setItem(id, el.value);
    });
  }
});

["gender","race","insurance","diagnosis"].forEach(name => {
  document.querySelectorAll(`input[name="${name}"]`).forEach(el => {
    el.addEventListener("change", () => {
      localStorage.setItem(name, el.value);
    });
  });
});

function applyPatternValidation() {
  const patterns = {
    fname: "[A-Za-z'-]{1,30}",
    mi: "[A-Za-z]{1}",
    lname: "[A-Za-z'\\-0-9]{1,30}",
    ssn: "\\d{3}-\\d{2}-\\d{4}",
    email: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    phone: "\\d{3}-\\d{3}-\\d{4}",
    addr1: ".{2,30}",
    addr2: ".{2,30}",
    city: ".{2,30}",
    zip: "\\d{5}",
    userid: "^[A-Za-z][A-Za-z0-9_-]{4,19}$",
    password: "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#%^&*()\\-_=+\\\\/><.,`~])[A-Za-z\\d!@#%^&*()\\-_=+\\\\/><.,`~]{8,30}"
  };
  for (const [id, pattern] of Object.entries(patterns)) {
    const el = document.getElementById(id);
    if (el) {
      el.setAttribute("pattern", pattern);
    }
  }
}

function lowercaseUserID() {
  const userid = document.getElementById("userid");
  userid.value = userid.value.toLowerCase();
}

function validateUserID() {
  const input = document.getElementById("userid");
  const regex = /^[A-Za-z][A-Za-z0-9_-]{4,19}$/;
  if (!regex.test(input.value)) {
    input.setCustomValidity("User ID must start with a letter and be 5–20 characters. Only letters, numbers, dash, and underscore allowed.");
    input.reportValidity();
    return false;
  } else {
    input.setCustomValidity("");
    return true;
  }
}

function validatePasswordStrength() {
  const pw = document.getElementById("password").value;
  const userid = document.getElementById("userid")?.value.toLowerCase();
  const fname = document.getElementById("fname")?.value.toLowerCase();
  const lname = document.getElementById("lname")?.value.toLowerCase();
  const pwLower = pw.toLowerCase();
  const length = pw.length >= 8;
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasSpecial = /[!@#%^&*()\-_=+\\/><.,`~]/.test(pw);
  toggleRequirement("length", length);
  toggleRequirement("uppercase", hasUpper);
  toggleRequirement("lowercase", hasLower);
  toggleRequirement("special", hasSpecial);
  const containsPersonalInfo =
    (userid && pwLower.includes(userid)) ||
    (fname && pwLower.includes(fname)) ||
    (lname && pwLower.includes(lname));
  if (containsPersonalInfo) {
    document.getElementById("password").setCustomValidity("Password cannot contain your username or name.");
    document.getElementById("password").reportValidity();
    return false;
  }
  if (userid && pwLower === userid) {
    document.getElementById("password").setCustomValidity("Password cannot be the same as your User ID.");
    document.getElementById("password").reportValidity();
    return false;
  }
  document.getElementById("password").setCustomValidity("");
  return true;

}

function toggleRequirement(id, isValid) {
  const item = document.getElementById(id);
  item.style.color = isValid ? "green" : "red";
}

function checkPasswordMatch() {
  const pw = document.getElementById("password").value;
  const repw = document.getElementById("repassword").value;
  const message = document.getElementById("matchMessage");
  if (repw === "") {
    message.textContent = "";
    return;
  }
  if (pw === repw) {
    message.textContent = "Passwords match.";
    message.style.color = "green";
  } else {
    message.textContent = "Passwords do not match.";
    message.style.color = "red";
  }
}

function setDOBRange() {
  const dob = document.getElementById("dob");
  const today = new Date();
  const maxDate = today.toISOString().split("T")[0];
  const minDateObj = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
  const minDate = minDateObj.toISOString().split("T")[0];
  dob.setAttribute("max", maxDate);
  dob.setAttribute("min", minDate);
}

function validateDOBOnBlur() {
  const dobField = document.getElementById("dob");
  dobField.addEventListener("blur", function () {
    const enteredDate = new Date(this.value);
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
    const maxDate = today;
    if (enteredDate < minDate || enteredDate > maxDate) {
      this.setCustomValidity("Date of birth must be between 120 years ago and today.");
      this.reportValidity();
    } else {
      this.setCustomValidity("");
    }
  });
}

function formatSSN() {
  const ssnField = document.getElementById("ssn");
  ssnField.addEventListener("input", function () {
    let digits = this.value.replace(/\D/g, "");
    if (digits.length > 9) digits = digits.slice(0, 9);
    let formatted = "";
    if (digits.length > 5) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
    } else if (digits.length > 3) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
      formatted = digits;
    }
    this.value = formatted;
  });
}

async function loadStates() {
  try {
    const response = await fetch("states.html");
    if (!response.ok) throw new Error("Network error");
    const data = await response.text();
    document.getElementById("state").innerHTML = data;
  } catch (err) {
    console.error("Failed to load states:", err);
  }
}

function truncateZip() {
  const zip = document.getElementById("zip");
  const match = zip.value.match(/^(\d{5})/);
  zip.value = match ? match[1] : "";
}

function formatPhone() {
  const phoneField = document.getElementById("phone");
  phoneField.addEventListener("input", function () {
    let digits = this.value.replace(/\D/g, "");
    if (digits.length > 10) digits = digits.slice(0, 10);
    let formatted = "";
    if (digits.length > 6) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length > 3) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
      formatted = digits;
    }
    this.value = formatted;
  });
}

document.getElementById("email").addEventListener("blur", function () {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!pattern.test(this.value)) {
    this.setCustomValidity("Please enter a valid email address with a dot and domain.");
    this.reportValidity();
  } else {
    this.setCustomValidity("");
  }
});

function validateRadioGroups() {
  const groups = ["gender", "race", "insurance"];
  let allValid = true;
  for (const name of groups) {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    const firstRadio = radios[0];
    if (!selected) {
      firstRadio.setCustomValidity("Please select one option.");
      allValid = false;
    } else {
      firstRadio.setCustomValidity("");
    }
  }
  return allValid;
}

["gender", "race", "insurance"].forEach(name => {
  document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
    radio.addEventListener("change", validateRadioGroups);
  });
});

function updateSliderValue() {
  const slider = document.getElementById("health");
  const valueLabel = document.getElementById("healthValue");
  const min = parseInt(slider.min);
  const max = parseInt(slider.max);
  const val = parseInt(slider.value);
  valueLabel.textContent = val;
  const percent = (val - min) / (max - min);
  const sliderWidth = slider.offsetWidth;
  const thumbOffset = percent * sliderWidth;
  valueLabel.style.left = `${thumbOffset}px`;
}

function validateForm() {
  let valid = true;
  if (!validateUserID()) valid = false;
  if (!validatePasswordStrength()) valid = false;
  const pw = document.getElementById("password").value;
  const repw = document.getElementById("repassword").value;
  if (pw !== repw) {
    const repwField = document.getElementById("repassword");
    repwField.setCustomValidity("Passwords do not match.");
    repwField.reportValidity();
    valid = false;
  } else {
    document.getElementById("repassword").setCustomValidity("");
  }
  const fname = document.getElementById("fname");
  if (!/^[A-Za-z'-]{1,30}$/.test(fname.value)) {
    fname.setCustomValidity("First name must be 1–30 letters, apostrophes, or dashes.");
    fname.reportValidity();
    valid = false;
  } else {
    fname.setCustomValidity("");
  }
  const mi = document.getElementById("mi");
  if (mi.value && !/^[A-Za-z]$/.test(mi.value)) {
    mi.setCustomValidity("Middle initial must be a single letter.");
    mi.reportValidity();
    valid = false;
  } else {
    mi.setCustomValidity("");
  }
  const lname = document.getElementById("lname");
  if (!/^[A-Za-z'\-0-9]{1,30}$/.test(lname.value)) {
    lname.setCustomValidity("Last name must be 1–30 characters (letters, numbers, apostrophes, dashes).");
    lname.reportValidity();
    valid = false;
  } else {
    lname.setCustomValidity("");
  }
  const ssn = document.getElementById("ssn");
  if (!/^\d{3}-\d{2}-\d{4}$/.test(ssn.value)) {
    ssn.setCustomValidity("SSN must be in the format XXX-XX-XXXX.");
    ssn.reportValidity();
    valid = false;
  } else {
    ssn.setCustomValidity("");
  }
  const zip = document.getElementById("zip");
  if (!/^\d{5}$/.test(zip.value)) {
    zip.setCustomValidity("ZIP code must be exactly 5 digits.");
    zip.reportValidity();
    valid = false;
  } else {
    zip.setCustomValidity("");
  }
  const phone = document.getElementById("phone");
  if (!/^\d{3}-\d{3}-\d{4}$/.test(phone.value)) {
    phone.setCustomValidity("Phone must be in the format 000-000-0000.");
    phone.reportValidity();
    valid = false;
  } else {
    phone.setCustomValidity("");
  }
  const dob = document.getElementById("dob");
  if (dob.value) {
    const enteredDate = new Date(dob.value);
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
    if (enteredDate < minDate || enteredDate > today) {
      dob.setCustomValidity("Date of birth must be between 120 years ago and today.");
      dob.reportValidity();
      valid = false;
    } else {
      dob.setCustomValidity("");
    }
  }
  const email = document.getElementById("email");
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email.value)) {
    email.setCustomValidity("Please enter a valid email address with a dot and domain.");
    email.reportValidity();
    valid = false;
  } else {
    email.setCustomValidity("");
  }
  if (!validateRadioGroups()) valid = false;
  return valid;
}

function confirmBeforeSubmit(e) {
  e.preventDefault();
  const form = document.querySelector("form");
  if (!validateForm() || !form.checkValidity()) {
    form.reportValidity();
    return;
  }
  lowercaseUserID();
  reviewForm();
  const reviewBox = document.getElementById("reviewArea");
  if (!document.getElementById("confirmButton")) {
    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.id = "confirmButton";
    confirmBtn.textContent = "Confirm and Submit";
    confirmBtn.style.marginTop = "20px";
    confirmBtn.onclick = () => {
      form.submit();
    };
    reviewBox.appendChild(confirmBtn);
  }
}

function reviewForm() {
  const textFields = [
    "userid", "fname", "mi", "lname", "dob", "email", "phone",
    "addr1", "addr2", "city", "state", "zip"
  ];
  const radioGroups = ["gender", "race", "insurance"];
  let output = "<h3>PLEASE REVIEW THIS INFORMATION</h3><table><thead><tr><th>Data Name</th><th>Value</th></tr></thead><tbody>";
  textFields.forEach(id => {
    const el = document.getElementById(id);
    output += `<tr><td>${id}</td><td>${el?.value || ""}</td></tr>`;
  });
  radioGroups.forEach(name => {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    output += `<tr><td>${name}</td><td>${selected?.value || "Not selected"}</td></tr>`;
  });
  const diagnoses = Array.from(document.querySelectorAll('input[name="diagnosis"]:checked'))
    .map(el => el.value)
    .join(", ");
  output += `<tr><td>diagnosis</td><td>${diagnoses || "None selected"}</td></tr>`;
  const otherDiagnosis = document.getElementById("diagnosis-other")?.value || "";
  output += `<tr><td>diagnosis-other</td><td>${otherDiagnosis || "None"}</td></tr>`;
  const meds = document.getElementById("medications")?.value || "";
  output += `<tr><td>medications</td><td>${meds || "None listed"}</td></tr>`;
  const health = document.getElementById("health")?.value || "";
  output += `<tr><td>healthValue</td><td>${health}</td></tr>`;
  output += "</tbody></table>";
  const reviewBox = document.getElementById("reviewArea");
  reviewBox.innerHTML = output;
  reviewBox.classList.remove("hidden");
}

function clearReviewTable() {
  const reviewBox = document.getElementById("reviewArea");
  reviewBox.innerHTML = "";
  reviewBox.classList.add("hidden");
  const confirmBtn = document.getElementById("confirmButton");
  if (confirmBtn) confirmBtn.remove();
}
