let stok = {
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

  function opname() {
    let stockOpnameTable = document.getElementById("stockOpnameTable");
    let rows = stockOpnameTable.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
      let obatCell = rows[i].getElementsByTagName("td")[0];
      let inputCell = rows[i].getElementsByTagName("td")[1];
      let obat = obatCell.textContent;
      let jumlah = parseInt(
        inputCell.getElementsByTagName("input")[0].value
      );

      if (!isNaN(jumlah) && jumlah >= 0) {
        stok[obat] = jumlah;
      }
    }

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

  function batalBeliObat() {
    if (faktur.length === 0) {
      alert("Belum ada obat yang dibeli");
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
      let totalPurchaseAmount = 0;
      let fakturLines = faktur.split("\n");
      for (let i = 0; i < fakturLines.length; i++) {
        let line = fakturLines[i].trim();
        if (line !== "") {
          let quantity = parseInt(line.split(" ")[1]);
          let obat = extractMedicineName(line);
          totalPurchaseAmount += quantity * harga[obat];
        }
      }

      document.getElementById("faktur").textContent =
        "```\n" + faktur + "```";
      document.getElementById("totalAmountValue").textContent =
        totalPurchaseAmount.toLocaleString();

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
    } else {
      console.log("Error: Obat not found in stock.");
    }
  }

  function beliObat(obat) {
    if (stok[obat] > 0) {
      stok[obat]--;
      faktur += "- 1 " + obat + " (" + stok[obat] + ")\n";

      // Update total purchase amount
      let totalPurchaseAmount = 0;
      let fakturLines = faktur.split("\n");
      for (let i = 0; i < fakturLines.length; i++) {
        let line = fakturLines[i].trim();
        if (line !== "") {
          let quantity = parseInt(line.split(" ")[1]);
          let obat = extractMedicineName(line);
          totalPurchaseAmount += quantity * harga[obat];
        }
      }

      document.getElementById("faktur").textContent =
        "```\n" + faktur + "```";
      document.getElementById("totalAmountValue").textContent =
        totalPurchaseAmount.toLocaleString();

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
    } else {
      let alertDiv = document.createElement("div");
      alertDiv.classList.add("alert", "alert-danger", "alert-fadeIn"); // Menambahkan kelas CSS untuk animasi fadeIn
      alertDiv.textContent = "Stok obat " + obat + " habis";
      document.getElementById("jualBeliObat").appendChild(alertDiv);

      hideAlert(alertDiv);
    }
  }

  function copyFaktur() {
    let fakturText = "```\n" + faktur + "```";
    navigator.clipboard
      .writeText(fakturText)
      .then(() => {
        alert("Faktur obat berhasil disalin!");
      })
      .catch((error) => {
        alert("Terjadi kesalahan saat menyalin faktur obat: " + error);
      });
  }

  function clearFaktur() {
    faktur = "";
    totalPurchaseAmount = 0; // Reset totalPurchaseAmount ke 0
    document.getElementById("faktur").textContent = "";
    document.getElementById("totalAmountValue").textContent =
      totalPurchaseAmount.toLocaleString(); // Perbarui tampilan total harga
  }

  function rekapObat() {
    let rekap = "";
    let trekap = "REKAP OBAT FARMASI - " + getCurrentDateTime();

    // Menentukan panjang maksimum teks obat
    let maxObatLength = 0;
    for (let obat in stok) {
      maxObatLength = Math.max(maxObatLength, obat.length);
    }

    // Membuat rekap dengan indent yang rapi
    for (let obat in stok) {
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
        alert("Rekap obat berhasil disalin!");
      })
      .catch((error) => {
        alert("Terjadi kesalahan saat menyalin rekap obat: " + error);
      });
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
    setInterval(rekapObat, 1000);
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
