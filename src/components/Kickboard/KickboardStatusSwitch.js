import { Switch } from 'antd';
import React, { useState } from 'react';
import { getClient } from '../../tools';

export const KickboardStatusSwitch = ({ kickboard, status, onClick }) => {
  const [isLoading, setLoading] = useState(false);

  const onChange = async (checked) => {
    setLoading(true);
    const { kickboardCode } = kickboard;
    const status = checked ? 'start' : 'stop';
    const client = await getClient('openapi-kickboard');
    await client.get(`/kickboards/${kickboardCode}/${status}`);
    await onClick();
    setLoading(false);
  };

  return (
    <Switch
      checkedChildren="켜짐"
      unCheckedChildren="꺼짐"
      onClick={onChange}
      checked={status.isEnabled}
      loading={isLoading}
    />
  );
};
