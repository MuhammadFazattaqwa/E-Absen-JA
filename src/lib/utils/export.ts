import { Attendance } from '@/lib/types/database';
import { formatDate } from './date';

export async function exportToExcel(attendances: Attendance[], filename: string = 'riwayat-absensi.xlsx') {
  const ExcelJS = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Riwayat Absensi');
  const headers = ['Tanggal', 'Sesi', 'Hari', 'Kajian', 'Pengajar', 'PJ', 'Status', 'Catatan', 'URL Foto'];
  const columnWidths = headers.map((header) => header.length);

  const normalizeText = (value: string) =>
    value.replace(/\s+/g, ' ').trim();

  worksheet.addRow(headers);

  attendances.forEach((a) => {
    const rowValues = [
      formatDate(a.date, 'dd/MM/yyyy'),
      a.session === 'morning' ? 'Pagi' : 'Malam',
      a.day_name,
      a.subject,
      a.teacher,
      a.pj,
      a.status,
      a.note ? normalizeText(a.note) : '-',
      a.photo_url ? 'Lihat' : '-',
    ];

    rowValues.forEach((value, index) => {
      const textLength = String(value).length;
      if (textLength > columnWidths[index]) {
        columnWidths[index] = textLength;
      }
    });

    const row = worksheet.addRow(rowValues);

    if (a.photo_url) {
      const linkCell = row.getCell(9);
      linkCell.value = { text: 'Lihat', hyperlink: a.photo_url };
      linkCell.font = {
        color: { argb: 'FF0563C1' },
        underline: true,
      };
    }
  });

  const thinBorder = {
    top: { style: 'thin' as const, color: { argb: 'FFBFBFBF' } },
    left: { style: 'thin' as const, color: { argb: 'FFBFBFBF' } },
    bottom: { style: 'thin' as const, color: { argb: 'FFBFBFBF' } },
    right: { style: 'thin' as const, color: { argb: 'FFBFBFBF' } },
  };

  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFEAF1E0' },
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
  });

  worksheet.eachRow((row) => {
    for (let col = 1; col <= headers.length; col++) {
      const cell = row.getCell(col);
      cell.border = thinBorder;
      if (row.number > 1) {
        cell.alignment = {
          vertical: 'middle',
          horizontal: col === 9 ? 'center' : 'left',
        };
      }
    }
  });

  columnWidths.forEach((columnWidth, index) => {
    worksheet.getColumn(index + 1).width = Math.min(Math.max(columnWidth + 2, 10), 60);
  });

  worksheet.views = [{ state: 'frozen', ySplit: 1 }];

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
