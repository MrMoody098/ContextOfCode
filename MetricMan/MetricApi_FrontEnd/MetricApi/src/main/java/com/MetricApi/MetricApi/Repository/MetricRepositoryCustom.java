package com.MetricApi.MetricApi.Repository;

import com.MetricApi.MetricApi.Model.MetricEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;

public interface MetricRepositoryCustom {
    Page<MetricEntity> searchMetrics(String device, String metric, Instant startDate, Instant endDate, Pageable pageable);
}
