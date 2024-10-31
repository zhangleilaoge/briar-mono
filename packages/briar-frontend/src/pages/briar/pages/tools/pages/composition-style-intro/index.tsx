import { GithubOutlined, RightOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

import { MenuKeyEnum } from '@/pages/briar/constants/router';

import { VUE_CODE_CONVERTER_GITHUB_URL } from '../../constants';
import s from './style.module.scss';
const CompositionApiIntro = () => {
	const navigate = useNavigate();
	const start = () => {
		navigate(`/${MenuKeyEnum.Tools_1}/${MenuKeyEnum.CompositionStyleConverter_3}`);
	};

	return (
		<div className={s.IntroContainer}>
			<div className={s.Intro}>
				<h1>vue-code-converter 🔨</h1>
				<div className={s.ButtonContainer}>
					<Button
						type="primary"
						size="large"
						icon={<RightOutlined />}
						iconPosition="end"
						shape="round"
						onClick={start}
					>
						get Started
					</Button>
					<Button
						size="large"
						href={VUE_CODE_CONVERTER_GITHUB_URL}
						icon={<GithubOutlined />}
						iconPosition="end"
						shape="round"
						target="_blank"
					>
						github
					</Button>
				</div>
				<h3>一、简介</h3>
				<p>
					一个用于将 vue2-option-style 和 vue2-Decorate-style 转换为 composition-api-style
					的代码转换工具。
				</p>
				<h3>二、相关链接</h3>
				<p>
					<a href="https://github.com/kaorun343/vue-property-decorator">
						vue-property-decorator github 仓库
					</a>
				</p>
				<p>
					<a href="https://github.com/vuejs/composition-api">composition-api github 仓库</a>
				</p>

				<h3>三、转换示例</h3>
				<div className={s.ImgContainer}>
					<h4>from:</h4>
					<img src="https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/carbon%20(2).png" />
					<h4>to:</h4>
					<img src="https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/carbon%20(1).png" />
				</div>
			</div>
		</div>
	);
};

export default CompositionApiIntro;
