let storedStok = sessionStorage.getItem("stok");
let bootstrapToast = null;
if (storedStok) {
  stok = JSON.parse(storedStok);
} else {
  // Gunakan nilai stok yang ditentukan secara manual
  stok = {
    Betadine: 0,
    Heparin: 0,
    Antasida: 0,
    Paracetamol: 0,
    "Zat Besi": 0,
    Sodium: 0,
    Amlodipin: 0,
    Adrenalin: 0,
    Painkiller: 0,
  };
}

let faktur = "";
let totalPurchaseAmount = 0;

let harga = {
  Betadine: 8500,
  Heparin: 8500,
  Antasida: 8500,
  Paracetamol: 12500,
  "Zat Besi": 12500,
  Sodium: 12500,
  Amlodipin: 12500,
  Adrenalin: 22500,
  Painkiller: 15000,
};

function hideAlert(alertDiv) {
  alertDiv.classList.add("alert-fadeOut"); // Menambahkan kelas CSS untuk animasi fadeOut
  setTimeout(function () {
    alertDiv.remove();
  }, 5000); // Menghilangkan alert setelah 0,5 detik (500 milidetik)
}

function updateStokTable() {
  let stockOpnameTable = document.getElementById("stockOpnameTable");
  let rows = stockOpnameTable.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    let obatCell = rows[i].getElementsByTagName("td")[0];
    let inputCell = rows[i].getElementsByTagName("td")[1];
    let obat = obatCell.textContent;

    if (stok[obat] >= 0) {
      inputCell.getElementsByTagName("input")[0].value = stok[obat];
    }
  }
  sessionStorage.setItem("stok", JSON.stringify(stok));
  setInterval(rekapObat, 1000);
}

function opname() {
  let stockOpnameTable = document.getElementById("stockOpnameTable");
  let rows = stockOpnameTable.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    let obatCell = rows[i].getElementsByTagName("td")[0];
    let inputCell = rows[i].getElementsByTagName("td")[1];
    let obat = obatCell.textContent;
    let jumlah = parseInt(inputCell.getElementsByTagName("input")[0].value);

    if (!isNaN(jumlah) && jumlah >= 0) {
      stok[obat] = jumlah;
    }
  }
  showToast("Berhasil mengupdate stock obat!", "success");
  updateStokTable();
  //   resetInputValues();
}
function extractMedicineName(line) {
  let regex = /\d+\s+(.*?)\s+\(\d+\)/;
  let match = line.match(regex);
  if (match && match.length > 1) {
    return match[1].trim();
  }
  return "";
}
function showProgressBarAlert() {
  let alertContainer = document.getElementById("alertContainer");
  let progressBar = document.getElementById("progressBar");

  // Reset progress bar
  progressBar.style.width = "0%";
  progressBar.setAttribute("aria-valuenow", "0");

  if (alertContainer) {
    let toast = new bootstrap.Toast(alertContainer);
    toast.show();
    startProgressBar();
  }
}

function startProgressBar() {
  let progressBar = document.getElementById("progressBar");
  let width = 0;
  let intervalId = setInterval(frame, 10);

  function frame() {
    if (width >= 100) {
      clearInterval(intervalId);
    } else {
      width++;
      progressBar.style.width = width + "%";
      progressBar.setAttribute("aria-valuenow", width);
    }
  }
}

function removeToast() {
    let toastElement = document.getElementById("toastPlacement");
    if (toastElement) {
      toastElement.remove();
    }
  }

