import { Upload, UploadProps } from 'antd';
import ImgCrop from 'antd-img-crop';

const CropUpload = (
	props: React.PropsWithChildren<UploadProps<any>> & React.RefAttributes<any>
) => (
	<ImgCrop rotationSlider>
		<Upload {...props} />
	</ImgCrop>
);

export default CropUpload;
