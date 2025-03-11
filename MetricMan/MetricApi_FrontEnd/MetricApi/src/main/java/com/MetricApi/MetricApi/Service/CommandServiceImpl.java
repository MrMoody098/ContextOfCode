package com.MetricApi.MetricApi.Service.Impl;

import com.MetricApi.MetricApi.Model.CommandEntity;
import com.MetricApi.MetricApi.Repository.CommandRepository;
import com.MetricApi.MetricApi.Service.CommandService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommandServiceImpl implements CommandService {

    private final CommandRepository commandRepository;

    public CommandServiceImpl(CommandRepository commandRepository) {
        this.commandRepository = commandRepository;
    }

    @Override
    public CommandEntity saveCommand(CommandEntity command) {
        return commandRepository.save(command);
    }

    @Override
    public List<CommandEntity> getPendingCommands() {
        return commandRepository.findByExecutedFalse();
    }

    @Override
    public boolean markCommandExecuted(String id) {
        Optional<CommandEntity> command = commandRepository.findById(id);
        if (command.isPresent()) {
            CommandEntity cmd = command.get();
            cmd.setExecuted(true);
            commandRepository.save(cmd);
            return true;
        }
        return false;
    }
}
