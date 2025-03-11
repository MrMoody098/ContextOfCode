package com.MetricApi.MetricApi.Repository;

import com.MetricApi.MetricApi.Model.MetricEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Query;

import java.time.Instant;
import java.util.List;

public interface MetricRepository extends MongoRepository<MetricEntity, String>, MetricRepositoryCustom {

    // Query to get the most recent metric (last)
    MetricEntity findTopByDeviceAndMetricOrderByTimestampDesc(String device, String metric);

    // Query to get the oldest metric (first)
    MetricEntity findTopByDeviceAndMetricOrderByTimestampAsc(String device, String metric);

    // Query to get a list of metrics within a time range ordered by timestamp
    List<MetricEntity> findByDeviceAndMetricAndTimestampBetweenOrderByTimestampAsc(String device, String metric, Instant startDate, Instant endDate);

    // Paginated query to get metrics within a time range
    Page<MetricEntity> findByDeviceAndMetricAndTimestampBetween(String device, String metric, Instant startDate, Instant endDate, Pageable pageable);

    // Paginated query to get metrics by device and metric
    Page<MetricEntity> findByDeviceAndMetric(String device, Pageable pageable);

    // Paginated query to get metrics by device
    Page<MetricEntity> findByDevice(String device, Pageable pageable);

    // Query to find recent metrics by device
    @Query("{ 'device': ?0 }")
    List<MetricEntity> findRecentMetricsByDevice(String device);

    // Custom query to find the earliest metric for the given device and metric
    @Query(value = "{ 'device': ?0, 'metric': ?1 }", sort = "{ 'timestamp' : 1 }")
    MetricEntity findFirstByDeviceAndMetric(String device, String metric);

    // Custom query to find the latest metric for the given device and metric
    @Query(value = "{ 'device': ?0, 'metric': ?1 }", sort = "{ 'timestamp' : -1 }")
    MetricEntity findLastByDeviceAndMetric(String device, String metric);
}
