package com.email.writer.app;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/email")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class EmailController {

    private final EmailGeneratorService emailGeneratorService;

    @PostMapping("/generate")
    public ResponseEntity<Map<String, String>> generateEmail(@RequestBody EmailRequest email) {
        String response = emailGeneratorService.generateEmailReply(email);
        return ResponseEntity.ok(Map.of("message", response));
    }
}
