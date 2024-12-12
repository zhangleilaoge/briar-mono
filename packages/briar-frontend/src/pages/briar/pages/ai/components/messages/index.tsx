import 'highlight.js/styles/atom-one-dark.css';

import { FC } from 'react';

import { useContainer } from '@/pages/briar/hooks/useContainer';

import { conversationContainer } from '../../container/conversationContainer';
import Message from '../message';
import useLoadingDesc from './hooks/useLoadingDesc';

const Messages: FC<{
	loading?: boolean;
}> = ({ loading }) => {
	const { desc } = useLoadingDesc();
	const { messageArr } = useContainer(conversationContainer);

	return (
		<>
			{messageArr.map((message, index) => {
				const imgList = message.imgList || [];
				if (index === messageArr.length - 1 && loading && !message.content) {
					return (
						<Message
							key={message.id}
							content={desc}
							role={message.role}
							imgList={imgList}
							date={new Date(message.createdAt).getTime()}
						/>
					);
				}
				return (
					<Message
						key={message.id}
						content={message.content}
						role={message.role}
						imgList={imgList}
						date={new Date(message.createdAt).getTime()}
					/>
				);
			})}
		</>
	);
};

export default Messages;
