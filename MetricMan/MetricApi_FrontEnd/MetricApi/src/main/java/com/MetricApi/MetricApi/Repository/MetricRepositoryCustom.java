package com.MetricApi.MetricApi.Repository;

import com.MetricApi.MetricApi.Model.MetricEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Date;

public interface MetricRepositoryCustom {
    Page<MetricEntity> searchMetrics(String device, String metric, Date startDate, Date endDate, Pageable pageable);
}
