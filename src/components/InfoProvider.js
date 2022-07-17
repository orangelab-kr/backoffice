import { EventEmitter } from 'events';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';

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
    dataSourceEvent[dataSourceKey].setMaxListeners(30);
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

  const getData = useCallback(() => {
    if (dataSource[dataSourceKey][dataId] !== undefined) {
      loadData(dataSource[dataSourceKey][dataId]);
      return;
    }

    if (!isLoadingDataSource[dataSourceKey][dataId]) getDataByNetwork();
    dataSourceEvent[dataSourceKey].on(dataId, loadData);
  }, [dataId, dataSourceKey, getDataByNetwork]);

  const loadData = (data) => {
    setLoading(false);
    setData(data);
  };

  useEffect(() => {
    getData();
  }, [getData, isLoading, dataId, dataSourceKey]);

  return isLoading ? renderLoading() : data ? render(data) : renderFailed();
};