function showToast(message, type) {
    
  let previousToast = document.querySelector(".toast");
  if (previousToast) {
    previousToast.remove();
  }
  let toastContainer = document.createElement("div");
  toastContainer.className =
    "toast-container animate position-fixed p-3 bottom-0 end-0";
  toastContainer.setAttribute("id", "toastPlacement");
  toastContainer.setAttribute(
    "data-original-class",
    "toast-container position-fixed p-3"
  );

  let toast = document.createElement("div");
  toast.className = "toast";
  toast.role = "alert";
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");
  toast.setAttribute("data-bs-delay", "7000");

  let toastHeader = document.createElement("div");
  toastHeader.className = `toast-header bg-${type}`;

  let icon = document.createElement("i");
  icon.className = "fa-solid fa-bread-slice me-2 fa-shake";

  let strong = document.createElement("strong");
  strong.className = "me-auto";
  strong.innerText = "Pesan";

  let small = document.createElement("small");
  small.className = "me-1";
  small.innerText = getCurrentDateTime();

  let progressBarNumber = document.createElement("span");
  progressBarNumber.className = "progressbar-number";

  let button = document.createElement("button");
  button.type = "button";
  button.className = "btn-close";
  button.setAttribute("data-bs-dismiss", "toast");
  button.setAttribute("aria-label", "Close");

  let toastBody = document.createElement("div");
  toastBody.className = "toast-body";
  toastBody.innerText = message;

  let progress = document.createElement("div");
  progress.className = "progress";
  progress.style.height = "3px";

  let progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  progressBar.setAttribute("role", "progressbar");

  if (type === "success") {
    toastHeader.style.color = "white";
    progressBar.style.backgroundColor = "green";
  } else if (type === "warning") {
    progressBar.style.backgroundColor = "yellow";
  } else if (type === "danger") {
    toastHeader.style.color = "white";
    progressBar.style.backgroundColor = "red";
  } else if (type === "info") {
    toastHeader.style.color = "white";
    progressBar.style.backgroundColor = "blue";
  }

  progressBar.style.width = "0%";
  progressBar.setAttribute("aria-valuenow", "0");
  progressBar.setAttribute("aria-valuemin", "0");
  progressBar.setAttribute("aria-valuemax", "100");

  toastHeader.appendChild(icon);
  toastHeader.appendChild(strong);
  toastHeader.appendChild(small);
  toastHeader.appendChild(progressBarNumber);
  toastHeader.appendChild(button);

  progress.appendChild(progressBar);

  toastBody.appendChild(progress);

  toast.appendChild(toastHeader);
  toast.appendChild(toastBody);

  toastContainer.appendChild(toast);

  document.body.appendChild(toastContainer);

  bootstrapToast = new bootstrap.Toast(toast);
  bootstrapToast.show();

  let width = 0;
  let progressInterval = setInterval(frame, 80); // Sesuaikan dengan kecepatan animasi yang diinginkan
  bootstrapToast._element.addEventListener("hidden.bs.toast", removeToast);
  function frame() {
    if (width >= 100) {
      clearInterval(progressInterval);
      bootstrapToast.hide();
    } else {
      width++;
      progressBar.style.width = width + "%";
      // progressBarNumber.innerText = width + "%";
    }
  }
}

function batalBeliObat() {
  if (faktur.length === 0) {
    showToast("Belum ada obat yang dibeli!", "warning");
    return;
  }

  // Mendapatkan obat terakhir dari faktur
  let lastObatIndex = faktur.lastIndexOf("-");
  let lastObat = faktur.slice(lastObatIndex + 1).trim();

  // Extracting the medicine name from lastObat
  let obatParts = lastObat.split(" ");
  let obatName = obatParts.slice(1, obatParts.length - 1).join(" ");

  // Mengecek apakah obat terakhir ada dalam stok
  if (stok.hasOwnProperty(obatName)) {
    stok[obatName]++;
    faktur = faktur.slice(0, lastObatIndex);

    // Update total purchase amount
    let totalPurchaseAmount1 = 0;
    let fakturLines = faktur.split("\n");
    for (let i = 0; i < fakturLines.length; i++) {
      let line = fakturLines[i].trim();
      if (line !== "") {
        let quantity = parseInt(line.split(" ")[1]);
        let obat = extractMedicineName(line);
        totalPurchaseAmount1 += quantity * harga[obat];
      }
    }

    document.getElementById("faktur").textContent = "```\n" + faktur + "```";
    // document.getElementById("totalAmountValue").textContent =
    //   totalPurchaseAmount.toLocaleString();

    // Perbarui jumlah stok pada tabel
    let stockOpnameTable = document.getElementById("stockOpnameTable");
    let rows = stockOpnameTable.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
      let obatCell = rows[i].getElementsByTagName("td")[0];
      let inputCell = rows[i].getElementsByTagName("td")[1];
      let obatCellText = obatCell.textContent.trim();

      // Extracting the medicine name from obatCellText
      let obatParts = obatCellText.split(" ");
      let obatCellName = obatParts.slice(0, obatParts.length).join(" ");
      if (obatCellName === obatName) {
        let jumlahInput = inputCell.querySelector("input");
        jumlahInput.value = stok[obatName];
        break;
      }
      if (fakturLines.length === 1) {
        clearFaktur();
      }
    }
    totalPurchaseAmount = totalPurchaseAmount1;
    showToast("Berhasil membatalkan!", "info");
    sessionStorage.setItem("stok", JSON.stringify(stok));
  } else {
    console.log("Error: Obat not found in stock.");
  }
}

