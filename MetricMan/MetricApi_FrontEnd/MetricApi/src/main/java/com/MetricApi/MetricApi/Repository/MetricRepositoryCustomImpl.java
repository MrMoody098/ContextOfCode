package com.MetricApi.MetricApi.Repository;

import com.MetricApi.MetricApi.Model.MetricEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Repository
public class MetricRepositoryCustomImpl implements MetricRepositoryCustom {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public Page<MetricEntity> searchMetrics(String device, String metric, Instant startDate, Instant endDate, Pageable pageable) {
        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        if (device != null && !device.isEmpty()) {
            Pattern pattern = Pattern.compile(device, Pattern.CASE_INSENSITIVE);
            criteriaList.add(Criteria.where("device").regex(pattern));
        }

        if (metric != null && !metric.isEmpty()) {
            Pattern pattern = Pattern.compile(metric.trim(), Pattern.CASE_INSENSITIVE);
            criteriaList.add(Criteria.where("metric").regex(pattern));
        }

        if (startDate != null && endDate != null) {
            criteriaList.add(Criteria.where("timestamp").gte(startDate).lte(endDate));
        } else if (startDate != null) {
            criteriaList.add(Criteria.where("timestamp").gte(startDate));
        } else if (endDate != null) {
            criteriaList.add(Criteria.where("timestamp").lte(endDate));
        }

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        // Log the constructed query for debugging
        System.out.println("Constructed Query: " + query.getQueryObject().toJson());

        // Apply pagination and sorting from the pageable parameter
        query.with(pageable);

        List<MetricEntity> list = mongoTemplate.find(query, MetricEntity.class);
        long count = mongoTemplate.count(Query.of(query).limit(0).skip(0), MetricEntity.class);

        return new PageImpl<>(list, pageable, count);
    }
}
