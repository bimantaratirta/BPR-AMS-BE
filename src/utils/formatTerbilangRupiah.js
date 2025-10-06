function formatRupiah(angka) {
  return "Rp. " + angka.toLocaleString("id-ID") + ",-";
}

// Ubah angka ke huruf (terbilang manual)
function angkaKeTerbilang(angka) {
  const satuan = [
    "",
    "Satu",
    "Dua",
    "Tiga",
    "Empat",
    "Lima",
    "Enam",
    "Tujuh",
    "Delapan",
    "Sembilan",
    "Sepuluh",
    "Sebelas",
  ];

  if (angka < 12) return satuan[angka];
  if (angka < 20) return angkaKeTerbilang(angka - 10) + " Belas";
  if (angka < 100)
    return (
      angkaKeTerbilang(Math.floor(angka / 10)) +
      " Puluh " +
      angkaKeTerbilang(angka % 10)
    );
  if (angka < 200) return "Seratus " + angkaKeTerbilang(angka - 100);
  if (angka < 1000)
    return (
      angkaKeTerbilang(Math.floor(angka / 100)) +
      " Ratus " +
      angkaKeTerbilang(angka % 100)
    );
  if (angka < 2000) return "Seribu " + angkaKeTerbilang(angka - 1000);
  if (angka < 1000000)
    return (
      angkaKeTerbilang(Math.floor(angka / 1000)) +
      " Ribu " +
      angkaKeTerbilang(angka % 1000)
    );
  if (angka < 1000000000)
    return (
      angkaKeTerbilang(Math.floor(angka / 1000000)) +
      " Juta " +
      angkaKeTerbilang(angka % 1000000)
    );
  if (angka < 1000000000000)
    return (
      angkaKeTerbilang(Math.floor(angka / 1000000000)) +
      " Miliar " +
      angkaKeTerbilang(angka % 1000000000)
    );
  if (angka < 1000000000000000)
    return (
      angkaKeTerbilang(Math.floor(angka / 1000000000000)) +
      " Triliun " +
      angkaKeTerbilang(angka % 1000000000000)
    );

  return "Angka terlalu besar";
}

// Export ES Module
export function formatRupiahDenganHuruf(angka) {
  if (typeof angka !== "number" || isNaN(angka)) {
    throw new Error("Parameter harus berupa angka.");
  }

  const formattedAngka = formatRupiah(angka);
  const huruf = angkaKeTerbilang(angka).trim().replace(/\s+/g, " ") + " Rupiah";
  return `${formattedAngka} (${huruf})`;
}
