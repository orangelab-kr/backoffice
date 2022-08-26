import { InboxOutlined } from '@ant-design/icons';
import { Image, message } from 'antd';
import Dragger from 'antd/lib/upload/Dragger';

export const PhotoViewer = ({ image, setImage }) => {
  const endpoint =
    window.location.host === 'backoffice.hikick.kr'
      ? 'https://coreservice.hikick.kr/v1/images'
      : 'https://coreservice.staging.hikick.kr/v1/images';

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image');
    if (!isImage) message.error(`${file.name} 파일은 이미지가 아닙니다.`);
    return isImage;
  };

  const onChange = ({ file }) => {
    if (file.status !== 'done') return;
    if (file.response.opcode !== 0) return;
    setImage(file.response.url);
  };

  return (
    <div>
      {image ? (
        <Image src={image} width={100} alt='이미지를 로드할 수 없음' />
      ) : (
        <Dragger
          name='image'
          method='POST'
          multiple={false}
          action={endpoint}
          onChange={onChange}
          headers={{ Authorization: 'Bearer backoffice' }}
          beforeUpload={beforeUpload}
        >
          <div style={{ padding: '1.5em' }}>
            <p className='ant-upload-drag-icon'>
              <InboxOutlined />
            </p>
            <p className='ant-upload-text'>업로드</p>
            <p className='ant-upload-hint'>
              클릭하여 파일을 선택하거나 이미지를 이쪽으로 끌어오세요.
            </p>
          </div>
        </Dragger>
      )}
    </div>
  );
};
