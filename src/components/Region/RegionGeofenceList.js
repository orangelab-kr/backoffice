import { StopOutlined } from '@ant-design/icons';
import { Button, Checkbox, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import { BackofficeTable } from '../../components';
import { getClient } from '../../tools';
import { ProfileInfoProvider } from '../Profile';

export const RegionGeofenceList = ({
  region,
  setGeofence,
  sidebar,
  refresh,
  setRefresh,
}) => {
  const { regionId } = region;
  const setEnabled = (geofence, enabled) => async () => {
    const { geofenceId } = geofence;
    await getClient('openapi-location').then((c) =>
      c.post(`/regions/${regionId}/geofences/${geofenceId}`, { enabled })
    );

    setRefresh(true);
  };

  const deleteGeofence = (geofenceId) => async () => {
    await getClient('openapi-location').then((c) =>
      c.delete(`/regions/${regionId}/geofences/${geofenceId}`)
    );

    setRefresh(true);
  };

  const columns = [
    {
      title: '활성화',
      dataIndex: 'enabled',
      render: (enabled, geofence) => (
        <Checkbox
          checked={enabled}
          onChange={setEnabled(geofence, !enabled)}
          style={{ marginLeft: 8 }}
        />
      ),
    },
    {
      title: '이름',
      dataIndex: 'name',
      render: (name, geofence) => (
        <Button type="link" onClick={() => setGeofence(geofence)}>
          {name}
        </Button>
      ),
    },
    {
      title: '프로필',
      dataIndex: 'profileId',
      render: (profileId) => <ProfileInfoProvider profileId={profileId} />,
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
    {
      title: '삭제',
      dataIndex: 'geofenceId',
      render: (geofenceId) => (
        <Popconfirm
          title="정말로 지오펜스를 삭제하시곘습니까?"
          onConfirm={deleteGeofence(geofenceId)}
          okText="삭제"
          cancelText="취소"
        >
          <Button size="small" icon={<StopOutlined />} danger>
            삭제
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const onRequest = (opts) =>
    getClient('openapi-location').then((c) =>
      c.get(`/regions/${regionId}/geofences`, opts)
    );

  return (
    <BackofficeTable
      title={`${region.name} 지오펜스 목록`}
      rowKey="geofenceId"
      hasSearch={true}
      columns={columns}
      onRequest={onRequest}
      scroll={{ x: 1000 }}
      refresh={refresh}
      setRefresh={setRefresh}
      dataSourceKey="geofences"
      sidebar={sidebar}
    />
  );
};
