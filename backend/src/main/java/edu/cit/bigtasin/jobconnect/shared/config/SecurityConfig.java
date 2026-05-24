package edu.cit.bigtasin.jobconnect.shared.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors().configurationSource(corsConfigurationSource())
                .and()
                .csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                // Public endpoints - no authentication required
                .antMatchers("/api/auth/**", "/h2-console/**").permitAll()
                
                // Employer-only endpoints (Job Posting)
                .antMatchers(HttpMethod.POST, "/api/jobs").hasRole("EMPLOYER")
                .antMatchers(HttpMethod.PUT, "/api/jobs/**").hasRole("EMPLOYER")
                .antMatchers(HttpMethod.DELETE, "/api/jobs/**").hasRole("EMPLOYER")
                .antMatchers("/api/jobs/employer/**").hasRole("EMPLOYER")
                
                // Application endpoints - Employer only
                .antMatchers(HttpMethod.GET, "/api/applications/job/**").hasRole("EMPLOYER")
                .antMatchers(HttpMethod.PATCH, "/api/applications/**").hasRole("EMPLOYER")
                
                // Application endpoints - Job Seeker only (authenticated users)
                .antMatchers(HttpMethod.POST, "/api/applications").authenticated()
                .antMatchers(HttpMethod.GET, "/api/applications/user/**").authenticated()
                
                // Job Seeker endpoints (View jobs)
                .antMatchers(HttpMethod.GET, "/api/jobs/**").authenticated()
                
                // Favorite endpoints - authenticated users only
                .antMatchers(HttpMethod.GET, "/api/favorites/**").authenticated()
                .antMatchers(HttpMethod.POST, "/api/favorites/**").authenticated()
                .antMatchers(HttpMethod.DELETE, "/api/favorites/**").authenticated()
                
                // All other requests need authentication
                .anyRequest().authenticated()
                .and()
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}