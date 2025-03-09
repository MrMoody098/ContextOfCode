package com.MetricApi.MetricApi.Repository;

import com.MetricApi.MetricApi.Model.MetricEntity;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

public class MetricRepositoryCustomImpl implements MetricRepositoryCustom {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public Page<MetricEntity> searchMetrics(String device, String metric, Date startDate, Date endDate, Pageable pageable) {
        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        if (device != null && !device.isEmpty()) {
            criteriaList.add(Criteria.where("device").is(device));
        }

        if (metric != null && !metric.isEmpty()) {
            // Trim the metric value and compile a case-insensitive regex pattern.
            metric = metric.trim();
            Pattern pattern = Pattern.compile(metric, Pattern.CASE_INSENSITIVE);
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
            // If only one criterion is present, add it directly.
            if (criteriaList.size() == 1) {
                query.addCriteria(criteriaList.get(0));
            } else {
                Criteria criteria = new Criteria().andOperator(criteriaList.toArray(new Criteria[0]));
                query.addCriteria(criteria);
            }
        }

        // Log the constructed query for debugging.
        System.out.println("Constructed Query: " + query.getQueryObject().toJson());

        // Apply pagination and sorting from the pageable parameter.
        query.with(pageable);

        List<MetricEntity> list = mongoTemplate.find(query, MetricEntity.class);
        // For total count, reset paging options.
        long count = mongoTemplate.count(query.skip(0).limit(0), MetricEntity.class);

        return new PageImpl<>(list, pageable, count);
    }
}
