import { IConversationDTO, RoleEnum, safeJsonParse } from 'briar-shared';
import { FC, useContext, useEffect, useState } from 'react';
import s from './style.module.scss';
import { CheckCircleFilled, CopyOutlined } from '@ant-design/icons';
import useLoadingDesc from './hooks/useLoadingDesc';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import { copyToClipboard } from '@/utils/document';
import { Avatar, Button, message, Skeleton } from 'antd';
import ReactDOM from 'react-dom';
import ConversationContext from '../../context/conversation';
import { format } from 'date-fns';

const BRIAR_PROFILE =
	'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/121280494_p0_master1200.jpg';

const CopyBtn = ({ content }: { content: string }) => {
	const [copied, setCopied] = useState(false);

	return (
		<Button
			type="text"
			className={s.CopyBtn}
			icon={copied ? <CheckCircleFilled /> : <CopyOutlined />}
			onClick={async () => {
				await copyToClipboard(content);
				message.success('复制成功');
				setCopied(true);
			}}
			onMouseLeave={() => {
				setTimeout(() => {
					setCopied(false);
				}, 5000);
			}}
		></Button>
	);
};

const Img = ({ url }: { url: string }) => {
	const [loadStatus, setLoadStatus] = useState(false);
	return (
		<>
			{!loadStatus && <Skeleton.Image active key={url} className={s.Img} />}
			<img
				src={url}
				alt="img"
				className={`${s.Img} ${loadStatus ? '' : s.HideImg}`}
				onLoad={() => {
					setLoadStatus(true);
				}}
			/>
		</>
	);
};

const Message: FC<{
	content: string;
	role: RoleEnum;
	date: number;
	imgList?: string[];
}> = ({ content, role, date, imgList }) => {
	const isUser = role === RoleEnum.User;

	// 复制代码功能
	useEffect(() => {
		const codeBlocks = document.querySelectorAll(`pre`);

		codeBlocks.forEach((block) => {
			let button = block.querySelector(`.${s.CopyButton}`);
			if (button) {
				return;
			}
			button = document.createElement('div');
			button.className = s.CopyButton;

			// eslint-disable-next-line react/no-deprecated
			ReactDOM.render(<CopyBtn content={block.textContent || ''} />, button);

			block.appendChild(button);
		});

		return () => {
			codeBlocks.forEach((block) => {
				const button = block.querySelector(`.${s.CopyButton}`);
				if (button) {
					block.removeChild(button);
				}
			});
		};
	}, [content]);

	return (
		<div className={`${s.Message} ${isUser ? s.User : s.Assistant}`}>
			{!isUser && <Avatar size={54} src={BRIAR_PROFILE} />}
			<div>
				<div className={s.Date}>{format(date, 'yyyy-MM-dd HH:mm:ss')}</div>
				<div className={`${s.Content}`}>
					{isUser ? (
						content || ''
					) : (
						<Markdown rehypePlugins={[rehypeHighlight]}>{content || ' '}</Markdown>
					)}
					{imgList?.map((url) => {
						return <Img url={url} key={url} />;
					})}
				</div>
			</div>
		</div>
	);
};

const Messages: FC<{
	conversation?: IConversationDTO;
	loading?: boolean;
}> = ({ loading }) => {
	const { desc } = useLoadingDesc();
	const { messageArr } = useContext(ConversationContext);

	return (
		<>
			{messageArr.map((message, index) => {
				const imgList = message.imgList ? safeJsonParse(message.imgList) : [];
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
