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
    List<MetricEntity> findRecentMetricsByDevice(String device);
    MetricEntity findTopByDeviceAndMetricOrderByTimestampDesc(String device, String metric);
    Page<MetricEntity> searchMetrics(String device, String metric, Date startDate, Date endDate, Pageable pageable);
}