'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { FieldErrors } from 'react-hook-form';
import type { ZodIssue } from 'zod';

/* 扁平化后的错误 map：key 是 dotPath，value 是 message 数组 */
type ErrorMap = Record<string, string[]>;

const Ctx = createContext<ErrorMap>({});

/* 递归把 RHF 的 FieldErrors 转成 ZodIssue[] */
function fieldErrorsToZodIssues(obj: FieldErrors): ZodIssue[] {
	const issues: ZodIssue[] = [];

	function walk(node: any, prefix: string[] = []): void {
		if (!node || typeof node !== 'object') return;

		if (Array.isArray(node)) {
			node.forEach((n, idx) => walk(n, [...prefix, idx.toString()]));
			return;
		}

		// 叶子节点：RHF 把每个字段错误放在 { message, type, ref } 上
		if (node.message && node.type) {
			issues.push({
				code: node.type,
				path: prefix,
				message: node.message
			} as ZodIssue);
			return;
		}

		// 继续往下
		Object.entries(node).forEach(([key, child]) => {
			walk(child, [...prefix, key]);
		});
	}

	walk(obj);
	return issues;
}

/* 把 ZodIssue 数组转成 dotPath → messages */
function flattenIssues(issues: ZodIssue[]): ErrorMap {
	const map: ErrorMap = {};
	issues.forEach((i) => {
		const dotPath = i.path.join('.');
		if (!map[dotPath]) map[dotPath] = [];
		map[dotPath].push(i.message);
	});
	return map;
}

/* ---------- Provider ---------- */
export function FormErrorProvider({
	fieldErrors,
	children
}: {
	fieldErrors: FieldErrors; // 直接传 form.formState.errors
	children: React.ReactNode;
}) {
	const issues = useMemo(() => fieldErrorsToZodIssues(fieldErrors), [fieldErrors]);
	const map = useMemo(() => flattenIssues(issues), [issues]);

	return <Ctx.Provider value={map}>{children}</Ctx.Provider>;
}

/* ---------- Hook ---------- */
export function useFormFieldError(dotPath: string): string {
	const map = useContext(Ctx);
	const messages: string[] = [];

	// 自己
	if (map[dotPath]) messages.push(...map[dotPath]);

	// 所有子路径
	Object.keys(map).forEach((p) => {
		if (p.startsWith(dotPath + '.')) messages.push(...map[p]);
	});

	return messages.join('；');
}
