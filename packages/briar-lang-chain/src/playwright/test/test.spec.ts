/*
 * @Description:
 * @Author: zhanglei
 * @Date: 2025-03-31 17:31:38
 * @LastEditTime: 2025-03-31 17:31:38
 * @LastEditors: zhanglei
 * @Reference:
 */
import { test } from '@playwright/test';

test('Page Screenshot', async ({ page }) => {
	await page.goto('https://playwright.dev/');
	await page.screenshot({ path: `example.png` });
});
