export function getExcelColumn(index) {
  let column = "";
  let temp;

  while (index >= 0) {
    temp = index % 26;
    column = String.fromCharCode(temp + 65) + column; // 65 = ASCII untuk 'A'
    index = Math.floor(index / 26) - 1;
  }

  return column;
}
