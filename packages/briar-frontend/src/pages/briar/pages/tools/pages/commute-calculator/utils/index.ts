import XLSX from 'xlsx-js-style';

import { errorNotify } from '@/pages/briar/utils/notify';

export function formatDistance(distance: number) {
	return (distance / 1000).toFixed(2) + '公里';
}

export function formatTime(time: number) {
	return Math.ceil(time / 60) + '分钟';
}

export const downloadExcelFromTable = (query: string) => {
	const table = document.querySelector(query);

	if (!table) {
		errorNotify('未找到表格');
		return; // 在未找到表格时终止函数执行
	}

	// 将表格转换为工作簿
	const wb = XLSX.utils.table_to_book(table, { sheet: 'Sheet JS' });

	// 获取工作表
	const ws = wb.Sheets['Sheet JS'];
	const range = XLSX.utils.decode_range(ws['!ref']!);

	// 定义最大列宽（例如 30）
	const MAX_COL_WIDTH = 30;

	// 遍历单元格并添加样式
	for (let R = range.s.r; R <= range.e.r; ++R) {
		for (let C = range.s.c; C <= range.e.c; ++C) {
			const cell_address = { c: C, r: R };
			const cell_ref = XLSX.utils.encode_cell(cell_address);

			if (!ws[cell_ref]) continue;

			// 样式示例
			ws[cell_ref].s = {
				alignment: {
					horizontal: 'center',
					vertical: 'center',
					wrapText: true // 启用文本换行
				}
			};

			// 计算列宽
			if (ws[cell_ref].v) {
				const cellValue = ws[cell_ref].v.toString();
				const cellWidth = cellValue.length;

				// 设置列宽的最大值
				if (!ws['!cols']) {
					ws['!cols'] = [];
				}
				if (!ws['!cols'][C]) {
					ws['!cols'][C] = { wch: 10 }; // 默认宽度
				}
				ws['!cols'][C].wch = Math.min(MAX_COL_WIDTH, Math.max(ws['!cols'][C].wch!, cellWidth));
			}
		}
	}

	// 导出 Excel 文件
	XLSX.writeFile(wb, 'table.xlsx');
};
