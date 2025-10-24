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
  updateSliderValue();
  applyPatternValidation();
  setDOBRange();
  validateDOBOnBlur();
  }

function lowercaseUserID() {
  const userid = document.getElementById("userid");
  userid.value = userid.value.toLowerCase();
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

function truncateZip() {
  const zip = document.getElementById("zip");
  const match = zip.value.match(/^(\d{5})/);
  zip.value = match ? match[1] : "";
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
  const reviewBox = document.getElementById("reviewArea");
  reviewBox.innerHTML = output;
  reviewBox.classList.remove("hidden");
}
