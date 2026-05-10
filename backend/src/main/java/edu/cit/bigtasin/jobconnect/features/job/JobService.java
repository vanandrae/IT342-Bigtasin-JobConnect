package edu.cit.bigtasin.jobconnect.features.job;

import edu.cit.bigtasin.jobconnect.features.auth.User;
import edu.cit.bigtasin.jobconnect.features.auth.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    // Create a new job (employer only)
    public Job createJob(Job job, String employerUsername) {
        User employer = userRepository.findByUsername(employerUsername)
                .orElseThrow(() -> new RuntimeException("Employer not found"));

        job.setEmployerId(employer.getId());
        job.setEmployerName(employer.getFullName());
        job.setStatus("OPEN");
        job.setApplicantCount(0);
        job.setCreatedAt(LocalDateTime.now());
        job.setUpdatedAt(LocalDateTime.now());

        return jobRepository.save(job);
    }

    // Get all jobs (for job seekers)
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    // Get jobs by employer ID (for employer dashboard)
    public List<Job> getJobsByEmployer(Long employerId) {
        return jobRepository.findByEmployerId(employerId);
    }

    // Get job by ID
    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
    }

    // Update an existing job
    public Job updateJob(Long id, Job jobDetails) {
        Job job = getJobById(id);

        job.setTitle(jobDetails.getTitle());
        job.setDescription(jobDetails.getDescription());
        job.setCategory(jobDetails.getCategory());
        job.setSalaryRange(jobDetails.getSalaryRange());
        job.setLocation(jobDetails.getLocation());
        job.setEmploymentType(jobDetails.getEmploymentType());
        job.setStatus(jobDetails.getStatus());
        job.setUpdatedAt(LocalDateTime.now());

        return jobRepository.save(job);
    }

    // Delete a job
    public void deleteJob(Long id) {
        Job job = getJobById(id);
        jobRepository.delete(job);
    }

    // Search jobs by keyword
    public List<Job> searchJobs(String keyword) {
        return jobRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword);
    }
}