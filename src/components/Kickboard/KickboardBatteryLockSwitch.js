import { Switch } from 'antd';
import React, { useState } from 'react';
import { getClient } from '../../tools';

export const KickboardBatteryLockSwitch = ({ kickboard, status }) => {
  const [isLoading, setLoading] = useState(false);
  const [isBatteryLock, setBatteryLock] = useState(status.isBatteryLock);

  const onChange = async (checked) => {
    setLoading(true);
    const { kickboardCode } = kickboard;
    const status = checked ? 'lock' : 'unlock';
    const client = await getClient('openapi-kickboard');
    await client.get(`/kickboards/${kickboardCode}/battery/${status}`);
    setBatteryLock(!isBatteryLock);
    setLoading(false);
  };

  return (
    <Switch
      checkedChildren="켜짐"
      unCheckedChildren="꺼짐"
      onClick={onChange}
      checked={isBatteryLock}
      loading={isLoading}
    />
  );
};
