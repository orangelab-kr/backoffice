import { Select } from 'antd';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { getClient } from '../../tools';

const { Option } = Select;

export const ProfileSelect = ({ id, isLoading, onChange, value }) => {
  const [profiles, setProfiles] = useState([]);
  const requestSearch = (search) => {
    const params = {
      search,
      take: 10,
      skip: 0,
      orderByField: 'name',
      orderBySort: 'asc',
    };

    getClient('openapi-location')
      .then((c) => c.get('/profiles', { params }))
      .then(({ data }) => setProfiles(data.profiles));
  };

  const delayedSearch = useRef(_.debounce(requestSearch, 500)).current;
  useEffect(requestSearch, [value]);

  return (
    <Select
      id={id}
      value={value}
      showSearch
      disabled={isLoading}
      defaultActiveFirstOption={true}
      optionFilterProp="children"
      onSearch={delayedSearch}
      onChange={onChange}
    >
      {profiles.map((profile) => (
        <Option key={profile.profileId} value={profile.profileId}>
          {profile.name}
        </Option>
      ))}
    </Select>
  );
};
