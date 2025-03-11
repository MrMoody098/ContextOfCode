package com.MetricApi.MetricApi.Service;

import com.MetricApi.MetricApi.Model.MetricEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.time.Instant;
import java.util.List;

public interface MetricService {
    // BASIC CRUD OPERATIONS
    Optional<MetricEntity> findById(String id);
    MetricEntity saveMetric(MetricEntity metric);
    boolean deleteMetricById(String id);
    List<MetricEntity> findAll();
    MetricEntity saveOrUpdateMetric(MetricEntity metric);

    // FILTERING OPERATIONS
    List<MetricEntity> findMetricHistoryByDeviceAndMetric(String device, String metric, Instant startDate, Instant endDate);
    List<MetricEntity> findRecentMetricsByDevice(String device);
    Optional<MetricEntity> findTopByDeviceAndMetricOrderByTimestampDesc(String device, String metric);
    Page<MetricEntity> searchMetrics(String device, String metric, Instant startDate, Instant endDate, Pageable pageable);
}
