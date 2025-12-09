import { useCallback, useEffect, useState } from 'react';

export default function useAsideWidth(initialWidth = 168, minWidth = 58, maxOffset = 100) {
	const [asideWidth, setAsideWidth] = useState(initialWidth);
	const [dragging, setDragging] = useState(false);

	const handleMouseDown = (_e: React.MouseEvent<HTMLDivElement>) => {
		setDragging(true);
		document.body.style.cursor = 'ew-resize';
	};

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!dragging) return;
			let newWidth = e.clientX;
			if (newWidth < minWidth) newWidth = minWidth;
			if (newWidth > window.innerWidth - maxOffset) newWidth = window.innerWidth - maxOffset;
			setAsideWidth(newWidth);
		},
		[dragging, minWidth, maxOffset]
	);

	const handleMouseUp = () => {
		setDragging(false);
		document.body.style.cursor = '';
	};

	useEffect(() => {
		if (dragging) {
			window.addEventListener('mousemove', handleMouseMove);
			window.addEventListener('mouseup', handleMouseUp);
		} else {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
		}
		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
		};
	}, [dragging, handleMouseMove]);

	return { asideWidth, handleMouseDown };
}
