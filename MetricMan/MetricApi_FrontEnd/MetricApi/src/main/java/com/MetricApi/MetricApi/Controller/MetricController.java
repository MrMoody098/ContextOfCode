package com.MetricApi.MetricApi.Controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.MetricApi.MetricApi.Service.MetricService;
import com.MetricApi.MetricApi.Model.MetricEntity;

@RestController
@RequestMapping("metrics")
public class MetricController {
    private static final Logger logger = LoggerFactory.getLogger(MetricController.class);

    private final MetricService metricService;

    @Autowired
    public MetricController(MetricService metricService) {
        this.metricService = metricService;
    }

    // BASIC CRUD OPERATIONS

    @GetMapping("/{id}")
    public ResponseEntity<MetricEntity> getMetricById(@PathVariable String id) {
        return metricService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/history/device/metric/{device}/{metric}")
    public ResponseEntity<List<MetricEntity>> getDeviceHistoryByMetric(
            @PathVariable String device,
            @PathVariable String metric,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant endDate) {
        List<MetricEntity> metrics = metricService.findMetricHistoryByDeviceAndMetric(device, metric, startDate, endDate);
        return ResponseEntity.ok(metrics);
    }

    @PostMapping
    public ResponseEntity<MetricEntity> createMetric(@RequestBody MetricEntity metricEntity) {
        MetricEntity createdMetric = metricService.saveMetric(metricEntity);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMetric);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMetric(@PathVariable String id) {
        boolean deleted = metricService.deleteMetricById(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<MetricEntity>> getAllMetrics() {
        List<MetricEntity> metrics = metricService.findAll();
        return ResponseEntity.ok(metrics);
    }

    // FILTERING OPERATIONS

    @GetMapping("/recent/{device}")
    public ResponseEntity<List<MetricEntity>> getRecentMetricsByDevice(@PathVariable String device) {
        List<MetricEntity> metrics = metricService.findRecentMetricsByDevice(device);
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/recent/{device}/{metric}")
    public ResponseEntity<MetricEntity> getRecentMetricByDeviceAndMetric(
            @PathVariable String device,
            @PathVariable String metric) {
        Optional<MetricEntity> metricEntity = metricService.findTopByDeviceAndMetricOrderByTimestampDesc(device, metric);
        return metricEntity.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<Page<MetricEntity>> searchMetrics(
            @RequestParam(required = false) String device,
            @RequestParam(required = false) String metric,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "timestamp") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        if (page < 0 || size <= 0) {
            return ResponseEntity.badRequest().build();
        }

        Sort.Direction direction = sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<MetricEntity> metrics = metricService.searchMetrics(device, metric, startDate, endDate, pageable);
        return ResponseEntity.ok(metrics);
    }
}
