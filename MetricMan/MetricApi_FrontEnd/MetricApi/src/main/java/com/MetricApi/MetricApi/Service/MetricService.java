package com.MetricApi.MetricApi.Service;

import com.MetricApi.MetricApi.Model.MetricEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Date;
import java.util.List;

public interface MetricService {
    //BASIC CRUD OPERATIONS
        MetricEntity findById(String id);
        MetricEntity saveMetric(MetricEntity metric);
        MetricEntity deleteMetricById(String id);
        List<MetricEntity> findAll();
        MetricEntity saveOrUpdateMetric(MetricEntity metric);

    //FILTERING OPERATIONS

        //used for Time series data
        List<MetricEntity> findMetricHistoryByDeviceAndMetric(
                String device, String metric, Date startDate, Date endDate);


    //used for returning a list of all recent metrics for a specific device
        List<MetricEntity> findRecentMetricsByDevice(String device);

        //Custom Function used for returning the most recent metric for a specific metric and device
        MetricEntity findTopByDeviceAndMetricOrderByTimestampDesc(String device, String metric);

        //Custome Functoin used for filtering metrics in my Metrics Table
        Page<MetricEntity> searchMetrics(String device, String metric, Date startDate, Date endDate, Pageable pageable);

}