package edu.cit.bigtasin.jobconnect.features.job;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByEmployerId(Long employerId);
    List<Job> findByStatus(String status);
    List<Job> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);
}