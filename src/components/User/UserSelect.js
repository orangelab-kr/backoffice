import { Select, Spin } from 'antd';
import { useEffect, useState } from 'react';

import { useDebounce } from 'use-debounce';
import { getClient } from '../../tools';

export const UserSelect = ({
  value,
  onChange,
  placeholder,
  className = 'w-1/3',
}) => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);

  const onSearch = async () => {
    try {
      setLoading(true);
      const params = { search: debouncedSearch || value };
      const { data } = await getClient('coreservice-accounts').then((c) =>
        c.get('/users', { params }),
      );

      setUsers(data.users);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <Select
      showSearch
      allowClear
      className={className}
      optionFilterProp="children"
      placeholder={placeholder || '사용자를 선택하세요.'}
      notFoundContent={loading ? <Spin size="small" /> : null}
      filterOption={false}
      onSearch={setSearch}
      onChange={onChange}
      value={value}
    >
      {users.map((user) => (
        <Select.Option key={user.userId} value={user.userId}>
          {user.realname}({user.phoneNo})
        </Select.Option>
      ))}
    </Select>
  );
};
