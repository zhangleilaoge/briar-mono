export enum SearchDialogStateTag {
	AddRepo = 'add-repo',
	SearchFile = 'search-file',
	SearchFileContent = 'search-file-content',
	SwitchBranch = 'switch-branch'
}

export const SearchDialogStateTagName = {
	[SearchDialogStateTag.AddRepo]: '添加仓库',
	[SearchDialogStateTag.SearchFile]: '搜索文件',
	[SearchDialogStateTag.SearchFileContent]: '搜索文件内容',
	[SearchDialogStateTag.SwitchBranch]: '切换分支'
};
