package edu.cit.bigtasin.jobconnect.features.job;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String category;
    private String salaryRange;
    private String location;
    private String employmentType;
    private String status = "OPEN";
    
    @Column(name = "employer_id")
    private Long employerId;
    
    @Column(name = "employer_name")
    private String employerName;
    
    @Column(name = "applicant_count")
    private Integer applicantCount = 0;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Default constructor
    public Job() {}

    // Getters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
    public String getSalaryRange() { return salaryRange; }
    public String getLocation() { return location; }
    public String getEmploymentType() { return employmentType; }
    public String getStatus() { return status; }
    public Long getEmployerId() { return employerId; }
    public String getEmployerName() { return employerName; }
    public Integer getApplicantCount() { return applicantCount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setCategory(String category) { this.category = category; }
    public void setSalaryRange(String salaryRange) { this.salaryRange = salaryRange; }
    public void setLocation(String location) { this.location = location; }
    public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }
    public void setStatus(String status) { this.status = status; }
    public void setEmployerId(Long employerId) { this.employerId = employerId; }
    public void setEmployerName(String employerName) { this.employerName = employerName; }
    public void setApplicantCount(Integer applicantCount) { this.applicantCount = applicantCount; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}