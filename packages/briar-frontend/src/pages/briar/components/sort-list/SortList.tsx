import { useCallback, useEffect, useState } from 'react';

import { ThemeColor } from '../../constants/styles';

interface SortListProps<T> {
	list: T[];
	setSortedList: (list: T[]) => void;
	sortByMap: { key: keyof T; label: string }[];
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
					className={`text-[8px] translate-y-[2px] scale-x-150`}
					style={{
						color: sortType === 'asc' ? ThemeColor.selectedColor : 'lightgrey'
					}}
				>
					▲
				</span>
				<span
					className={`text-[8px] translate-y-[-2px] scale-x-150`}
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

function SortList<T>({ list, setSortedList, sortByMap }: SortListProps<T>) {
	const [sortType, setSortType] = useState<'asc' | 'desc' | null>(null);
	const [sortBy, setSortBy] = useState<keyof T | null>(null);

	const handleSortChange = useCallback(
		(key: keyof T) => {
			const currentSortTypeIndex = sortTypeSeq.indexOf(sortType);
			const newSortType = sortTypeSeq[
				(currentSortTypeIndex + 1) % sortTypeSeq.length
			] as SortIndicatorProps['sortType'];
			if (sortBy === key) {
				// Toggle sort type
				setSortType(newSortType);
			} else {
				// Set new sort
				setSortBy(key);
				setSortType('desc'); // default to ascending
			}

			// Sort list based on selected sortBy and sortType
			const sortedList = [...list].sort((a, b) => {
				if (a[key] < b[key]) return newSortType === 'asc' ? -1 : 1;
				if (a[key] > b[key]) return newSortType === 'asc' ? 1 : -1;
				return 0;
			});

			newSortType ? setSortedList?.(sortedList) : setSortedList?.(list);
		},
		[list, setSortedList, sortBy, sortType]
	);

	useEffect(() => {
		setSortedList?.(list);
	}, [list, setSortedList]);

	return (
		<div className="cursor-pointer">
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
