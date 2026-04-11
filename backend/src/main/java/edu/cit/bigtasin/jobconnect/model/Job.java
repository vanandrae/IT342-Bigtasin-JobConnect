package edu.cit.bigtasin.jobconnect.model;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 2000)
    private String description;

    private String category;
    private String salaryRange;
    private String location;

    @Column(name = "employment_type")
    private String employmentType;

    @Column(nullable = false)
    private String status = "OPEN";

    @Column(name = "employer_id", nullable = false)
    private Long employerId;

    @Column(name = "employer_name")
    private String employerName;

    @Column(name = "applicant_count")
    private Integer applicantCount = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}