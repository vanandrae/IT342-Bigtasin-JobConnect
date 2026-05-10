package edu.cit.bigtasin.jobconnect.features.application;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "job_id")
    private Long jobId;
    
    @Column(name = "seeker_id")
    private Long seekerId;
    
    private String status = "PENDING";
    
    @Column(name = "applied_at")
    private LocalDateTime appliedAt = LocalDateTime.now();

    // Default constructor
    public Application() {}

    // Getters
    public Long getId() { return id; }
    public Long getJobId() { return jobId; }
    public Long getSeekerId() { return seekerId; }
    public String getStatus() { return status; }
    public LocalDateTime getAppliedAt() { return appliedAt; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setJobId(Long jobId) { this.jobId = jobId; }
    public void setSeekerId(Long seekerId) { this.seekerId = seekerId; }
    public void setStatus(String status) { this.status = status; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
}