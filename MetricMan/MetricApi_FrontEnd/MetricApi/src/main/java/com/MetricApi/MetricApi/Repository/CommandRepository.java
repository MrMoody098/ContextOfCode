package com.MetricApi.MetricApi.Repository;

import com.MetricApi.MetricApi.Model.CommandEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CommandRepository extends MongoRepository<CommandEntity, String> {
    List<CommandEntity> findByExecutedFalse();
}
