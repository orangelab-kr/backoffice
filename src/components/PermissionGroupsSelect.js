import { Select } from 'antd';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { getClient } from '../tools';

const { Option } = Select;

export const PermissionGroupsSelect = ({ id, isLoading, onChange, value }) => {
  const [permissionGroups, setPermissionGroups] = useState([]);
  const requestSearch = (search = value) => {
    const params = {
      search,
      take: 10,
      skip: 0,
      orderByField: 'name',
      orderBySort: 'asc',
    };

    getClient('backoffice')
      .then((c) => c.get('/permissionGroups', { params }))
      .then(({ data }) => setPermissionGroups(data.permissionGroups));
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
      {permissionGroups.map((permissionGroup) => (
        <Option
          key={permissionGroup.permissionGroupId}
          value={permissionGroup.permissionGroupId}
        >
          {permissionGroup.name}
        </Option>
      ))}
    </Select>
  );
};
