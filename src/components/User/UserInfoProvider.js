import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { getClient } from '../../tools';
import { InfoProvider } from '../InfoProvider';

export const UserInfoProvider = ({ userId }) => {
  const onRequest = (userId) =>
    getClient('coreservice-accounts', true).then((c) =>
      c.get(`/users/${userId}`)
    );

  return (
    <InfoProvider
      onRequest={onRequest}
      dataId={userId}
      dataSourceKey="user"
      renderLoading={() => <>로딩 중...</>}
      renderFailed={() => <>조회 실패</>}
      render={({ userId, profileUrl, realname }) => (
        <Link to={`/users/${userId}`}>
          <Avatar
            size="small"
            src={profileUrl}
            icon={<UserOutlined />}
            style={{ marginRight: 5 }}
          />
          {realname}
        </Link>
      )}
    />
  );
};
