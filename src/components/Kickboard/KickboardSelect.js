import { Select } from 'antd';
import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getClient } from '../../tools';

const { Option } = Select;

export const KickboardSelect = ({ id, isLoading, onChange, value }) => {
  const [kickboards, setKickboards] = useState([]);
  const requestSearch = useCallback(
    (search = value) => {
      search = search && search.toUpperCase();
      const params = { search, take: 10, skip: 0 };
      getClient('openapi-kickboard', true)
        .then((c) => c.get('/kickboards', { params }))
        .then(({ data }) => setKickboards(data.kickboards));
    },
    [value]
  );

  const delayedSearch = useRef(_.debounce(requestSearch, 500)).current;
  useEffect(() => {
    requestSearch();
  }, [requestSearch, value]);

  return (
    <Select
      id={id}
      value={value}
      showSearch
      disabled={isLoading}
      defaultActiveFirstOption={true}
      placeholder='킥보드를 입력해주세요.'
      optionFilterProp='children'
      onSearch={delayedSearch}
      onChange={onChange}
    >
      {kickboards.map((kickboard) => (
        <Option key={kickboard.kickboardCode} value={kickboard.kickboardCode}>
          {kickboard.kickboardCode}({kickboard.kickboardId})
        </Option>
      ))}
    </Select>
  );
};
