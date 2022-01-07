import { Select } from 'antd';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { getClient } from '../../tools';

const { Option } = Select;

export const RegionSelect = ({
  id,
  isLoading,
  onChange,
  value,
  ...options
}) => {
  const [regions, setRegions] = useState([]);
  const requestSearch = (search = value) => {
    if (Array.isArray(search)) return;
    const params = {
      search,
      take: 10,
      skip: 0,
      orderByField: 'name',
      orderBySort: 'asc',
    };

    getClient('openapi-location', true)
      .then((c) => c.get('/regions', { params }))
      .then(({ data }) => setRegions(data.regions));
  };

  const delayedSearch = useRef(_.debounce(requestSearch, 500)).current;
  useEffect(requestSearch, [value]);

  return (
    <Select
      {...options}
      id={id}
      value={value}
      showSearch
      disabled={isLoading}
      defaultActiveFirstOption={true}
      optionFilterProp="children"
      onSearch={delayedSearch}
      onChange={onChange}
    >
      {regions.map((region) => (
        <Option key={region.regionId} value={region.regionId}>
          {region.name}
        </Option>
      ))}
    </Select>
  );
};
