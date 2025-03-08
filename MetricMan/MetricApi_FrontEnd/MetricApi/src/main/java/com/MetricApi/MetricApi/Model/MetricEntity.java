package com.MetricApi.MetricApi.Model;

import lombok.Generated;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;

@NoArgsConstructor
@Getter
@Setter
@Document("metrics")
public class MetricEntity {
    @Id
    @Generated
    private String id;

    private String device;
    private String metric;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private Date timestamp;
    private float value;
    private String unit;

    // Constructor that initializes the entity from given values
    public MetricEntity(String id, String device, String metric, Date timestamp, float value, String unit) {
        this.id = id;
        this.device = device;
        this.metric = metric;
        this.timestamp = timestamp;
        this.value = value;
        this.unit = unit;
    }
}
