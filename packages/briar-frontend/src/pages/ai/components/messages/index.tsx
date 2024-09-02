import { IConversation, RoleEnum } from 'briar-shared';
import { FC, useEffect, useState } from 'react';
import s from './style.module.scss';
import { CheckCircleFilled, CopyOutlined } from '@ant-design/icons';
import useLoadingDesc from './hooks/useLoadingDesc';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import { copyToClipboard } from '@/utils/document';
import { Avatar, Button, message } from 'antd';
import ReactDOM from 'react-dom';
import { format } from 'date-fns/format';

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

const Message: FC<{
	content: string;
	role: RoleEnum;
	date: number;
}> = ({ content, role, date }) => {
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
				</div>
			</div>
		</div>
	);
};

const Messages: FC<{
	conversation?: IConversation;
	loading?: boolean;
}> = ({ conversation, loading }) => {
	const { desc } = useLoadingDesc();
	const messages = conversation?.messages || [];

	return (
		<>
			{messages.map((message, index) => {
				if (index === messages.length - 1 && loading && !message.content) {
					return (
						<Message
							key={message.created}
							content={desc}
							role={message.role}
							date={message.created}
						/>
					);
				}
				return (
					<Message
						key={message.created}
						content={message.content}
						role={message.role}
						date={message.created}
					/>
				);
			})}
		</>
	);
};

export default Messages;

