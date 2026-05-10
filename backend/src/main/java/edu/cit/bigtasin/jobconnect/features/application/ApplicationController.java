package edu.cit.bigtasin.jobconnect.features.application;

import edu.cit.bigtasin.jobconnect.features.job.Job;
import edu.cit.bigtasin.jobconnect.features.auth.User;
import edu.cit.bigtasin.jobconnect.features.job.JobRepository;
import edu.cit.bigtasin.jobconnect.features.auth.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:3000")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    // Apply for a job
    @PostMapping
    public ResponseEntity<?> applyForJob(@RequestParam Long jobId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User seeker = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if already applied
        if (applicationRepository.existsByJobIdAndSeekerId(jobId, seeker.getId())) {
            return ResponseEntity.badRequest().body(Map.of("message", "You have already applied for this job"));
        }

        Application application = new Application();
        application.setJobId(jobId);
        application.setSeekerId(seeker.getId());
        application.setStatus("PENDING");

        // Increment applicant count on job
        Job job = jobRepository.findById(jobId).orElseThrow();
        job.setApplicantCount(job.getApplicantCount() + 1);
        jobRepository.save(job);

        applicationRepository.save(application);

        return ResponseEntity.ok(Map.of("message", "Application submitted successfully!"));
    }

    // Get user's applications
    @GetMapping("/user/me")
    public ResponseEntity<?> getUserApplications() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User seeker = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Application> applications = applicationRepository.findBySeekerId(seeker.getId());

        List<Map<String, Object>> result = applications.stream().map(app -> {
            Map<String, Object> item = new HashMap<>();
            item.put("id", app.getId());
            item.put("jobId", app.getJobId());
            item.put("status", app.getStatus());
            item.put("appliedAt", app.getAppliedAt());

            Job job = jobRepository.findById(app.getJobId()).orElse(null);
            if (job != null) {
                item.put("jobTitle", job.getTitle());
                item.put("jobLocation", job.getLocation());
                item.put("employerName", job.getEmployerName());
            }
            return item;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    // Get applications for a job (employer only)
    @GetMapping("/job/{jobId}")
    public ResponseEntity<?> getJobApplications(@PathVariable Long jobId) {
        List<Application> applications = applicationRepository.findByJobId(jobId);

        List<Map<String, Object>> result = applications.stream().map(app -> {
            Map<String, Object> item = new HashMap<>();
            item.put("id", app.getId());
            item.put("status", app.getStatus());
            item.put("appliedAt", app.getAppliedAt());

            User seeker = userRepository.findById(app.getSeekerId()).orElse(null);
            if (seeker != null) {
                item.put("seekerName", seeker.getFullName());
                item.put("seekerEmail", seeker.getEmail());
            }
            return item;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}