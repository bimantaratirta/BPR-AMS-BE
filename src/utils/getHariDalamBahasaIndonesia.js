export function getHariDalamBahasaIndonesia(tanggal) {
  console.log('tanggal:', tanggal);
  const hariIndonesia = [
    'Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
  ];

  const date = typeof tanggal === 'string' ? new Date(tanggal) : tanggal;

  if (isNaN(date.getTime())) return 'Tanggal tidak valid';

  const hariKe = date.getDay(); // 0 (Minggu) sampai 6 (Sabtu)
  return hariIndonesia[hariKe];
}
