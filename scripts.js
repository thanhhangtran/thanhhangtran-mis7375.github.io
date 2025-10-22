function displayDate() {
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  document.getElementById("dateDisplay").innerText = "Today Date: " + today.toLocaleDateString("en-US", options);
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

function checkPasswordMatch() {
  const pw = document.getElementById("password").value;
  const repw = document.getElementById("repassword").value;
  if (pw !== repw) {
    alert("Passwords do not match.");
  }
}

function truncateZip() {
  const zip = document.getElementById("zip");
  zip.value = zip.value.substring(0, 5);
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
  document.getElementById("reviewArea").innerHTML = output;
}
