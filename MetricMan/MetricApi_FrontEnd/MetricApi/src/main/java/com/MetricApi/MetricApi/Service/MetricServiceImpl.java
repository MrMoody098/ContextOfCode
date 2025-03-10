package com.MetricApi.MetricApi.Service;

import com.MetricApi.MetricApi.Model.MetricEntity;
import com.MetricApi.MetricApi.Repository.MetricRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.PageRequest;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Collections;

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

    public MetricEntity saveMetric(MetricEntity metricEntity) {
        return metricRepository.save(metricEntity);
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
    //used for returning a list of recent metrics for a specific device
    @Override
    public List<MetricEntity> findRecentMetricsByDevice(String device) {
        return metricRepository.findRecentMetricsByDevice(device);
    }

    //used for returning the most recent metric for a specific metric and device
    @Override
    public MetricEntity findTopByDeviceAndMetricOrderByTimestampDesc(String device, String metric) {
        return metricRepository.findTopByDeviceAndMetricOrderByTimestampDesc(device, metric);
    }

    @Override
    public Page<MetricEntity> searchMetrics(String device, String metric, Date startDate, Date endDate, Pageable pageable) {
        return metricRepository.searchMetrics(device, metric, startDate, endDate, pageable);
    }

    public List<MetricEntity> findMetricHistoryByDeviceAndMetric(
            String device, String metric, Date startDate, Date endDate) {

        // Get the first and last metrics for the given device and metric
        MetricEntity firstMetric = metricRepository.findTopByDeviceAndMetricOrderByTimestampAsc(device, metric);
        MetricEntity lastMetric = metricRepository.findTopByDeviceAndMetricOrderByTimestampDesc(device, metric);

        // If no metrics are found, return an empty list or handle the situation accordingly
        if (firstMetric == null || lastMetric == null) {
            return List.of();  // or some other response indicating no data
        }

        // Use the timestamps from the first and last metrics to get the range
        Date firstTimestamp = firstMetric.getTimestamp();
        Date lastTimestamp = lastMetric.getTimestamp();

        // If no start or end date is provided, use the first and last metric timestamps
        if (startDate == null) {
            startDate = firstTimestamp;
        }
        if (endDate == null) {
            endDate = lastTimestamp;
        }

        // Fetch the metrics within the specified date range
        return metricRepository.findByDeviceAndMetricAndTimestampBetweenOrderByTimestampAsc(
                device, metric, startDate, endDate);
    }


}