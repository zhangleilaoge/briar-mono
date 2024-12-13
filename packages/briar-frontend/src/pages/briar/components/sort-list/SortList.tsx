import cx from 'classnames';
import { useCallback, useEffect, useState } from 'react';

import { ThemeColor } from '../../constants/styles';
interface SortListProps<T> {
	className?: string;
	list?: T[];
	setSortedList?: (list: T[]) => void;
	onSortChange?: (sortBy: keyof T, sortType: 'asc' | 'desc' | null) => void;
	sortByMap: { key: keyof T; label: string; compare?: (a: T, b: T) => number }[];
}

interface SortIndicatorProps {
	sortType: 'asc' | 'desc' | null; // null是默认状态
}

const sortTypeSeq = ['desc', 'asc', null];

const SortIndicator: React.FC<SortIndicatorProps> = ({ sortType }) => {
	return (
		<div>
			<div className="ml-[4px] flex cursor-pointer justify-between flex-col h-[22px] translate-y-[-1px]">
				<span
					className="text-[8px] translate-y-[2px] scale-x-150"
					style={{
						color: sortType === 'asc' ? ThemeColor.selectedColor : 'lightgrey'
					}}
				>
					▲
				</span>
				<span
					className="text-[8px] translate-y-[-2px] scale-x-150"
					style={{
						color: sortType === 'desc' ? ThemeColor.selectedColor : 'lightgrey'
					}}
				>
					▼
				</span>
			</div>
		</div>
	);
};

function SortList<T>({
	list,
	setSortedList,
	sortByMap,
	onSortChange,
	className = ''
}: SortListProps<T>) {
	const [sortType, setSortType] = useState<'asc' | 'desc' | null>(null);
	const [sortBy, setSortBy] = useState<keyof T | null>(null);

	const handleSortChange = useCallback(
		(key: keyof T) => {
			const currentSortTypeIndex = sortTypeSeq.indexOf(sortType);

			const newSortType = sortTypeSeq[
				(currentSortTypeIndex + 1) % sortTypeSeq.length
			] as SortIndicatorProps['sortType'];

			onSortChange?.(key, newSortType);

			if (sortBy === key) {
				// Toggle sort type
				setSortType(newSortType);
			} else {
				// Set new sort
				setSortBy(key);
				setSortType('desc'); // default to ascending
			}

			// Sort list based on selected sortBy and sortType
			const sortedList = [...(list || [])].sort((a, b) => {
				const compare =
					sortByMap.find((item) => item.key === key)?.compare ||
					((a: any, b: any) => a[key] < b[key] && a[key] !== b[key]);
				if (compare(a, b)) {
					return newSortType === 'asc' ? -1 : 1;
				} else if (compare(b, a)) {
					return newSortType === 'asc' ? 1 : -1;
				}
				return 0;
			});

			newSortType ? setSortedList?.(sortedList) : setSortedList?.(list || []);
		},
		[list, onSortChange, setSortedList, sortBy, sortByMap, sortType]
	);

	useEffect(() => {
		setSortedList?.(list || []);
	}, [list, setSortedList]);

	return (
		<div className={cx('cursor-pointer flex gap-[12px] ', className)}>
			{sortByMap.map(({ key, label }) => (
				<div key={String(key)}>
					<span
						onClick={() => {
							handleSortChange(key);
						}}
						className="flex h-[22px]"
					>
						{label}
						{sortBy === key ? (
							<SortIndicator sortType={sortType} />
						) : (
							<SortIndicator sortType={null} />
						)}
					</span>
				</div>
			))}
		</div>
	);
}

export default SortList;
