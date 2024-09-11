import { Button, Checkbox, Dropdown, Input, InputRef, MenuProps, theme } from 'antd';
import s from './style.module.scss';
import {
	DeleteFilled,
	EditFilled,
	EllipsisOutlined,
	StarFilled,
	StarOutlined
} from '@ant-design/icons';
import { IConversationDTO } from 'briar-shared';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import ClickOutside from '@/components/ClickOutSide';
import ConversationContext from '../../context/conversation';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
// import StarCheckbox from '@/components/StarCheckBox';

enum OperationEnum {
	Edit = 'edit',
	Delete = 'delete',
	marked = 'marked',
	unmarked = 'unmarked'
}

export const MenuItem = ({
	conversation,
	deleteConversation,
	updateConversation
}: {
	conversation: IConversationDTO;
	deleteConversation: (id: number) => void;
	updateConversation: (_: IConversationDTO) => void;
}) => {
	const { title, marked } = conversation;
	const inputRef = useRef<InputRef>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [editValue, setEditValue] = useState(title || '');
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const { multiSelectMode, selectedConversationKeys, setSelectedConversationKeys } =
		useContext(ConversationContext);

	const checked = useMemo(() => {
		return selectedConversationKeys.includes(conversation.id);
	}, [conversation.id, selectedConversationKeys]);

	const conversationTitle = useMemo(() => {
		return title;
	}, [title]);
	const {
		token: { colorError }
	} = theme.useToken();

	const changeChecked = useCallback(
		(e: CheckboxChangeEvent) => {
			let keys = selectedConversationKeys;
			if (e.target.checked) {
				keys = [...keys, conversation.id];
			} else {
				keys = keys.filter((key: number) => key !== conversation.id);
			}
			setSelectedConversationKeys(keys);
		},
		[conversation.id, selectedConversationKeys, setSelectedConversationKeys]
	);

	const onMarkedChange = useCallback(() => {
		updateConversation({ ...conversation, marked: !conversation.marked });
	}, [conversation, updateConversation]);

	const finishEdit = useCallback(async () => {
		setIsEditing(false);
		await updateConversation({
			...conversation,
			title: editValue || conversationTitle
		});
	}, [conversation, conversationTitle, editValue, updateConversation]);

	const items: MenuProps['items'] = [
		{
			key: OperationEnum.Edit,
			label: (
				<div
					className={s.DropdownItem}
					onClick={(e) => {
						setIsEditing(true);
						setTimeout(() => {
							inputRef.current?.focus();
						});
						setDropdownOpen(false);
						e.stopPropagation();
					}}
				>
					<EditFilled />
					重命名
				</div>
			)
		},
		!marked && {
			key: OperationEnum.marked,
			label: (
				<div
					className={s.DropdownItem}
					onClick={(e) => {
						onMarkedChange();
						setDropdownOpen(false);
						e.stopPropagation();
					}}
				>
					<StarFilled />
					收藏
				</div>
			)
		},
		marked && {
			key: OperationEnum.unmarked,
			label: (
				<div
					className={s.DropdownItem}
					onClick={(e) => {
						onMarkedChange();
						setDropdownOpen(false);
						e.stopPropagation();
					}}
				>
					<StarOutlined />
					取消收藏
				</div>
			)
		},
		{
			key: OperationEnum.Delete,
			label: (
				<div
					className={s.DropdownItem}
					style={{ color: colorError }}
					onClick={(e) => {
						deleteConversation(conversation.id);
						setDropdownOpen(false);
						e.stopPropagation();
					}}
				>
					<DeleteFilled />
					删除
				</div>
			)
		}
	].filter(Boolean) as MenuProps['items'];

	useEffect(() => {
		setEditValue(conversationTitle || '');
	}, [conversationTitle]);

	return (
		<div className={s.Conversation}>
			<div className={s.ConversationContent}>
				{multiSelectMode ? (
					<Checkbox
						onChange={changeChecked}
						checked={checked}
						onClick={(e) => e.stopPropagation()}
					></Checkbox>
				) : (
					marked && (
						<StarFilled
							style={{
								color: 'rgb(242, 203, 81)'
							}}
						/>
					)
				)}
				{isEditing ? (
					<ClickOutside onClickOutside={finishEdit}>
						<Input
							onBlur={finishEdit}
							ref={inputRef}
							onChange={(e) => {
								setEditValue(e.target.value);
							}}
							value={editValue}
							onClick={(e) => e.stopPropagation()}
							onPressEnter={(e) => {
								e.stopPropagation();
								finishEdit();
							}}
						/>
					</ClickOutside>
				) : (
					<div className={s.ConversationTitle}>{conversationTitle}</div>
				)}
			</div>
			<Dropdown
				menu={{ items }}
				placement="bottomLeft"
				trigger={['click']}
				open={dropdownOpen}
				onOpenChange={setDropdownOpen}
			>
				<Button
					icon={<EllipsisOutlined className={s.EditConversation} />}
					type="text"
					onClick={(e) => e.stopPropagation()}
				></Button>
			</Dropdown>
		</div>
	);
};
