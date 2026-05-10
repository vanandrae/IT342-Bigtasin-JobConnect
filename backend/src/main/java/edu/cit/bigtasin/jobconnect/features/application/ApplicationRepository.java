package edu.cit.bigtasin.jobconnect.features.application;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findBySeekerId(Long seekerId);
    List<Application> findByJobId(Long jobId);
    boolean existsByJobIdAndSeekerId(Long jobId, Long seekerId);
}