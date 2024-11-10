/**
 * 数字格式化
 * @param value 主体数字
 * @param decimalNum 保留位数
 * @param isRounding 是否四舍五入
 * @param isAmount 是否展示金额类型(千分号)
 * @returns
 */
export function leFormatNumber({
	value,
	decimalNum = 2,
	isRounding = true,
	isAmount = false
}: {
	value: number | string;
	decimalNum?: number;
	isRounding?: boolean;
	isAmount?: boolean;
}) {
	value = +value;
	if (isNaN(value)) {
		return value;
	}

	let newValue;
	// 是否四舍五入
	if (isRounding) {
		// 使用toFixed函数对 value 进行四舍五入，并保留指定的小数位数
		newValue = parseFloat(Number(value).toFixed(decimalNum));
	} else {
		// 保留x位小数 则保留x+1位 但只截取x位小数，达到不进行四舍五入的效果
		newValue = parseFloat(
			Number(value)
				.toFixed(decimalNum + 1)
				.slice(0, -1)
		);
	}
	// 初始化一个空字符串，用于存储小数部分的零
	let zeroDecimal = '';
	// 根据参数决定是否需要生成小数点后的零
	const zeroNumFn = (isZero = false, countDeciNum = 0) => {
		// 计算需要填充的零的数量
		const forNum = isZero ? decimalNum : countDeciNum;
		// 循环生成零，并附加到 zeroDecimal 字符串中
		for (let i = 0; i < forNum; i++) {
			zeroDecimal += '0';
		}
	};

	// 如果 newValue 是 0 或者不是一个数字，则生成带有指定小数位数的零
	if (newValue == 0 || isNaN(newValue)) {
		zeroNumFn(true);
		// 返回格式化的字符串，包括整数部分和小数部分
		return '0' + (decimalNum == 0 ? '' : '.') + zeroDecimal;
	}

	// 将 newValue 转换为字符串，并分割成整数部分和小数部分
	const splitNewValue = newValue.toString().split('.');

	// 如果存在小数部分
	if (splitNewValue[1]) {
		// 如果小数部分的长度与期望的小数位数不一致
		if (splitNewValue[1].length !== decimalNum) {
			// 补充缺少的零
			zeroNumFn(false, Math.abs(decimalNum - Number(splitNewValue[1].length)));
			// 将原始的小数部分与补充的零合并
			zeroDecimal = splitNewValue[1] + zeroDecimal;
		}
		// 如果小数部分的长度与期望的小数位数一致
		else {
			// 直接使用原始的小数部分
			zeroDecimal = splitNewValue[1];
		}
	}
	// 如果没有小数部分
	else {
		// 生成指定数量的零
		zeroNumFn(true);
	}

	// 如果 isAmount 为 true，则使用 toLocaleString 方法格式化整数部分，否则直接使用整数部分
	const integerNum = isAmount ? Number(splitNewValue[0]).toLocaleString() : splitNewValue[0];

	// 返回最终格式化的字符串，包括整数部分和小数部分
	return `${integerNum}${decimalNum == 0 ? '' : '.'}${zeroDecimal}`;
}
