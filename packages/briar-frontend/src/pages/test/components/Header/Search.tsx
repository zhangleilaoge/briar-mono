'use client';

import { Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
	CommandShortcut
} from '@/components/ui/command';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';

import { SearchDialogStateTag, SearchDialogStateTagName } from '../../types/searchDialogState';
import BranchList, { BranchInfo } from './BranchList';
import FileSearchList from './FileSearchList';

const COMMAND_ENTRIES = [
	{
		value: SearchDialogStateTag.AddRepo,
		label: SearchDialogStateTagName[SearchDialogStateTag.AddRepo],
		description: '在工作区中添加仓库',
		shortcut: '⌃ + r'
	},
	{
		value: SearchDialogStateTag.SearchFile,
		label: SearchDialogStateTagName[SearchDialogStateTag.SearchFile],
		description: '按文件名搜索项目中的文件',
		shortcut: '⌘ + p '
	},
	{
		value: SearchDialogStateTag.SearchFileContent,
		label: SearchDialogStateTagName[SearchDialogStateTag.SearchFileContent],
		description: '按文件内容搜索项目中的文件',
		shortcut: '⌘ + shift + f'
	},
	{
		value: SearchDialogStateTag.SwitchBranch,
		label: SearchDialogStateTagName[SearchDialogStateTag.SwitchBranch],
		description: '切换当前仓库的分支',
		shortcut: '⌃ + b'
	}
];

const RECENT_REPOSITORIES: Array<{ groups: string[]; name: string; history?: boolean }> = [
	{ groups: ['fe'], name: 'echo-manage', history: true },
	{ groups: ['fe'], name: 'garden-echo', history: true },
	{ groups: ['fe'], name: 'echo-ai' },
	{ groups: ['retail-web'], name: 'echo-pulse' }
];

export interface HeaderSearchTriggerProps {
	open?: boolean;
	seedTags?: string[];
	seedKey?: number;
	onTriggerOpen?: () => void;
	closeSearchDialog?: () => void;
}

