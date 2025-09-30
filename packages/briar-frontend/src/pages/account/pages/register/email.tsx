import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList
} from '@/components/ui/command';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// 常见邮箱后缀
const EMAIL_SUFFIXES = [
	'@qq.com',
	'@163.com',
	'@126.com',
	'@gmail.com',
	'@outlook.com',
	'@hotmail.com',
	'@sina.com',
	'@yahoo.com',
	'@foxmail.com'
];

interface EmailAutoCompleteProps {
	name?: string;
	label?: string;
	placeholder?: string;
	className?: string;
}

export function EmailAutoComplete({
	name = 'email',
	label = '邮箱地址',
	placeholder = '请输入邮箱地址',
	className
}: EmailAutoCompleteProps) {
	const { control, setValue, watch, trigger } = useFormContext();
	const [open, setOpen] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const inputRef = useRef<HTMLInputElement>(null);

	const currentEmail = watch(name) || '';

	// 根据输入生成建议
	useEffect(() => {
		if (inputValue.includes('@')) {
			// 如果已经包含@，进行精确匹配
			const [prefix, suffix] = inputValue.split('@');
			if (prefix && suffix) {
				const matchedSuffixes = EMAIL_SUFFIXES.filter((emailSuffix) =>
					emailSuffix.includes('@' + suffix)
				).map((emailSuffix) => prefix + emailSuffix);
				setSuggestions(matchedSuffixes);
			}
		} else {
			// 如果不包含@，生成所有常见邮箱建议
			const newSuggestions = EMAIL_SUFFIXES.map((suffix) => inputValue + suffix);
			setSuggestions(newSuggestions);
		}
	}, [inputValue]);

	// 处理输入变化
	const handleInputChange = (value: string) => {
		setInputValue(value);
		setValue(name, value, { shouldValidate: true });
	};

	// 选择建议项
	const handleSelectSuggestion = (suggestion: string) => {
		setInputValue(suggestion);
		setValue(name, suggestion, { shouldValidate: true });
		setOpen(false);
		trigger(name);
		inputRef.current?.focus();
	};

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={cn('space-y-2', className)}>
					<FormLabel>{label}</FormLabel>

					<Popover open={open} onOpenChange={setOpen}>
						<div className="relative">
							<FormControl>
								<Input
									{...field}
									ref={inputRef}
									value={inputValue}
									onChange={(e) => handleInputChange(e.target.value)}
									// onFocus={handleFocus}
									placeholder={placeholder}
									className="w-full"
								/>
							</FormControl>

							<PopoverTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
								>
									<ChevronDown className="h-4 w-4 opacity-50" />
								</Button>
							</PopoverTrigger>
						</div>

						<PopoverContent className="w-full p-0" align="start">
							<Command>
								<CommandInput placeholder="搜索邮箱后缀..." />
								<CommandList>
									<CommandEmpty>未找到匹配的邮箱地址</CommandEmpty>
									<CommandGroup heading="建议邮箱">
										{suggestions.slice(0, 5).map((suggestion, index) => (
											<CommandItem key={index} value={suggestion} onSelect={handleSelectSuggestion}>
												<Check
													className={cn(
														'mr-2 h-4 w-4',
														currentEmail === suggestion ? 'opacity-100' : 'opacity-0'
													)}
												/>
												{suggestion}
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>

					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export default EmailAutoComplete;
