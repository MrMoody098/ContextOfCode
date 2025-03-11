package com.MetricApi.MetricApi.Service;

import com.MetricApi.MetricApi.Model.MetricEntity;
import com.MetricApi.MetricApi.Repository.MetricRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class MetricServiceImpl implements MetricService {
    @Autowired
    private MetricRepository metricRepository;

    // BASIC CRUD OPERATIONS
    @Override
    public Optional<MetricEntity> findById(String id) {
        return metricRepository.findById(id);
    }

    @Override
    public MetricEntity saveMetric(MetricEntity metricEntity) {
        return metricRepository.save(metricEntity);
    }

    @Override
    public boolean deleteMetricById(String id) {
        if (metricRepository.existsById(id)) {
            metricRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public List<MetricEntity> findAll() {
        return metricRepository.findAll();
    }

    @Override
    public MetricEntity saveOrUpdateMetric(MetricEntity metric) {
        return metricRepository.save(metric);
    }

    // FILTERING OPERATIONS
    @Override
    public List<MetricEntity> findRecentMetricsByDevice(String device) {
        return metricRepository.findRecentMetricsByDevice(device);
    }

    @Override
    public Optional<MetricEntity> findTopByDeviceAndMetricOrderByTimestampDesc(String device, String metric) {
        return Optional.ofNullable(metricRepository.findTopByDeviceAndMetricOrderByTimestampDesc(device, metric));
    }

    @Override
    public Page<MetricEntity> searchMetrics(String device, String metric, Instant startDate, Instant endDate, Pageable pageable) {
        return metricRepository.searchMetrics(device, metric, startDate, endDate, pageable);
    }

    @Override
    public List<MetricEntity> findMetricHistoryByDeviceAndMetric(String device, String metric, Instant startDate, Instant endDate) {
        Optional<MetricEntity> firstMetricOpt = Optional.ofNullable(metricRepository.findTopByDeviceAndMetricOrderByTimestampAsc(device, metric));
        Optional<MetricEntity> lastMetricOpt = Optional.ofNullable(metricRepository.findTopByDeviceAndMetricOrderByTimestampDesc(device, metric));

        if (firstMetricOpt.isEmpty() || lastMetricOpt.isEmpty()) {
            return List.of();  // No data found
        }

        Instant firstTimestamp = firstMetricOpt.get().getTimestamp();
        Instant lastTimestamp = lastMetricOpt.get().getTimestamp();

        if (startDate == null) {
            startDate = firstTimestamp;
        }
        if (endDate == null) {
            endDate = lastTimestamp;
        }

        return metricRepository.findByDeviceAndMetricAndTimestampBetweenOrderByTimestampAsc(device, metric, startDate, endDate);
    }
}
