package com.MetricApi.MetricApi.Controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

import com.MetricApi.MetricApi.Service.MetricService;
import com.MetricApi.MetricApi.Model.MetricEntity;

@RestController
@RequestMapping("metrics")
public class MetricController {
    public static Logger logger = LoggerFactory.getLogger(MetricController.class);

    private final MetricService metricService;

    @Autowired
    public MetricController(MetricService metricService){
        this.metricService = metricService;
    }

    //BASIC CRUD OPERATIONS
    @GetMapping(value = "/{id}")
    public ResponseEntity<MetricEntity> getMetricById(@PathVariable("id") String id){
        MetricEntity metric = metricService.findById(id);
        return new ResponseEntity<>(metric, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<MetricEntity> createMetric(@RequestBody MetricEntity metricEntity) {
        MetricEntity createdMetric = metricService.saveMetric(metricEntity);
        return new ResponseEntity<>(createdMetric, HttpStatus.CREATED);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<MetricEntity> deleteMetricById(@PathVariable("id") String id){
        MetricEntity metric = metricService.deleteMetricById(id);
        return new ResponseEntity<>(metric, HttpStatus.OK);
    }

    @GetMapping(value = "/all")
    public ResponseEntity<List<MetricEntity>> getAllMetrics(){
        List<MetricEntity> metrics = metricService.findAll();
        return new ResponseEntity<>(metrics, HttpStatus.OK);
    }

    //FILTERING OPERATIONS
    @GetMapping(value = "/recent/{device}")
    public ResponseEntity<List<MetricEntity>> getRecentMetricsByDevice(
            @PathVariable("device") String device) {
        List<MetricEntity> metrics = metricService.findRecentMetricsByDevice(device);
        return new ResponseEntity<>(metrics, HttpStatus.OK);
    }

    @GetMapping(value = "/recent/{device}/{metric}")
    public ResponseEntity<MetricEntity> getRecentMetricByDeviceAndMetric(
            @PathVariable("device") String device,
            @PathVariable("metric") String metric) {
        MetricEntity metricEntity = metricService.findTopByDeviceAndMetricOrderByTimestampDesc(device, metric);
        return new ResponseEntity<>(metricEntity, HttpStatus.OK);
    }

    @GetMapping(value = "/search")
    public ResponseEntity<Page<MetricEntity>> searchMetrics(
            @RequestParam(required = false) String device,
            @RequestParam(required = false) String metric,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "timestamp") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort.Direction direction = sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<MetricEntity> metrics = metricService.searchMetrics(device, metric, startDate, endDate, pageable);
        return new ResponseEntity<>(metrics, HttpStatus.OK);
    }
}
