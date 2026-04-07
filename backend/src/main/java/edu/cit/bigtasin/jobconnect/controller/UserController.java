package edu.cit.bigtasin.jobconnect.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @GetMapping("/me")
    public String getMe() {
        return "This is protected data. Only logged-in users should see this!";
    }
}