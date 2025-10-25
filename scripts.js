// Program name: patient-form.html
// Author: Thanh Tran
// Date created: Oct 6, 2025
// Date last edited: Oct 24, 2025
// Version: 1.0
// Description: External javascript sheet for index.html

function displayDate() {
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  document.getElementById("dateDisplay").innerText = "Today Date: " + today.toLocaleDateString("en-US", options);
  applyPatternValidation();
  setDOBRange();
  validateDOBOnBlur();
  formatSSN();
  formatPhone();
  updateSliderValue();
  document.querySelector("form").addEventListener("reset", clearReviewTable);
  document.getElementById("medications").addEventListener("blur", function () {
    if (/["]/.test(this.value)) {
      this.setCustomValidity("Please avoid using double quotes.");
      this.reportValidity();
    } else {
      this.setCustomValidity("");
    }
  });
}

function lowercaseUserID() {
  const userid = document.getElementById("userid");
  userid.value = userid.value.toLowerCase();
}

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
    zip: "\\d{5}(-\\d{4})?",
    userid: "^[A-Za-z][A-Za-z0-9_-]{4,29}$",
    password: "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#%^&*()\\-_=+\\\\/><.,`~])[A-Za-z\\d!@#%^&*()\\-_=+\\\\/><.,`~]{8,30}"
  };
  for (const [id, pattern] of Object.entries(patterns)) {
    const el = document.getElementById(id);
    if (el) {
      el.setAttribute("pattern", pattern);
    }
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
  } else {
    document.getElementById("password").setCustomValidity("");
  }
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
  for (const name of groups) {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    const firstRadio = radios[0];
    if (!selected) {
      firstRadio.setCustomValidity("Please select one option.");
      firstRadio.reportValidity();
      return false;
    } else {
      firstRadio.setCustomValidity("");
    }
  }
  return true;
}

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

function confirmBeforeSubmit(e) {
  e.preventDefault();
  if (!document.querySelector("form").checkValidity()) {
    document.querySelector("form").reportValidity();
    return;
  }
  if (!validateRadioGroups()) return;
  lowercaseUserID();
  reviewForm();
  const reviewBox = document.getElementById("reviewArea");
  if (!document.getElementById("confirmButton")) {
    const confirmBtn = document.createElement("button");
    confirmBtn.id = "confirmButton";
    confirmBtn.textContent = "Confirm and Submit";
    confirmBtn.style.marginTop = "20px";
    confirmBtn.onclick = () => {
      document.querySelector("form").submit();
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
