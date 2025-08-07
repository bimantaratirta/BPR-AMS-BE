function getYear(dateInput) {
  const monthMap = {
    Januari: 'January',
    Februari: 'February',
    Maret: 'March',
    April: 'April',
    Mei: 'May',
    Juni: 'June',
    Juli: 'July',
    Agustus: 'August',
    September: 'September',
    Oktober: 'October',
    November: 'November',
    Desember: 'December',
  };

  // Ganti nama bulan Indonesia ke Inggris
  const replaced = dateInput.replace(
    /\b(Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)\b/,
    (match) => monthMap[match]
  );

  const date = new Date(replaced);
  console.log('Replaced:', replaced);
  console.log('Date:', date);

  if (isNaN(date)) throw new Error('Invalid date input');
  return date.getFullYear();
}

export default getYear;
