import { Select } from 'antd';
import _ from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getClient } from '../tools';
const { Option } = Select;

export const FranchisesSelect = ({ id, isLoading, onChange, value }) => {
  const [init, setInit] = useState(false);
  const [franchises, setFranchises] = useState([]);

  const requestSearch = useCallback(
    (search = value, props) => {
      const params = {
        search,
        take: 10,
        skip: 0,
        orderByField: 'name',
        orderBySort: 'asc',
        ...props,
      };

      getClient('openapi-franchise', true)
        .then((c) => c.get('/franchises', { params }))
        .then(({ data }) => setFranchises(data.franchises));
    },
    [value]
  );

  useEffect(() => {
    if (init || value === undefined) return;
    requestSearch(null, { franchiseIds: value });
    setInit(true);
  }, [init, requestSearch, value]);

  const delayedSearch = useRef(_.debounce(requestSearch, 500)).current;
  return (
    <Select
      id={id}
      mode="multiple"
      value={value}
      showSearch
      disabled={isLoading}
      optionFilterProp="children"
      onSearch={delayedSearch}
      onChange={onChange}
    >
      {franchises.map((franchise) => (
        <Option key={franchise.franchiseId} value={franchise.franchiseId}>
          {franchise.name}
        </Option>
      ))}
    </Select>
  );
};
