package com.MetricApi.MetricApi.Service;

import com.MetricApi.MetricApi.Model.CommandEntity;
import java.util.List;
import java.util.Optional;

public interface CommandService {
    CommandEntity saveCommand(CommandEntity command);
    List<CommandEntity> getPendingCommands();
    boolean markCommandExecuted(String id);
}
