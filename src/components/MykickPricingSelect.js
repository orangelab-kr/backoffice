import { Select } from 'antd';
import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getClient } from '../tools';
const { Option } = Select;

export const MykickPricingSelect = ({ id, isLoading, onChange, value }) => {
  const [init, setInit] = useState(false);
  const [pricings, setPricings] = useState([]);
  const requestSearch = useCallback(
    (search = value, props) => {
      const params = {
        search,
        take: 10,
        skip: 0,
        ...props,
      };

      getClient('mykick', true)
        .then((c) => c.get('/pricings', { params }))
        .then(({ data }) => setPricings(data.pricings));
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
      {pricings.map((pricing) => (
        <Option key={pricing.pricingId} value={pricing.pricingId}>
          {pricing.name}({pricing.periodMonths}개월{', '}
          {pricing.monthlyPrice.toLocaleString()}원)
        </Option>
      ))}
    </Select>
  );
};
