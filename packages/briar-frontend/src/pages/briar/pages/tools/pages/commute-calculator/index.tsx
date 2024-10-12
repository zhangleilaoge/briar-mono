import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Form, FormProps, Input, Select } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { errorNotify } from '@/pages/briar/utils/notify';

import Grid from './components/grid';
import { init } from './init';
import styles from './style.module.scss';
import { IRowData, ISearchResult, ISource } from './type';
import { downloadExcelFromTable, formatDistance, formatTime } from './utils';

enum TravelMode {
	/** 公交换乘 */
	Transfer = 'transfer',
	/** 骑行 */
	Bicycle = 'bicycling',
	/**驾车 */
	Driving = 'driving'
}

const TRAVEL_MODE_OPTS = [
	{ value: TravelMode.Transfer, label: '公交换乘' },
	{ value: TravelMode.Bicycle, label: '骑行' },
	{ value: TravelMode.Driving, label: '驾车(暂时不支持查询)' }
];

export type FieldType = {
	city: string;
	starts: string[];
	ends: string[];
	mode: TravelMode;
	key?: string;
	token?: string;
};

const CommuteCalculator = () => {
	const [formVal, setFormVal] = useState({
		city: '杭州',
		starts: ['金都新城'],
		ends: [''],
		mode: TravelMode.Transfer
	});
	const [map, setMap] = useState<any>(null);
	const [gridData, setGridData] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
		if (!map) {
			errorNotify('地图实例初始化失败，无法进行计算。');
			return;
		}
		if (values.token && values.key) {
			await init(values.key, values.token);
		}

		setFormVal(values);
	};

	const download = () => {
		downloadExcelFromTable('table');
	};

	const search: (source: ISource[]) => Promise<ISearchResult | null> = useCallback(
		(source: ISource[]) => {
			const start = source[0].keyword;

			return new Promise((resolve, reject) => {
				if (!map) {
					resolve(null);
					return;
				}

				switch (formVal.mode) {
					case TravelMode.Driving:
						const driving = new map.Driving({
							map: map,
							city: formVal.city,
							panel: 'panel'
						});

						driving.search(
							source,
							(
								status: string,
								result: {
									routes: {
										distance: number;
										time: number;
									}[];
								}
							) => {
								if (status === 'complete') {
									const minDistance = result.routes.reduce((a, b) =>
										a.distance < b.distance ? a : b
									).distance;
									const minTime = result.routes.reduce((a, b) => (a.time < b.time ? a : b)).time;
									resolve({
										start,
										minDistance: formatDistance(minDistance),
										minTime: formatTime(minTime),
										plans: result.routes.map((item) => {
											return {
												...item,
												distanceTotal: formatDistance(item.distance),
												timeTotal: formatTime(item.time),
												instructions: []
											};
										})
									});
								} else {
									errorNotify('驾驶路线数据查询失败' + result);
									reject();
								}
							}
						);

						break;
					case TravelMode.Bicycle:
						const riding = new map.Riding({
							map: map,
							city: formVal.city,
							panel: 'panel'
						});
						riding.search(
							source,
							(
								status: string,
								result: {
									routes: {
										distance: number;
										time: number;
									}[];
								}
							) => {
								if (status === 'complete') {
									const minDistance = result.routes.reduce((a, b) =>
										a.distance < b.distance ? a : b
									).distance;
									const minTime = result.routes.reduce((a, b) => (a.time < b.time ? a : b)).time;
									resolve({
										start,
										minDistance: formatDistance(minDistance),
										minTime: formatTime(minTime),
										plans: result.routes.map((item) => {
											return {
												distanceTotal: formatDistance(item.distance),
												timeTotal: formatTime(item.time),
												instructions: []
											};
										})
									});
								} else {
									errorNotify('骑行路线数据查询失败' + result);
									reject();
								}
							}
						);
						break;
					case TravelMode.Transfer:
						const transfer = new map.Transfer({
							map,
							city: formVal.city,
							panel: 'panel',
							policy: map.TransferPolicy.LEAST_TIME //乘车策略
						});
						transfer.search(
							source,
							(
								status: string,
								result: {
									plans: {
										segments: {
											distance: number;
											time: number;
											instruction: string;
										}[];
									}[];
								}
							) => {
								// result即是对应的公交路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_TransferResult
								if (status === 'complete') {
									const plans = result.plans.map((plan) => {
										let distanceTotal = 0;
										let timeTotal = 0;
										const instructions = plan.segments.map(({ distance, time, instruction }) => {
											distanceTotal += distance;
											timeTotal += time;
											return instruction;
										});
										return {
											distanceTotal,
											timeTotal,
											instructions,
											fastest: false,
											shortest: false
										};
									});
									plans.forEach((plan, index) => {
										const others = plans.filter((_, i) => index !== i);

										plan.fastest = others.every((other) => other.timeTotal > plan.timeTotal);
										plan.shortest = others.every(
											(other) => other.distanceTotal > plan.distanceTotal
										);
									});
									const minDistance = plans.reduce((a, b) =>
										a.distanceTotal < b.distanceTotal ? a : b
									).distanceTotal;
									const minTime = plans.reduce((a, b) =>
										a.timeTotal < b.timeTotal ? a : b
									).timeTotal;

									resolve({
										start,
										minDistance: formatDistance(minDistance),
										minTime: formatTime(minTime),
										plans: plans.map((plan) => ({
											...plan,
											timeTotal: formatTime(plan.timeTotal),
											distanceTotal: formatDistance(plan.distanceTotal)
										}))
									});
								} else {
									errorNotify('公交路线数据查询失败' + result);
									reject();
								}
							}
						);
						break;
				}
			});
		},
		[formVal.city, formVal.mode, map]
	);

	useEffect(() => {
		init().then((mapInstance) => {
			if (!mapInstance) {
				errorNotify('地图实例初始化失败，请刷新页面重试。');
			}
			setMap(mapInstance);
		});
	}, []);

	useEffect(() => {
		const searchForResult = async () => {
			setLoading(true);

			const newGridData: IRowData[] = [];

			for (let j = 0; j < formVal.starts.length; j++) {
				const start = formVal.starts[j];
				let rowData = {
					start
				};

				for (let i = 0; i < formVal.ends.length; i++) {
					const end = formVal.ends[i];

					if (!start || !end) {
						continue; // 如果 start 或 end 不存在，跳过当前循环
					}

					const result = await search([
						{
							keyword: start,
							city: formVal.city
						},
						{
							keyword: end,
							city: formVal.city
						}
					]);

					rowData = {
						...rowData,
						[`end-distance-${i}`]: result?.minDistance,
						[`end-time-${i}`]: result?.minTime,
						[`end-plans-${i}`]: result?.plans
					};
				}

				if (Reflect.ownKeys(rowData).length === 1) {
					continue;
				}

				newGridData.push(rowData);
			}

			setLoading(false);
			setGridData(newGridData);
		};

		searchForResult();
	}, [formVal, search]);

	return (
		<div>
			<div
				id="amap-container"
				style={{
					display: 'none'
				}}
			></div>
			<div>
				<Form
					onFinish={onFinish}
					layout="horizontal"
					initialValues={formVal}
					style={{
						marginTop: 24
					}}
				>
					<Form.Item<FieldType>
						label="城市"
						labelCol={{ span: 4 }}
						name="city"
						validateTrigger="onBlur"
						required={false}
						rules={[
							{
								required: true,
								whitespace: true,
								message: '请输入城市'
							}
						]}
					>
						<Input style={{ width: '400px' }} />
					</Form.Item>
					<Form.Item<FieldType> label="高德地图 key" labelCol={{ span: 4 }} name="key">
						<Input style={{ width: '400px' }} />
					</Form.Item>
					<Form.Item<FieldType> label="高德地图 token" labelCol={{ span: 4 }} name="token">
						<Input style={{ width: '400px' }} />
					</Form.Item>
					<Form.List name="starts">
						{(fields, { add, remove }, { errors }) => (
							<>
								{fields.map((field, index) => (
									<Form.Item
										labelCol={{ span: 4 }}
										wrapperCol={{ offset: index === 0 ? 0 : 4 }}
										label={index === 0 ? '起点' : ''}
										required={false}
										key={field.key}
									>
										<Form.Item
											{...field}
											validateTrigger={['onChange', 'onBlur']}
											rules={[
												{
													required: true,
													whitespace: true,
													message: '请输入起点'
												}
											]}
											noStyle
										>
											<Input style={{ width: '400px' }} />
										</Form.Item>
										{fields.length > 1 ? (
											<MinusCircleOutlined
												className={styles.minus}
												onClick={() => remove(field.name)}
											/>
										) : null}
									</Form.Item>
								))}
								<Form.Item>
									<Button
										type="dashed"
										onClick={() => add()}
										style={{ marginLeft: '20%' }}
										icon={<PlusOutlined />}
									>
										增加起点
									</Button>
									<Form.ErrorList errors={errors} />
								</Form.Item>
							</>
						)}
					</Form.List>
					<Form.List name="ends">
						{(fields, { add, remove }, { errors }) => (
							<>
								{fields.map((field, index) => (
									<Form.Item
										labelCol={{ span: 4 }}
										wrapperCol={{ offset: index === 0 ? 0 : 4 }}
										label={index === 0 ? '终点' : ''}
										required={false}
										key={field.key}
									>
										<Form.Item
											{...field}
											validateTrigger={['onChange', 'onBlur']}
											rules={[
												{
													required: true,
													whitespace: true,
													message: '请输入终点'
												}
											]}
											noStyle
										>
											<Input style={{ width: '400px' }} />
										</Form.Item>
										{fields.length > 1 ? (
											<MinusCircleOutlined
												className={styles.minus}
												onClick={() => remove(field.name)}
											/>
										) : null}
									</Form.Item>
								))}
								<Form.Item>
									<Button
										type="dashed"
										onClick={() => add()}
										style={{ marginLeft: '20%' }}
										icon={<PlusOutlined />}
									>
										增加终点
									</Button>
									<Form.ErrorList errors={errors} />
								</Form.Item>
							</>
						)}
					</Form.List>
					<Form.Item<FieldType> label="出行方式" labelCol={{ span: 4 }} name="mode">
						<Select style={{ width: '400px' }} options={TRAVEL_MODE_OPTS} />
					</Form.Item>
					<Form.Item wrapperCol={{ offset: 4 }} className={styles.btns}>
						<Button htmlType="submit" type="primary">
							查询
						</Button>
						<Button onClick={download}>导出 Excel</Button>
					</Form.Item>
				</Form>
				{formVal.ends[0] && (
					<>
						<Divider plain></Divider>
						<Grid ends={formVal.ends} gridData={gridData} loading={loading} />
					</>
				)}
			</div>
		</div>
	);
};

export default CommuteCalculator;
