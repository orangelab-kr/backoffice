import { Select } from 'antd';
import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getClient } from '../../tools';

const { Option } = Select;

export const PricingSelect = ({ id, isLoading, onChange, value }) => {
  const [pricings, setPricings] = useState([]);
  const requestSearch = useCallback(
    (search = value) => {
      const params = {
        search,
        take: 10,
        skip: 0,
        orderByField: 'name',
        orderBySort: 'asc',
      };

      getClient('openapi-location', true)
        .then((c) => c.get('/pricings', { params }))
        .then(({ data }) => setPricings(data.pricings));
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
      optionFilterProp='children'
      onSearch={delayedSearch}
      onChange={onChange}
    >
      {pricings.map((pricing) => (
        <Option key={pricing.pricingId} value={pricing.pricingId}>
          {pricing.name}
        </Option>
      ))}
    </Select>
  );
};