const logsuceesData = {
	Ca: '115144948023149492813',
	xc: {
		token_type: 'Bearer',
		access_token:
			'ya29.a0AcM612yfuaMnfilH7a_PF1-GczbbUhX3aCXM8cIOxu62j3lrwNls17H0CnipTjDYIvfGQYuYoJFY957uLtVy6tH3T-LtC3CqF64swtTAco_jIwQE7u7stU6kDAu6MIbjIz14jiYR44PmU6ru4ECQ4BHgLvJvigmaDwaCgYKAbISARESFQHGX2MidZv0GLgXQ7oSN0f0TH3i4w0169',
		scope:
			'email profile openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
		login_hint:
			'AJDLj6LrL0gxwrpXOqvp4e6jmLOkjPlhbYE5l7VK5VPX_1OAvm5jT3G2GO3T5K26foFqWwSqlcegT-aufjP89S6OQdW7NuyJlb814-GDJfakKRkXfeX-_1Q',
		expires_in: 3599,
		id_token:
			'eyJhbGciOiJSUzI1NiIsImtpZCI6ImIyZjgwYzYzNDYwMGVkMTMwNzIxMDFhOGI0MjIwNDQzNDMzZGIyODIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNDc0MzQ1MDM1OTU2LXIxY2JpZmZpdGJtbTg2OXNlOGx0b2g4OG5ubW40cG4yLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNDc0MzQ1MDM1OTU2LXIxY2JpZmZpdGJtbTg2OXNlOGx0b2g4OG5ubW40cG4yLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE1MTQ0OTQ4MDIzMTQ5NDkyODEzIiwiZW1haWwiOiJ6aGFuZ2xlaWxhb2dlQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoibEo3bm93SHJXV29RTUdSVGhSWHFTQSIsIm5iZiI6MTcyNTAzNjYwMCwibmFtZSI6IuW8oOejiiIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLemw3Ui1sZE92S1ptV3pNeG5YOGxNMmNtczZtbndxNDZQd2dObUtrM0JWQ29Pcmc9czk2LWMiLCJnaXZlbl9uYW1lIjoi56OKIiwiZmFtaWx5X25hbWUiOiLlvKAiLCJpYXQiOjE3MjUwMzY5MDAsImV4cCI6MTcyNTA0MDUwMCwianRpIjoiYzE0Mzg3ZDhmMDMyOWMyMzRkZDZhOGIzNGZlMDIxNWI5N2NlMWUxNSJ9.K31yhRQ1WwMx9NJt1J619J6aaLKBVXvlZ5UlT2iOnt737boSINmLMPpsSQmKtLBmXGFH1CaPdGHJidO08gWa8B4I2XbigHHPnicZScrGrKvyuXLqUAmuf0jxjt3sn7TZQ9NlkYG1bX0PLyAg4IMhhvsrQXhTfzggRR6lG58w0VLOeLndDROv4xnp1YTCgJfTBGFcLoN8h0JB69FZyzPsagWdFlG6Y2RADlTZjTak1m53vvidMMUvy6BSIPxlBsxmkqmxlG3Z3oFkGZa11gsdNrq1rMPYA8eC0r77jlq2EDdm4eebZ3yySmocnXUWRrdMU5CesidK23w34FHyI6SDAQ',
		session_state: {
			extraQueryParams: {
				authuser: '0'
			}
		},
		first_issued_at: 1725036889728,
		expires_at: 1725040488728,
		idpId: 'google'
	},
	wt: {
		NT: '115144948023149492813',
		Ad: '张磊',
		rV: '磊',
		uT: '张',
		hK: 'https://lh3.googleusercontent.com/a/ACg8ocKzl7R-ldOvKZmWzMxnX8lM2cms6mnwq46PwgNmKk3BVCoOrg=s96-c',
		cu: 'zhangleilaoge@gmail.com'
	},
	googleId: '115144948023149492813',
	tokenObj: {
		token_type: 'Bearer',
		access_token:
			'ya29.a0AcM612yfuaMnfilH7a_PF1-GczbbUhX3aCXM8cIOxu62j3lrwNls17H0CnipTjDYIvfGQYuYoJFY957uLtVy6tH3T-LtC3CqF64swtTAco_jIwQE7u7stU6kDAu6MIbjIz14jiYR44PmU6ru4ECQ4BHgLvJvigmaDwaCgYKAbISARESFQHGX2MidZv0GLgXQ7oSN0f0TH3i4w0169',
		scope:
			'email profile openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
		login_hint:
			'AJDLj6LrL0gxwrpXOqvp4e6jmLOkjPlhbYE5l7VK5VPX_1OAvm5jT3G2GO3T5K26foFqWwSqlcegT-aufjP89S6OQdW7NuyJlb814-GDJfakKRkXfeX-_1Q',
		expires_in: 3599,
		id_token:
			'eyJhbGciOiJSUzI1NiIsImtpZCI6ImIyZjgwYzYzNDYwMGVkMTMwNzIxMDFhOGI0MjIwNDQzNDMzZGIyODIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNDc0MzQ1MDM1OTU2LXIxY2JpZmZpdGJtbTg2OXNlOGx0b2g4OG5ubW40cG4yLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNDc0MzQ1MDM1OTU2LXIxY2JpZmZpdGJtbTg2OXNlOGx0b2g4OG5ubW40cG4yLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE1MTQ0OTQ4MDIzMTQ5NDkyODEzIiwiZW1haWwiOiJ6aGFuZ2xlaWxhb2dlQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoibEo3bm93SHJXV29RTUdSVGhSWHFTQSIsIm5iZiI6MTcyNTAzNjYwMCwibmFtZSI6IuW8oOejiiIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLemw3Ui1sZE92S1ptV3pNeG5YOGxNMmNtczZtbndxNDZQd2dObUtrM0JWQ29Pcmc9czk2LWMiLCJnaXZlbl9uYW1lIjoi56OKIiwiZmFtaWx5X25hbWUiOiLlvKAiLCJpYXQiOjE3MjUwMzY5MDAsImV4cCI6MTcyNTA0MDUwMCwianRpIjoiYzE0Mzg3ZDhmMDMyOWMyMzRkZDZhOGIzNGZlMDIxNWI5N2NlMWUxNSJ9.K31yhRQ1WwMx9NJt1J619J6aaLKBVXvlZ5UlT2iOnt737boSINmLMPpsSQmKtLBmXGFH1CaPdGHJidO08gWa8B4I2XbigHHPnicZScrGrKvyuXLqUAmuf0jxjt3sn7TZQ9NlkYG1bX0PLyAg4IMhhvsrQXhTfzggRR6lG58w0VLOeLndDROv4xnp1YTCgJfTBGFcLoN8h0JB69FZyzPsagWdFlG6Y2RADlTZjTak1m53vvidMMUvy6BSIPxlBsxmkqmxlG3Z3oFkGZa11gsdNrq1rMPYA8eC0r77jlq2EDdm4eebZ3yySmocnXUWRrdMU5CesidK23w34FHyI6SDAQ',
		session_state: {
			extraQueryParams: {
				authuser: '0'
			}
		},
		first_issued_at: 1725036889728,
		expires_at: 1725040488728,
		idpId: 'google'
	},
	tokenId:
		'eyJhbGciOiJSUzI1NiIsImtpZCI6ImIyZjgwYzYzNDYwMGVkMTMwNzIxMDFhOGI0MjIwNDQzNDMzZGIyODIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNDc0MzQ1MDM1OTU2LXIxY2JpZmZpdGJtbTg2OXNlOGx0b2g4OG5ubW40cG4yLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNDc0MzQ1MDM1OTU2LXIxY2JpZmZpdGJtbTg2OXNlOGx0b2g4OG5ubW40cG4yLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE1MTQ0OTQ4MDIzMTQ5NDkyODEzIiwiZW1haWwiOiJ6aGFuZ2xlaWxhb2dlQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoibEo3bm93SHJXV29RTUdSVGhSWHFTQSIsIm5iZiI6MTcyNTAzNjYwMCwibmFtZSI6IuW8oOejiiIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLemw3Ui1sZE92S1ptV3pNeG5YOGxNMmNtczZtbndxNDZQd2dObUtrM0JWQ29Pcmc9czk2LWMiLCJnaXZlbl9uYW1lIjoi56OKIiwiZmFtaWx5X25hbWUiOiLlvKAiLCJpYXQiOjE3MjUwMzY5MDAsImV4cCI6MTcyNTA0MDUwMCwianRpIjoiYzE0Mzg3ZDhmMDMyOWMyMzRkZDZhOGIzNGZlMDIxNWI5N2NlMWUxNSJ9.K31yhRQ1WwMx9NJt1J619J6aaLKBVXvlZ5UlT2iOnt737boSINmLMPpsSQmKtLBmXGFH1CaPdGHJidO08gWa8B4I2XbigHHPnicZScrGrKvyuXLqUAmuf0jxjt3sn7TZQ9NlkYG1bX0PLyAg4IMhhvsrQXhTfzggRR6lG58w0VLOeLndDROv4xnp1YTCgJfTBGFcLoN8h0JB69FZyzPsagWdFlG6Y2RADlTZjTak1m53vvidMMUvy6BSIPxlBsxmkqmxlG3Z3oFkGZa11gsdNrq1rMPYA8eC0r77jlq2EDdm4eebZ3yySmocnXUWRrdMU5CesidK23w34FHyI6SDAQ',
	accessToken:
		'ya29.a0AcM612yfuaMnfilH7a_PF1-GczbbUhX3aCXM8cIOxu62j3lrwNls17H0CnipTjDYIvfGQYuYoJFY957uLtVy6tH3T-LtC3CqF64swtTAco_jIwQE7u7stU6kDAu6MIbjIz14jiYR44PmU6ru4ECQ4BHgLvJvigmaDwaCgYKAbISARESFQHGX2MidZv0GLgXQ7oSN0f0TH3i4w0169',
	profileObj: {
		googleId: '115144948023149492813',
		imageUrl:
			'https://lh3.googleusercontent.com/a/ACg8ocKzl7R-ldOvKZmWzMxnX8lM2cms6mnwq46PwgNmKk3BVCoOrg=s96-c',
		email: 'zhangleilaoge@gmail.com',
		name: '张磊',
		givenName: '磊',
		familyName: '张'
	}
};
