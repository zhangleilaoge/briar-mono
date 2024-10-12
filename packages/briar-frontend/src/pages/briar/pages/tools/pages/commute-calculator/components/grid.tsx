import { Divider, Spin, Table, Tag } from 'antd';

import s from '../style.module.scss';
import { IPlan, IRowData } from '../type';

interface IGrid {
	ends: string[];
	gridData: IRowData[];
	loading: boolean;
}

const getCols = (ends: string[]) => {
	return [
		{
			title: '起点',
			key: 'start',
			dataIndex: 'start',
			fixed: 'left' as any
		},
		...ends.map((end, endIndex) => {
			return {
				title: end,
				key: `end-${endIndex}`,
				children: [
					{
						title: '最短距离',
						key: `end-distance-${endIndex}`,
						dataIndex: `end-distance-${endIndex}`
					},
					{
						title: '最短时间',
						key: `end-time-${endIndex}`,
						dataIndex: `end-time-${endIndex}`
					},
					{
						title: '具体路径',
						key: `end-plans-${endIndex}`,
						render: (data: IRowData) => {
							const plans = (data[`end-plans-${endIndex}`] as IPlan[]) || [];
							return plans.map((plan, pIndex) => {
								return (
									<>
										<div key={pIndex} className={s.plan}>
											方案{pIndex + 1}: {plan.instructions?.join(',')}
											<div>
												<b style={{ color: 'burlywood' }}>
													总用时: {plan.timeTotal || 0} 总距离：{plan.distanceTotal || 0}
												</b>
											</div>
										</div>
										{plan.shortest && <Tag color="cyan"> 最短距离 </Tag>}
										{plan.fastest && <Tag color="purple"> 最快用时 </Tag>}
										{pIndex !== plans.length - 1 ? (
											<Divider plain style={{ margin: '8px 0' }}></Divider>
										) : null}
									</>
								);
							});
						}
					}
				]
			};
		})
	];
};

const Grid = (props: IGrid) => {
	const { ends, gridData, loading } = props;
	const columns = getCols(ends);

	if (loading) {
		return <Spin></Spin>;
	}

	return <Table dataSource={gridData} columns={columns} scroll={{ x: 'max-content' }} bordered />;
};

export default Grid;
