import { PrismaService } from "../../../common/service/prisma.service.js";
import ExcelJS from "exceljs";
import { getExcelColumn } from "../../../utils/getExcelColumn.js";

class TestService {
  constructor() {
    this.prisma = new PrismaService();
  }

  async generateXlsxAM() {
    const workbook = new ExcelJS.Workbook();

    const addWorksheet = (sheetName) => {
      const worksheet = workbook.addWorksheet(sheetName);

      // Header utama
      worksheet.mergeCells("A1:E1");
      const headerCell = worksheet.getCell("A1");
      headerCell.value = "DATA KUNJUNGAN PMS";
      headerCell.font = { bold: true, size: 16 };
      headerCell.alignment = { horizontal: "center", vertical: "middle" };

      headerCell.style.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF9CC2E5" }, // Blue color
      };

      // Add border to the header cell
      headerCell.style.border = {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      };

      // Header kolom
      worksheet.mergeCells("A2:A3");
      worksheet.getCell("A2").value = "KANTOR";
      worksheet.getCell("A2").font = { bold: true };
      worksheet.getCell("A2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      // Add border to "KANTOR" header cell
      worksheet.getCell("A2").style.border = {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      };
      worksheet.getCell("A2").style.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF9CC2E5" }, // Blue color
      };

      worksheet.mergeCells("B2:B3");
      worksheet.getCell("B2").value = "WIL";
      worksheet.getCell("B2").font = { bold: true };
      worksheet.getCell("B2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      // Add border to "WIL" header cell
      worksheet.getCell("B2").style.border = {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      };
      worksheet.getCell("B2").style.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF9CC2E5" }, // Blue color
      };

      worksheet.mergeCells("C2:C3");
      worksheet.getCell("C2").value = "SLO";
      worksheet.getCell("C2").font = { bold: true };
      worksheet.getCell("C2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      // Add border to "SLO" header cell
      worksheet.getCell("C2").style.border = {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      };
      worksheet.getCell("C2").style.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF9CC2E5" }, // Blue color
      };

      worksheet.mergeCells("D2:D3");
      worksheet.getCell("D2").value = "LO";
      worksheet.getCell("D2").font = { bold: true };
      worksheet.getCell("D2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      // Add border to "LO" header cell
      worksheet.getCell("D2").style.border = {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      };
      worksheet.getCell("D2").style.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF9CC2E5" }, // Blue color
      };

      worksheet.mergeCells("E2:E3");
      worksheet.getCell("E2").value = "TARGET";
      worksheet.getCell("E2").font = { bold: true };
      worksheet.getCell("E2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      // Add border to "TARGET" header cell
      worksheet.getCell("E2").style.border = {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      };
      worksheet.getCell("E2").style.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF9CC2E5" }, // Blue color
      };

      // Data with region and branch details
      const data = {
        headerRow: [
          { year: 2021, month: "SEPTEMBER", week: "MINGGU I" },
          { year: 2021, month: "SEPTEMBER", week: "MINGGU II" },
          { year: 2021, month: "SEPTEMBER", week: "MINGGU III" },
          { year: 2021, month: "SEPTEMBER", week: "MINGGU IV" },
        ],
        data: [
          {
            region: "BARAT",
            am: {
              name: "Supriadi",
              branch: [
                {
                  branch: "KUNINGAN",
                  slo: "VICKY",
                  LO: [
                    {
                      name: "AKHMADI",
                      target: 50,
                      report: [
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU I",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU II",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU III",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU IV",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                      ],
                    },
                    {
                      name: "SITI SAPURO",
                      target: 50,
                      report: [
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU I",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU II",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU III",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU IV",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                      ],
                    },
                    {
                      name: "SRI N",
                      target: 50,
                      report: [
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU I",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU II",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU III",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU IV",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                      ],
                    },
                  ],
                },
                {
                  branch: "CWN",
                  slo: "SUBRIANA",
                  LO: [
                    {
                      name: "ERNA K",
                      target: 50,
                      report: [
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU I",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU II",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU III",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU IV",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                      ],
                    },
                    {
                      name: "SITI R",
                      target: 50,
                      report: [
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU I",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU II",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU III",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU IV",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                      ],
                    },
                  ],
                },
                {
                  branch: "AWN",
                  slo: "FERI",
                  LO: [
                    {
                      name: "MAJID",
                      target: 50,
                      report: [
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU I",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU II",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU III",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU IV",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                      ],
                    },
                  ],
                },
                {
                  branch: "GEGESIK",
                  slo: "SUHERMAN",
                  LO: [
                    {
                      name: "NURFITRIYAH",
                      target: 50,
                      report: [
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU I",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU II",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU III",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU IV",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
          {
            region: "SELATAN",
            am: {
              name: "UHAMAD",
              branch: [
                {
                  branch: "SUMBER",
                  slo: "TINO S",
                  LO: [
                    {
                      name: "ADHIANSYAH",
                      target: 50,
                      report: [
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU I",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU II",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU III",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU IV",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                      ],
                    },
                    {
                      name: "DEDI A",
                      target: 50,
                      report: [
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU I",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU II",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU III",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU IV",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                      ],
                    },
                  ],
                },
                {
                  branch: "SEDONG",
                  slo: "IMAM P",
                  LO: [
                    {
                      name: "ANDI G",
                      target: 50,
                      report: [
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU I",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU II",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU III",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU IV",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                      ],
                    },
                    {
                      name: "BAYU S",
                      target: 50,
                      report: [
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU I",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU II",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU III",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU IV",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                      ],
                    },
                    {
                      name: "AHMAD H",
                      target: 50,
                      report: [
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU I",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU II",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU III",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                        {
                          month: "SEPTEMBER",
                          week: "MINGGU IV",
                          lo: { good: 5, bad: 5 },
                          slo: { good: 5, bad: 5 },
                          am: { good: 5, bad: 5 },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ],
      };

      data.headerRow.forEach((item, index) => {
        // Calculate the first column (F, L, R, X, ...)
        const col1 = getExcelColumn(5 + index * 6); // Start from column F (ASCII 'F' = 70)

        // Calculate the second column (K, Q, W, AC, ...)
        const col2 = getExcelColumn(10 + index * 6); // Start from column K (ASCII 'K' = 75)

        // Merge cells for the week header
        worksheet.mergeCells(`${col1}1:${col2}1`);
        const cell = worksheet.getCell(`${col1}1`);

        // Format: "MINGGU I (23-29 SEPTEMBER 2024)"
        cell.value = `${item.week} (${item.month} ${item.year})`;
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };

        // Apply border to each header cell
        cell.style.border = {
          top: { style: "thin", color: { argb: "FF000000" } },
          left: { style: "thin", color: { argb: "FF000000" } },
          bottom: { style: "thin", color: { argb: "FF000000" } },
          right: { style: "thin", color: { argb: "FF000000" } },
        };

        // Apply blue fill color to header cells
        cell.style.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF9CC2E5" }, // Blue color
        };

        // Calculate the column start for the sub columns (LO, SLO, AM)
        let subColumnStart = 5 + index * 6; // Start from the next column after week columns

        // Loop for sub columns LO, SLO, AM
        ["LO", "SLO", "AM"].forEach((label, subIndex) => {
          const subCol1 = getExcelColumn(subColumnStart + subIndex * 2); // Sub column first cell
          const subCol2 = getExcelColumn(subColumnStart + 1 + subIndex * 2); // Sub column second cell
          // Merge cells for sub columns
          worksheet.mergeCells(`${subCol1}2:${subCol2}2`);
          const subCell = worksheet.getCell(`${subCol1}2`);

          subCell.value = label;
          subCell.font = { bold: true };
          subCell.alignment = { horizontal: "center", vertical: "middle" };

          // Apply border to each sub column header cell
          subCell.style.border = {
            top: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
          };

          // Apply blue fill color to sub column header cells
          subCell.style.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF9CC2E5" }, // Blue color
          };

          let startStatus = subColumnStart + subIndex * 2;
          // Adding "GOOD" and "BAD" headers
          ["GOOD", "BAD"].forEach((status, statusIndex) => {
            const statusCol = getExcelColumn(startStatus + statusIndex);
            const statusCell = worksheet.getCell(`${statusCol}3`);
            statusCell.value = status;
            statusCell.font = { bold: true };
            statusCell.alignment = { horizontal: "center", vertical: "middle" };

            // Apply border to each status header cell
            statusCell.style.border = {
              top: { style: "thin", color: { argb: "FF000000" } },
              left: { style: "thin", color: { argb: "FF000000" } },
              bottom: { style: "thin", color: { argb: "FF000000" } },
              right: { style: "thin", color: { argb: "FF000000" } },
            };

            // Apply blue fill color to status header cells
            statusCell.style.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FF9CC2E5" }, // Blue color
            };
          });
        });
      });

      let totalWilayahBarat = 0;
      let totalWilayahSelatan = 0;

      // Iterating through data and generating rows
      data.data.forEach((region) => {
        let regionTotal = 0;
        let regionWeekGoodLO = [0, 0, 0, 0]; // For each week (Minggu I, II, III, IV)
        let regionWeekBadLO = [0, 0, 0, 0];
        let regionWeekGoodSLO = [0, 0, 0, 0];
        let regionWeekBadSLO = [0, 0, 0, 0];
        let regionWeekGoodAM = [0, 0, 0, 0];
        let regionWeekBadAM = [0, 0, 0, 0];

        region.am.branch.forEach((branch) => {
          let weekGoodLO = [0, 0, 0, 0]; // For each week (Minggu I, II, III, IV)
          let weekBadLO = [0, 0, 0, 0];
          let weekGoodSLO = [0, 0, 0, 0];
          let weekBadSLO = [0, 0, 0, 0];
          let weekGoodAM = [0, 0, 0, 0];
          let weekBadAM = [0, 0, 0, 0];

          // Add rows for each LO under this branch
          branch.LO.forEach((lo) => {
            const rowData = [
              branch.branch,
              region.region,
              branch.slo,
              lo.name,
              lo.target,
            ];

            // Iterate over each report (week) for the LO and get Good and Bad values
            lo.report.forEach((item) => {
              rowData.push(
                item.lo.good,
                item.lo.bad,
                item.slo.good,
                item.slo.bad,
                item.am.good,
                item.am.bad
              );
            });

            lo.report.forEach((item, index) => {
              weekGoodLO[index] += item.lo.good; // Accumulate GOOD for LO
              weekBadLO[index] += item.lo.bad; // Accumulate BAD for LO
              weekGoodSLO[index] += item.slo.good; // Accumulate GOOD for SLO
              weekBadSLO[index] += item.slo.bad; // Accumulate BAD for SLO
              weekGoodAM[index] += item.am.good; // Accumulate GOOD for AM
              weekBadAM[index] += item.am.bad; // Accumulate BAD for AM

              // Add Good and Bad values to the row
            });

            // Add the row with the collected data
            const row = worksheet.addRow(rowData);

            row.eachCell((cell) => {
              // Adding border to each cell in the row
              cell.style.border = {
                top: { style: "thin", color: { argb: "FF000000" } },
                left: { style: "thin", color: { argb: "FF000000" } },
                bottom: { style: "thin", color: { argb: "FF000000" } },
                right: { style: "thin", color: { argb: "FF000000" } },
              };
            });

            // Center alignment for the TARGET column
            row.getCell(5).alignment = {
              horizontal: "center",
              vertical: "middle",
            };
          });

          // Calculate and add total for each branch
          const totalTarget = branch.LO.reduce((acc, lo) => acc + lo.target, 0);
          const totalRow = [
            "TOTAL", // Label for total row
            "", // Placeholder for empty column
            "", // Placeholder for empty column
            "", // Placeholder for empty column
            totalTarget, // Total target
          ];
          [
            weekGoodLO,
            weekBadLO,
            weekGoodSLO,
            weekBadSLO,
            weekGoodAM,
            weekBadAM,
          ].forEach((item) => {
            item.forEach((value, index) => {
              totalRow.push(value); // Menambahkan setiap nilai dari array ke totalRow
            });
          });

          weekGoodLO.forEach((value, index) => {
            regionWeekGoodLO[index] += value; // Accumulate GOOD for LO
          });
          weekBadLO.forEach((value, index) => {
            regionWeekBadLO[index] += value; // Accumulate BAD for LO
          });
          weekGoodSLO.forEach((value, index) => {
            regionWeekGoodSLO[index] += value; // Accumulate GOOD for SLO
          });
          weekBadSLO.forEach((value, index) => {
            regionWeekBadSLO[index] += value; // Accumulate BAD for SLO
          });
          weekGoodAM.forEach((value, index) => {
            regionWeekGoodAM[index] += value; // Accumulate GOOD for AM
          });
          weekBadAM.forEach((value, index) => {
            regionWeekBadAM[index] += value; // Accumulate BAD for AM
          });

          // Prepare total row with accumulated values for GOOD and BAD

          const rawTotal = worksheet.addRow(totalRow);

          // Center alignment for the TARGET column in the total row
          rawTotal.getCell(5).alignment = {
            horizontal: "center",
            vertical: "middle",
          };

          // Apply green background color for the total row
          rawTotal.eachCell((cell) => {
            cell.style.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFC5E0B3" }, // Green color
            };

            // Adding border to each cell in the row
            cell.style.border = {
              top: { style: "thin", color: { argb: "FF000000" } },
              left: { style: "thin", color: { argb: "FF000000" } },
              bottom: { style: "thin", color: { argb: "FF000000" } },
              right: { style: "thin", color: { argb: "FF000000" } },
            };
          });

          // Merge cells for the TOTAL row (A-D)
          const lastRowIndex = worksheet.lastRow.number;
          worksheet.mergeCells(`A${lastRowIndex}:D${lastRowIndex}`); // Merge A-D for the TOTAL row

          // Accumulate region total
          regionTotal += totalTarget;
        });

        // Add region total row
        const regionTotalRow = [
          `WILAYAH ${region.region}`, // Nama wilayah
          "", // Placeholder kosong untuk kolom
          region.am.name, // Nama AM
          "", // Placeholder kosong untuk kolom
          regionTotal, // Total untuk wilayah
        ];

        [
          regionWeekGoodLO,
          regionWeekBadLO,
          regionWeekGoodSLO,
          regionWeekBadSLO,
          regionWeekGoodAM,
          regionWeekBadAM,
        ].forEach((item) => {
          item.forEach((value, index) => {
            regionTotalRow.push(value); // Menambahkan setiap nilai dari array ke totalRow
          });
        });

        const rawTotalRegion = worksheet.addRow(regionTotalRow);

        // Center alignment for the TARGET column in the region total row
        rawTotalRegion.getCell(5).alignment = {
          horizontal: "center",
          vertical: "middle",
        };

        // Apply blue background color for the region total row
        rawTotalRegion.eachCell((cell) => {
          cell.style.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF9CC2E5" }, // Blue color
          };

          // Adding border to each cell in the row
          cell.style.border = {
            top: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
          };
        });

        // Merge cells for the region total row
        const regionTotalRowIndex = worksheet.lastRow.number;
        worksheet.mergeCells(`A${regionTotalRowIndex}:B${regionTotalRowIndex}`); // Merge A-B for region.region
        worksheet.mergeCells(`C${regionTotalRowIndex}:D${regionTotalRowIndex}`); // Merge C-D for region.am.name

        // Add region total to the correct variable
        if (region.region === "BARAT") {
          totalWilayahBarat += regionTotal;
        } else if (region.region === "SELATAN") {
          totalWilayahSelatan += regionTotal;
        }
      });

      // Optional: Adding a final total row for the entire dataset
      const finalTotalRow = [
        "TOTAL WILAYAH",
        "",
        "",
        "",
        totalWilayahBarat + totalWilayahSelatan,
      ];

      worksheet.addRow(finalTotalRow);
      worksheet.mergeCells(
        `A${worksheet.lastRow.number}:B${worksheet.lastRow.number}`
      );
      worksheet.mergeCells(
        `C${worksheet.lastRow.number}:D${worksheet.lastRow.number}`
      );

      // Set column widths
      worksheet.getColumn(1).width = 12; // Kantor
      worksheet.getColumn(2).width = 10; // Wil
      worksheet.getColumn(3).width = 15; // SLO
      worksheet.getColumn(4).width = 25; // LO
      worksheet.getColumn(5).width = 10; // Target

      // Freeze header (columns and rows)
      worksheet.views = [
        {
          state: "frozen",
          xSplit: 5, // Freeze columns A-D
          ySplit: 3, // Freeze rows 1-2
        },
      ];
    };

    addWorksheet("Data Kunjungan PMS");

    // Generate XLSX file as a buffer
    const xlsxBuffer = await workbook.xlsx.writeBuffer();
    return xlsxBuffer;
  }

  async listAllReports(year, month) {
    const data = await this.prisma.region.findMany({
      select: {
        region: true,
        user: { select: { name: true, role: true }, where: { role: "AM" } },
        branches: {
          select: {
            branch: true,
            user: {
              select: {
                name: true,
                role: true,
                subordinates: {
                  select: {
                    name: true,
                    role: true,
                    report_lo: {
                      select: {
                        process: true,
                        created_at: true,
                        review_by_am: true,
                        review_by_slo: true,
                      },
                      where: {
                        OR: [
                          {
                            review_by_am: {
                              gte: new Date(`${year}-${month}-01`), // Filter by the first day of the month
                              lte: new Date(`${year}-${month}-31`), // Filter by the last day of the month
                            },
                          },
                          {
                            review_by_slo: {
                              gte: new Date(`${year}-${month}-01`), // Filter by the first day of the month
                              lte: new Date(`${year}-${month}-31`), // Filter by the last day of the month
                            },
                          },
                          {
                            created_at: {
                              gte: new Date(`${year}-${month}-01`), // Filter by the first day of the month
                              lte: new Date(`${year}-${month}-31`), // Filter by the last day of the month
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
              where: {
                role: "SLO", // Only select users with role 'slo'
              },
            },
          },
        },
      },
    });

    // // Mapping data berdasarkan proses
    // const mappedData = data.map((region) => ({
    //   region: region.region,
    //   am: region.branches.map((branch) => ({
    //     name: branch.slo.name,
    //     branch: branch.branch,
    //     slo: branch.slo.report_lo.map((report) => {
    //       let processStatus = "";

    //       if (report.status === "GOOD") {
    //         processStatus = "REVIEW_SLO";
    //       } else if (report.status === "BAD") {
    //         processStatus = "DECLINE_LO";
    //       }

    //       return {
    //         name: report.customer.name,
    //         target: 50,
    //         report: [
    //           {
    //             month: `${month}`,
    //             week: "MINGGU I",
    //             lo: { good: 5, bad: 5 },
    //             slo: { good: 5, bad: 5 },
    //             am: { good: 5, bad: 5 },
    //           },
    //           // Other weeks (Minggu II, III, IV)
    //         ],
    //         processStatus, // Status proses berdasarkan kondisi status
    //       };
    //     }),
    //   })),
    // }));

    return data;
  }
}

export default new TestService();
