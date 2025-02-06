import { FileImageOutlined, FormOutlined } from '@ant-design/icons';
import { Popover, Radio, Select } from 'antd';
import { FC } from 'react';

import { useContainer } from '@/pages/briar/hooks/useContainer';
import { conversationContainer } from '@/pages/briar/pages/ai/container/conversationContainer';

import useGptModel from '../hooks/useGptModel';
import s from '../style.module.scss';

type IConversationProps = ReturnType<typeof useGptModel>;

const ConversationOpt: FC<IConversationProps> = ({ selectOption, options, onChange }) => {
	const {
		setCurrentConversationKey,
		currentConversation,
		createImgMode,
		setCreateImgMode,
		setMessageArr
	} = useContainer(conversationContainer);

	const readyForNewChat = () => {
		setCurrentConversationKey(undefined);
		setMessageArr([]);
	};

	return (
		<>
			<div className={s.ConversationOptLeft}>
				<Popover content="创建新对话">
					<Radio.Group value={!currentConversation}>
						<Radio.Button onClick={readyForNewChat} value={true}>
							<FormOutlined />
						</Radio.Button>
					</Radio.Group>
				</Popover>
				<Popover content="生成图片">
					<Radio.Group value={createImgMode}>
						<Radio.Button
							onClick={() => {
								setCreateImgMode(!createImgMode);
							}}
							value={true}
						>
							<FileImageOutlined />
						</Radio.Button>
					</Radio.Group>
				</Popover>
			</div>
			<Select
				value={selectOption.value}
				style={{ width: 200 }}
				onChange={onChange}
				options={options}
				showSearch
			/>
		</>
	);
};

export default ConversationOpt;
