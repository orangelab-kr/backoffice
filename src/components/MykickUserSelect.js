import { Select } from 'antd';
import _ from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getClient } from '../tools';
const { Option } = Select;

export const MykickUserSelect = ({ id, isLoading, onChange, value }) => {
  const [init, setInit] = useState(false);
  const [users, setUsers] = useState([]);
  const requestSearch = useCallback(
    (search = value, props) => {
      const params = {
        search,
        take: 10,
        skip: 0,
        ...props,
      };

      getClient('mykick', true)
        .then((c) => c.get('/users', { params }))
        .then(({ data }) => setUsers(data.users));
    },
    [value]
  );

  useEffect(() => {
    if (init || value === undefined) return;
    requestSearch(null, { search: value });
    setInit(true);
  }, [init, requestSearch, value]);

  const delayedSearch = useRef(_.debounce(requestSearch, 500)).current;
  return (
    <Select
      id={id}
      value={value}
      showSearch
      disabled={isLoading}
      optionFilterProp='children'
      onSearch={delayedSearch}
      onChange={onChange}
    >
      {users.map((user) => (
        <Option key={user.userId} value={user.userId}>
          {user.name}({user.phoneNo})
        </Option>
      ))}
    </Select>
  );
};
