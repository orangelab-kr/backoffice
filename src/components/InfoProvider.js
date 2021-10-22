import { EventEmitter } from 'events';
import { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';

const dataSource = {};
const isLoadingDataSource = {};
const dataSourceEvent = {};

export const InfoProvider = ({
  onRequest,
  dataId,
  dataSourceKey,
  renderLoading,
  renderFailed,
  render,
}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  if (!dataSource[dataSourceKey]) {
    dataSource[dataSourceKey] = {};
    isLoadingDataSource[dataSourceKey] = {};
    dataSourceEvent[dataSourceKey] = new EventEmitter();
  }

  const getDataByNetwork = useCallback(() => {
    isLoadingDataSource[dataSourceKey][dataId] = true;
    const setFinalData = (res) => {
      const data = _.get(res?.data, dataSourceKey) || null;
      dataSource[dataSourceKey][dataId] = data;
      dataSourceEvent[dataSourceKey].emit(dataId, data);
      delete isLoadingDataSource[dataSourceKey][dataId];
      dataSourceEvent[dataSourceKey].removeAllListeners(dataId);
    };

    onRequest(dataId).then(setFinalData).catch(setFinalData);
  }, [dataId, dataSourceKey, onRequest]);

  const getData = () => {
    if (dataSource[dataSourceKey][dataId] !== undefined) {
      loadData(dataSource[dataSourceKey][dataId]);
      return;
    }

    if (!isLoadingDataSource[dataSourceKey][dataId]) getDataByNetwork();
    dataSourceEvent[dataSourceKey].on(dataId, loadData);
  };

  const loadData = (data) => {
    setLoading(false);
    setData(data);
  };

  useEffect(getData, [getDataByNetwork, isLoading, dataId, dataSourceKey]);
  return isLoading ? renderLoading() : data ? render(data) : renderFailed();
};
