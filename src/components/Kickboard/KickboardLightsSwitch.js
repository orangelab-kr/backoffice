import { Switch } from 'antd';
import React, { useState } from 'react';
import { getClient } from '../../tools';

export const KickboardLightsSwitch = ({ kickboard, status }) => {
  const [isLoading, setLoading] = useState(false);
  const [isLightsOn, setLightsOn] = useState(status.isLightsOn);

  const onChange = async (checked) => {
    setLoading(true);
    const { kickboardCode } = kickboard;
    const status = checked ? 'on' : 'off';
    const client = await getClient('openapi-kickboard');
    await client.get(`/kickboards/${kickboardCode}/light/${status}`);
    setLightsOn(!isLightsOn);
    setLoading(false);
  };

  return (
    <Switch
      checkedChildren="켜짐"
      unCheckedChildren="꺼짐"
      onClick={onChange}
      checked={isLightsOn}
      loading={isLoading}
    />
  );
};
