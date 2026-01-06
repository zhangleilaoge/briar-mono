import { useCallback, useEffect, useRef, useState } from 'react';

const useScroll = (querySelectorStr: string) => {
	const dom = document.querySelector(querySelectorStr) as HTMLDivElement;
	const [isNearBottom, setIsNearBottom] = useState(false);
	const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
	const timeoutRef = useRef<number | null>(null);
	const scrollTopRef = useRef<number>(0);

	const forbidAutoScroll = () => {
		setIsAutoScrollEnabled(false);

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		// 一段时间后恢复自动滚动
		timeoutRef.current = setTimeout(() => {
			setIsAutoScrollEnabled(true);
		}, 1000) as unknown as number;
	};

	const quickScrollToTop = () => {
		if (dom) {
			const tempScrollBehavior = dom.style.scrollBehavior;

			dom.style.scrollBehavior = 'auto';
			dom.scrollTop = 0;
			dom.style.scrollBehavior = tempScrollBehavior;
		}
	};

	const scrollToBottom = () => {
		// 禁用滚动期间触发自动滚动，延长禁用时间
		if (!isAutoScrollEnabled) {
			forbidAutoScroll();
			return;
		}

		setTimeout(() => {
			if (dom) {
				dom.scrollTop = dom.scrollHeight;
			}
		}, 100);
	};

	const handleScroll = useCallback(() => {
		if (dom) {
			// 离底部一个父组件的高度，认为远离底部
			if (dom.scrollHeight - dom.scrollTop > 2 * dom.clientHeight) {
				setIsNearBottom(true);
			} else {
				setIsNearBottom(false);
			}

			// 反向滚动，视为用户暂时不想启用自动滚动功能，因此暂时禁用自动滚动
			if (scrollTopRef.current > dom.scrollTop && isAutoScrollEnabled) {
				forbidAutoScroll();
			}

			scrollTopRef.current = dom.scrollTop;
		}
	}, [dom, isAutoScrollEnabled]);

	useEffect(() => {
		if (dom) {
			dom.onscroll = handleScroll;
		}
	}, [dom, handleScroll]);

	useEffect(() => {
		return () => {
			if (dom) {
				dom.onscroll = null; // 清除事件监听器
			}
			// 清除定时器
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [dom]);

	return {
		scrollToBottom,
		quickScrollToTop,
		isNearBottom
	};
};

export default useScroll;
