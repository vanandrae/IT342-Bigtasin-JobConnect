package edu.cit.bigtasin.jobconnect.features.favorite;

import edu.cit.bigtasin.jobconnect.features.auth.User;
import edu.cit.bigtasin.jobconnect.features.auth.UserRepository;
import edu.cit.bigtasin.jobconnect.features.job.Job;
import edu.cit.bigtasin.jobconnect.features.job.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "http://localhost:3000")
public class FavoriteController {

    @Autowired
    private FavoriteRepository favoriteRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JobRepository jobRepository;
    
    // Add job to favorites
    @PostMapping("/{jobId}")
    public ResponseEntity<?> addFavorite(@PathVariable Long jobId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if already favorited
        if (favoriteRepository.existsByUserIdAndJobId(user.getId(), jobId)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Job already in favorites"));
        }
        
        Favorite favorite = new Favorite(user.getId(), jobId);
        favoriteRepository.save(favorite);
        
        return ResponseEntity.ok(Map.of("message", "Added to favorites"));
    }
    
    // Remove job from favorites
    @DeleteMapping("/{jobId}")
    public ResponseEntity<?> removeFavorite(@PathVariable Long jobId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        favoriteRepository.deleteByUserIdAndJobId(user.getId(), jobId);
        
        return ResponseEntity.ok(Map.of("message", "Removed from favorites"));
    }
    
    // Get user's favorite jobs
    @GetMapping
    public ResponseEntity<?> getFavorites() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Favorite> favorites = favoriteRepository.findByUserId(user.getId());
        
        List<Map<String, Object>> favoriteJobs = favorites.stream().map(fav -> {
            Job job = jobRepository.findById(fav.getJobId()).orElse(null);
            if (job != null) {
                Map<String, Object> item = new HashMap<>();
                item.put("id", job.getId());
                item.put("title", job.getTitle());
                item.put("description", job.getDescription());
                item.put("location", job.getLocation());
                item.put("salaryRange", job.getSalaryRange());
                item.put("employmentType", job.getEmploymentType());
                item.put("employerName", job.getEmployerName());
                item.put("favoritedAt", fav.getCreatedAt());
                return item;
            }
            return null;
        }).filter(job -> job != null).collect(Collectors.toList());
        
        return ResponseEntity.ok(favoriteJobs);
    }
    
    // Check if a job is favorited
    @GetMapping("/check/{jobId}")
    public ResponseEntity<?> checkFavorite(@PathVariable Long jobId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        boolean isFavorited = favoriteRepository.existsByUserIdAndJobId(user.getId(), jobId);
        
        return ResponseEntity.ok(Map.of("favorited", isFavorited));
    }
}