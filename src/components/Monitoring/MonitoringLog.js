import { Skeleton, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { MonitoringLogItem } from '.';
import { getClient } from '../../tools';

export const MonitoringLog = ({ ride, setRefresh, refresh }) => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const getLogs = useCallback(async () => {
    if (refresh !== undefined && !refresh) return;
    setLoading(true);
    const { data } = await getClient('openapi-ride')
      .then((c) => c.get(`/rides/${ride.rideId}/monitoring`))
      .finally(() => setLoading(false));

    setLogs(data.monitoringLogs);
    if (setRefresh) setRefresh(false);
  }, [refresh, setRefresh, ride.rideId]);

  useEffect(() => {
    getLogs();
  }, [getLogs]);

  if (loading) return <Skeleton />;
  return (
    <Typography.Paragraph style={{ fontSize: 20 }}>
      <pre>
        {logs.map((log) => (
          <MonitoringLogItem log={log} key={log.key} />
        ))}
      </pre>
    </Typography.Paragraph>
  );
};
