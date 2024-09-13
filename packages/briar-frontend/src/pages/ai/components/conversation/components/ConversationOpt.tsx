import { FileImageOutlined, FormOutlined } from '@ant-design/icons';
import { Popover, Radio, Select } from 'antd';
import { FC, useContext } from 'react';
import ConversationContext from '../../../context/conversation';
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
	} = useContext(ConversationContext);

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
				style={{ width: 120 }}
				onChange={onChange}
				options={options}
			/>
		</>
	);
};

export default ConversationOpt;
