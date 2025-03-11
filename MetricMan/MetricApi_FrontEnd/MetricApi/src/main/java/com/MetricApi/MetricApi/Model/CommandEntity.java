package com.MetricApi.MetricApi.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "commands")
public class CommandEntity {
    @Id
    private String id;
    private String command;
    private boolean executed;  // To track if the command has been executed

    public CommandEntity() {}

    public CommandEntity(String command) {
        this.command = command;
        this.executed = false;
    }

    public String getId() { return id; }
    public String getCommand() { return command; }
    public boolean isExecuted() { return executed; }

    public void setExecuted(boolean executed) { this.executed = executed; }
}
