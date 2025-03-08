package com.MetricApi.MetricApi.Repository;

import com.MetricApi.MetricApi.Model.MetricEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Date;

public interface MetricRepository extends MongoRepository<MetricEntity, String> {
    MetricEntity findTopByDeviceAndMetricOrderByTimestampDesc(String device, String metric);
    Page<MetricEntity> findByDeviceAndMetricAndTimestampBetween(String device, String metric, Date startDate, Date endDate, Pageable pageable);
}