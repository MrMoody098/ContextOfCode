package com.MetricApi.MetricApi.Repository;

import com.MetricApi.MetricApi.Model.MetricEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Query;

import java.util.Date;
import java.util.List;

public interface MetricRepository extends MongoRepository<MetricEntity, String>, MetricRepositoryCustom {
    MetricEntity findTopByDeviceAndMetricOrderByTimestampDesc(String device, String metric);

    Page<MetricEntity> findByDeviceAndMetricAndTimestampBetween(String device, String metric, Date startDate, Date endDate, Pageable pageable);
    Page<MetricEntity> findByDeviceAndMetric(String device, Pageable pageable);
    Page<MetricEntity> findByDevice(String device, Pageable pageable);

    @Query("{ 'device': ?0 }")
    List<MetricEntity> findRecentMetricsByDevice(String device);
}
