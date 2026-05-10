package edu.cit.bigtasin.jobconnect.features.job;

import edu.cit.bigtasin.jobconnect.features.auth.User;
import edu.cit.bigtasin.jobconnect.features.auth.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:3000")
public class JobController {

    @Autowired
    private JobService jobService;

    @Autowired
    private UserRepository userRepository;  // Add this

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PostMapping
    public ResponseEntity<Job> createJob(@RequestBody Job job) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("Creating job for: " + username);
        Job created = jobService.createJob(job, username);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @RequestBody Job job) {
        return ResponseEntity.ok(jobService.updateJob(id, job));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok().body("Job deleted successfully");
    }

    // Get jobs for the logged-in employer - FIXED to use employer ID
    @GetMapping("/employer/me")
    public ResponseEntity<List<Job>> getMyJobs() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("Getting jobs for employer: " + username);

        // Find the employer by username to get their ID
        User employer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Employer not found"));

        // Get jobs by employer ID (more reliable than name)
        List<Job> myJobs = jobService.getJobsByEmployer(employer.getId());
        System.out.println("Found " + myJobs.size() + " jobs");

        return ResponseEntity.ok(myJobs);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Job>> searchJobs(@RequestParam String keyword) {
        return ResponseEntity.ok(jobService.searchJobs(keyword));
    }
}