export enum ThemeColor {
	selectedColor = '#84a8d6',
	textColor = '#0d1115',
	selectedBgColor = '#e6eef7',
	activeBgColor = '#eddde8'
}

export const THEME = {
	components: {
		Layout: {
			headerBg: '#fff'
		},
		Menu: {
			itemSelectedColor: ThemeColor.selectedColor,
			colorText: ThemeColor.textColor,
			itemSelectedBg: ThemeColor.selectedBgColor,
			itemActiveBg: ThemeColor.selectedBgColor,
			horizontalItemSelectedColor: ThemeColor.selectedColor
		},
		Spin: {
			colorPrimary: ThemeColor.selectedColor
		},
		Radio: {
			colorPrimary: ThemeColor.selectedColor,
			colorPrimaryHover: ThemeColor.selectedColor,
			buttonColor: ThemeColor.textColor
		},
		Button: {
			defaultColor: ThemeColor.textColor,
			defaultActiveColor: ThemeColor.selectedColor,
			defaultActiveBorderColor: ThemeColor.selectedColor,
			defaultActiveBg: ThemeColor.selectedBgColor,
			defaultHoverColor: ThemeColor.selectedColor,
			defaultHoverBorderColor: ThemeColor.selectedColor
		},
		Select: {
			colorText: ThemeColor.textColor,
			optionSelectedBg: ThemeColor.selectedBgColor,
			colorPrimaryHover: ThemeColor.selectedColor,
			colorPrimary: ThemeColor.selectedColor
		},
		Input: {
			colorText: ThemeColor.textColor,
			colorPrimary: ThemeColor.selectedColor,
			colorPrimaryHover: ThemeColor.selectedColor,
			activeShadow: `0 0 0 2px ${ThemeColor.selectedColor}1a`
		}
	}
};
