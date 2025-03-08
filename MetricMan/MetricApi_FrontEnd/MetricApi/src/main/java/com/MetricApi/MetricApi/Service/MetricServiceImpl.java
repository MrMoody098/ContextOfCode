package com.MetricApi.MetricApi.Service;

import com.MetricApi.MetricApi.Model.MetricEntity;
import com.MetricApi.MetricApi.Repository.MetricRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class MetricServiceImpl implements MetricService {
    @Autowired
    private MetricRepository metricRepository;

    //BASIC CRUD OPERATIONS
    @Override
    public MetricEntity findById(String id) {
        Optional<MetricEntity> metric = metricRepository.findById(id);
        return metric.orElse(null);
    }

    @Override
    public MetricEntity deleteMetricById(String id) {
        MetricEntity metric = findById(id);
        if (metric != null) {
            metricRepository.deleteById(id);
        }
        return metric;
    }

    @Override
    public List<MetricEntity> findAll() {
        return metricRepository.findAll();
    }

    @Override
    public MetricEntity saveOrUpdateMetric(MetricEntity metric) {
        return metricRepository.save(metric);
    }

    //FILTERING OPERATIONS
    @Override
    public MetricEntity findTopByDeviceAndMetricOrderByTimestampDesc(String device, String metric) {
        return metricRepository.findTopByDeviceAndMetricOrderByTimestampDesc(device, metric);
    }

    @Override
    public Page<MetricEntity> searchMetrics(String device, String metric, Date startDate, Date endDate, Pageable pageable) {
        return metricRepository.findByDeviceAndMetricAndTimestampBetween(device, metric, startDate, endDate, pageable);
    }
}