function beliObat(obat) {
  if (stok[obat] > 0) {
    stok[obat]--;
    faktur += "- 1 " + obat + " (" + stok[obat] + ")\n";

    // Update total purchase amount
    let totalPurchaseAmount1 = 0;
    let fakturLines = faktur.split("\n");
    for (let i = 0; i < fakturLines.length; i++) {
      let line = fakturLines[i].trim();
      if (line !== "") {
        let quantity = parseInt(line.split(" ")[1]);
        let obat = extractMedicineName(line);
        totalPurchaseAmount1 += quantity * harga[obat];
      }
    }

    document.getElementById("faktur").textContent = "```\n" + faktur + "```";
    // document.getElementById("totalAmountValue").textContent =
    //   totalPurchaseAmount.toLocaleString();

    // Perbarui jumlah stok pada tabel
    let stockOpnameTable = document.getElementById("stockOpnameTable");
    let rows = stockOpnameTable.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
      let obatCell = rows[i].getElementsByTagName("td")[0];
      let inputCell = rows[i].getElementsByTagName("td")[1];
      let obatName = obatCell.textContent;

      if (obatName === obat) {
        let jumlahInput = inputCell.getElementsByTagName("input")[0];
        jumlahInput.value = stok[obat];
        break;
      }
    }
    sessionStorage.setItem("stok", JSON.stringify(stok));
    showToast("Sukses membeli obat " + obat, "success");
    totalPurchaseAmount = totalPurchaseAmount1;
  } else {
    showToast("Stock Obat " + obat + " habis!", "danger");
    // let alertDiv = document.createElement("div");
    // alertDiv.classList.add("alert", "alert-danger", "alert-fadeIn"); // Menambahkan kelas CSS untuk animasi fadeIn
    // alertDiv.textContent = "Stok obat " + obat + " habis";
    // document.getElementById("jualBeliObat").appendChild(alertDiv);

    // hideAlert(alertDiv);
  }
}
function clearFaktur() {
  faktur = "";
  document.getElementById("faktur").textContent = "";
  document.getElementById("totalAmountValue").textContent =
    totalPurchaseAmount.toLocaleString(); // Perbarui tampilan total harga
  showToast("Berhasil menghapus nota!", "success");
}
function copyFaktur() {
  let fakturText = "```\n" + faktur + "```";
  navigator.clipboard
    .writeText(fakturText)
    .then(() => {
      showToast("Nota berhasil disalin!", "success");
    })
    .catch((error) => {
      alert("Terjadi kesalahan saat menyalin faktur obat: " + error);
    });
}

function refreshHarga() {
  totalPurchaseAmount = 0;
  document.getElementById("faktur").textContent = "";
  document.getElementById("totalAmountValue").textContent =
    totalPurchaseAmount.toLocaleString(); // Perbarui tampilan total harga
  showToast("Berhasil menghapus nota!", "success");
}

function rekapObat() {
  let rekap = "";
  let trekap = "REKAP OBAT FARMASI - " + getCurrentDateTime();
  let stokData = JSON.parse(sessionStorage.getItem("stok")); // Mengambil data stok
  // Menentukan panjang maksimum teks obat
  let maxObatLength = 0;
  for (let obat in stokData) {
    maxObatLength = Math.max(maxObatLength, obat.length);
  }

  // Membuat rekap dengan indent yang rapi
  for (let obat in stokData) {
    let obatName = obat.padEnd(maxObatLength + 5);
    rekap += obatName + ": " + stok[obat] + "\n";
  }

  document.getElementById("rekap").textContent =
    "***" + trekap + "***\n" + "```\n" + rekap + "```";
}

function copyRekap() {
  rekapObat();
  let rekapText = document.getElementById("rekap").textContent;
  navigator.clipboard
    .writeText(rekapText)
    .then(() => {
      showToast("Rekap berhasil disalin!", "info");
    })
    .catch((error) => {
      alert("Terjadi kesalahan saat menyalin rekap obat: " + error);
    });
}

function resetInputValues() {
  let stockOpnameTable = document.getElementById("stockOpnameTable");
  let rows = stockOpnameTable.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    let inputCell = rows[i].getElementsByTagName("td")[1];
    inputCell.getElementsByTagName("input")[0].value = "";
  }
}

function getCurrentDateTime() {
  let now = new Date();
  let date = now.getDate();
  let month = now.getMonth() + 1;
  let year = now.getFullYear();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  let formattedDate =
    padZero(hours) +
    ":" +
    padZero(minutes) +
    " - " +
    padZero(date) +
    "/" +
    padZero(month) +
    "/" +
    year;

  return formattedDate;
}

function padZero(value) {
  return value < 10 ? "0" + value : value;
}

$(document).ready(function () {
  updateStokTable();
});
