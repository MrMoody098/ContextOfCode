package com.MetricApi.MetricApi.Controller;

import com.MetricApi.MetricApi.Model.CommandEntity;
import com.MetricApi.MetricApi.Repository.CommandRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*") // Allow all origins
@RestController
@RequestMapping("/api/commands")
public class CommandController {

    private final CommandRepository commandRepository;

    public CommandController(CommandRepository commandRepository) {
        this.commandRepository = commandRepository;
    }

    // ✅ Frontend calls this to send a command
    @PostMapping("/send-command")
    public String sendCommand(@RequestBody CommandEntity command) {
        commandRepository.save(command);
        return "Command stored successfully!";
    }

    // ✅ Python collector calls this to fetch pending commands
    @GetMapping("/pending")
    public List<CommandEntity> getPendingCommands() {
        return commandRepository.findByExecutedFalse();
    }

    // ✅ Python collector calls this to mark a command as executed
    @PutMapping("/mark-executed/{id}")
    public String markCommandExecuted(@PathVariable String id) {
        CommandEntity command = commandRepository.findById(id).orElse(null);
        if (command != null) {
            command.setExecuted(true);
            commandRepository.save(command);
            return "Command marked as executed!";
        }
        return "Command not found!";
    }
}
