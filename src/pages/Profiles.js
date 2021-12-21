import { ProfileOutlined } from '@ant-design/icons';
import { Button, Checkbox, Tag } from 'antd';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { BackofficeTable } from '../components';
import { getClient } from '../tools';

export const Profiles = () => {
  const NumberView = (unit) => (value) =>
    value ? `${value.toLocaleString()}${unit || ''}` : '없음';
  const BooleanView = () => (value) => <Checkbox disabled checked={value} />;

  const columns = [
    {
      title: '이름',
      dataIndex: 'name',
      render: (name, { profileId }) => (
        <Link to={`/profiles/${profileId}`}>{name}</Link>
      ),
    },
    {
      title: '최대 속도',
      dataIndex: 'speed',
      render: NumberView('KM'),
    },
    {
      title: '우선순위',
      dataIndex: 'priority',
      render: NumberView(),
    },
    {
      title: '지오펜스 색상',
      dataIndex: 'color',
      render: (color) => (
        <Tag
          children={color}
          style={{
            backgroundColor: color,
            borderColor: color.substring(0, 7),
            color: 'black',
          }}
        />
      ),
    },
    {
      title: '반납 가능여부',
      dataIndex: 'canReturn',
      render: BooleanView(),
    },
    {
      title: '추가료 발생여부',
      dataIndex: 'hasSurcharge',
      render: BooleanView(),
    },
    {
      title: '생성일자',
      dataIndex: 'createdAt',
      render: (createdAt) => dayjs(createdAt).format('YYYY년 M월 D일 H시 m분'),
    },
    {
      title: '수정일자',
      dataIndex: 'updatedAt',
      render: (updatedAt) => dayjs(updatedAt).format('YYYY년 M월 D일 H시 m분'),
    },
  ];

  const onRequest = (opts) =>
    getClient('openapi-location').then((c) => c.get('/profiles', opts));

  return (
    <BackofficeTable
      title="프로파일 목록"
      hasSearch={true}
      columns={columns}
      onRequest={onRequest}
      scroll={{ x: 1000 }}
      dataSourceKey="profiles"
      defaultParams={{ orderByField: 'priority' }}
      buttons={
        <Link to="/profiles/add">
          <Button icon={<ProfileOutlined />} type="primary">
            프로파일 추가
          </Button>
        </Link>
      }
    />
  );
};