export default function HeaderSearchTrigger({
	open,
	seedTags = [],
	seedKey,
	onTriggerOpen,
	closeSearchDialog
}: HeaderSearchTriggerProps) {
	const [tags, setTags] = useState<string[]>([]);
	const [inputValue, setInputValue] = useState('');
	const [isTagEditing, setIsTagEditing] = useState(false);
	const [tagDraft, setTagDraft] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);
	const [selectedRepo, setSelectedRepo] = useState('');

	const dialogOpen = open ?? false;
	const setDialogOpen = useCallback(
		(value: boolean) => {
			if (!value) {
				closeSearchDialog?.();
			}
		},
		[closeSearchDialog]
	);

	const handleSelectCommandAsTag = useCallback((value: string) => {
		setTags((current) => [...current, value]);
		setInputValue('');
		inputRef.current?.focus();
	}, []);

	const commands = useMemo(() => COMMAND_ENTRIES, []);

	useEffect(() => {
		if (seedKey === undefined) {
			return;
		}
		console.log('HeaderSearchTrigger seedKey changed:', seedKey, seedTags);
		setTags(seedTags);
		setInputValue('');
		setIsTagEditing(false);
		setTagDraft('');
	}, [seedKey, seedTags]);

	// tags变更时重置selectedRepo
	useEffect(() => {
		if (tags.includes(SearchDialogStateTag.SwitchBranch)) {
			setSelectedRepo('echo-manage'); // mock activeRepo
		} else {
			setSelectedRepo('all');
		}
	}, [tags]);

	useEffect(() => {
		if (!dialogOpen) {
			setInputValue('');
			setIsTagEditing(false);
			setTagDraft('');
		}
	}, [dialogOpen]);

	const finalizeTag = useCallback(
		(value?: string) => {
			const trimmed = (value ?? tagDraft).trim();
			if (trimmed) {
				setTags((current) => [...current, trimmed]);
			}
			setTagDraft('');
			setIsTagEditing(false);
		},
		[tagDraft]
	);

	const handleTriggerOpen = () => {
		onTriggerOpen?.();
		setDialogOpen(true);
	};

	const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (!isTagEditing && e.key === '/') {
			setIsTagEditing(true);
			setTagDraft('');
			e.preventDefault();
			return;
		}

		if (isTagEditing) {
			if (
				e.key === ' ' ||
				e.key === 'Tab' ||
				e.key === 'Enter' ||
				(e.key === 'Backspace' && tagDraft === '')
			) {
				finalizeTag();
				e.preventDefault();
			}
			return;
		}

		if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
			setTags((current) => current.slice(0, -1));
			e.preventDefault();
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (isTagEditing) {
			setTagDraft(e.target.value);
		} else {
			setInputValue(e.target.value);
		}
	};

	const handleRemoveTag = (idx: number) => {
		setTags((current) => current.filter((_, i) => i !== idx));
		inputRef.current?.focus();
	};
	const showRepoSelector = useMemo(() => {
		return (
			tags.includes(SearchDialogStateTag.SearchFile) ||
			tags.includes(SearchDialogStateTag.SearchFileContent) ||
			tags.includes(SearchDialogStateTag.SwitchBranch)
		);
	}, [tags]);
	const repoOptions = RECENT_REPOSITORIES.map((repo) => ({
		value: repo.name,
		label: `${repo.groups.join(' / ')} / ${repo.name}`
	}));

	const renderMenu = () => {
		if (tags.includes(SearchDialogStateTag.AddRepo)) {
			// ...原有代码...
			return (
				<CommandList>
					<CommandGroup heading="">
						{RECENT_REPOSITORIES.map((repo, idx) => (
							<CommandItem key={idx} value={repo.name}>
								<div className="flex items-center justify-between w-full">
									<div className="flex items-center text-left">
										<span className="text-xs text-muted-foreground">{repo.groups.join(' / ')}</span>
										&nbsp;&nbsp;/&nbsp;&nbsp;
										<span className="text-sm font-semibold text-black">{repo.name}</span>
									</div>
									{repo.history && (
										<Badge
											className="text-xs px-2 py-0.5 border ml-2"
											style={{
												background: '#fde9f0',
												color: '#952d52',
												borderColor: '#952d52'
											}}
										>
											历史搜索
										</Badge>
									)}
								</div>
							</CommandItem>
						))}
					</CommandGroup>
				</CommandList>
			);
		}
		if (tags.includes(SearchDialogStateTag.SearchFile)) {
			// ...原有代码...
			const fileList = [
				{
					name: 'main.ts',
					repo: 'echo-manage',
					path: 'src/pages/main.ts',
					code: 'export const main = () => {}'
				},
				{
					name: 'index.tsx',
					repo: 'garden-echo',
					path: 'src/components/index.tsx',
					code: 'export default function Index() { return <div>Hello</div> }'
				},
				{
					name: 'utils.js',
					repo: 'echo-ai',
					path: 'src/lib/utils.js',
					code: 'function add(a, b) { return a + b; }'
				}
			];
			return <FileSearchList files={fileList} showPreview={false} />;
		}
		if (tags.includes(SearchDialogStateTag.SearchFileContent)) {
			// ...原有代码...
			const fileList = [
				{
					name: 'main.ts',
					repo: 'echo-manage',
					path: 'src/pages/main.ts',
					code: 'export const main = () => {\n  // 这里是main.ts的内容\n}\nexport const main = () => {\n  // 这里是main.ts的内容\n}'
				},
				{
					name: 'service.ts',
					repo: 'garden-echo',
					path: 'src/services/service.ts',
					code: 'export function fetchData() {\n  // 这里是service.ts的内容\n}'
				},
				{
					name: 'api.js',
					repo: 'echo-ai',
					path: 'src/api/api.js',
					code: 'export function callApi() {\n  // 这里是api.js的内容\n}'
				}
			];
			return <FileSearchList files={fileList} showPreview={true} inputValue={inputValue} />;
		}
		if (tags.includes(SearchDialogStateTag.SwitchBranch)) {
			// mock 当前 repo 和分支列表
			// const activeRepo = 'echo-manage';
			const branchList: BranchInfo[] = [
				{ name: 'main', commit: 'a1b2c3d', commitMsg: 'Initial commit', author: 'Alice' },
				{ name: 'dev', commit: 'd4e5f6g', commitMsg: '开发分支更新', author: 'Bob' },
				{ name: 'feature/search', commit: 'h7i8j9k', commitMsg: '新增搜索功能', author: 'Carol' },
				{ name: 'bugfix/login', commit: 'l0m1n2o', commitMsg: '修复登录bug', author: 'Dave' },
				{ name: 'release/v1.0.0', commit: 'p3q4r5s', commitMsg: '发布v1.0.0版本', author: 'Eve' },
				{ name: 'hotfix/urgent', commit: 't6u7v8w', commitMsg: '紧急修复', author: 'Frank' }
			];
			// 分支筛选
			const keyword = inputValue.trim();
			const re = keyword ? new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') : null;
			const filteredBranches = keyword
				? branchList.filter(
						(b) =>
							re!.test(b.name) || re!.test(b.commit) || re!.test(b.commitMsg) || re!.test(b.author)
					)
				: branchList;
			return <BranchList branches={filteredBranches} inputValue={inputValue} />;
		}

		// ...原有快捷入口逻辑...
		const keyword = inputValue.trim();
		const normalized = keyword.toLowerCase();
		const filteredCommands = keyword
			? commands.filter(
					(cmd) =>
						cmd.value.toLowerCase().includes(normalized) ||
						cmd.label.toLowerCase().includes(normalized)
				)
			: commands;

		return (
			<CommandList>
				<CommandGroup heading="快捷入口">
					{filteredCommands.map((command) => (
						<CommandItem
							key={command.value}
							value={command.value}
							onSelect={() => handleSelectCommandAsTag(command.value)}
						>
							<div className="flex flex-col text-left leading-tight">
								<span className="text-sm font-medium text-foreground">{command.label}</span>
								<span className="text-xs text-muted-foreground">{command.description}</span>
							</div>
							<CommandShortcut>{command.shortcut}</CommandShortcut>
						</CommandItem>
					))}
				</CommandGroup>
				<CommandEmpty>暂无可用命令</CommandEmpty>
			</CommandList>
		);
	};

	return (
		<>
			<CommandDialog open={dialogOpen} onOpenChange={setDialogOpen} showClose={false}>
				<div className="relative px-4 pt-4 pb-2">
					<div className="flex items-center w-full">
						<div className="flex items-center w-full h-10 rounded-md border border-[#e5e7eb] bg-white px-2 text-sm focus-within:border-[#85a9ff] transition">
							{tags.map((tag, idx) => (
								<Badge
									key={idx}
									className="flex items-center gap-1 px-2 py-0.5 text-xs font-semibold mr-1 bg-[#b7446a] hover:bg-[#b7446a]"
								>
									{SearchDialogStateTagName[tag as SearchDialogStateTag] || tag}
									<button
										className="text-xs font-bold leading-none opacity-70 hover:opacity-100 ml-1 rounded"
										style={{ background: 'none', border: 'none', cursor: 'pointer' }}
										onClick={(e) => {
											e.preventDefault();
											handleRemoveTag(idx);
										}}
										aria-label="删除tag"
										tabIndex={-1}
									>
										×
									</button>
								</Badge>
							))}
							<input
								ref={inputRef}
								type="text"
								value={isTagEditing ? tagDraft : inputValue}
								onChange={handleInputChange}
								onKeyDown={handleInputKeyDown}
								placeholder={
									isTagEditing ? 'tag 编辑中…（空格结束）' : tags.length ? '' : '输入关键词...'
								}
								className="flex-1 h-full bg-transparent border-none outline-none text-sm min-w-[40px]"
								autoFocus
							/>
						</div>
						{showRepoSelector && (
							<div className="ml-2 min-w-[140px]">
								<Select
									value={selectedRepo}
									onValueChange={setSelectedRepo}
									disabled={tags.includes(SearchDialogStateTag.SwitchBranch)}
								>
									<SelectTrigger className="h-10">
										<SelectValue placeholder="全部仓库" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">全部仓库</SelectItem>
										{repoOptions.map((opt) => (
											<SelectItem key={opt.value} value={opt.value}>
												{opt.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}
					</div>
				</div>
				{renderMenu()}
			</CommandDialog>

			<div
				role="button"
				tabIndex={0}
				onKeyDown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						event.preventDefault();
						handleTriggerOpen();
					}
				}}
				onClick={handleTriggerOpen}
				className="flex w-full flex-1 items-center justify-center gap-2 rounded transition duration-200 ease-out hover:scale-[1.02] hover:text-[#7f7f7f] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] cursor-pointer"
			>
				<Search className="text-[#A3A3A3] h-3 w-3" />
				<span
					className="text-[12px] leading-[1.66em] text-[#A3A3A3]"
					style={{
						fontFamily:
							'PingFang SC, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
					}}
				>
					搜索
				</span>
			</div>
		</>
	);
}
