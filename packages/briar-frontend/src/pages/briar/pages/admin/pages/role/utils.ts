import { IMenuRouterConfig } from '@/pages/briar/types/router';

export const convertLabelsToText = (config: IMenuRouterConfig[]) => {
	return config.map((item) => {
		const newItem: any = {
			key: item.key,
			title: item.label // 将label转换为text
		};

		if (item.children) {
			newItem.children = convertLabelsToText(item.children); // 递归处理子节点
		}

		return newItem;
	});
};
