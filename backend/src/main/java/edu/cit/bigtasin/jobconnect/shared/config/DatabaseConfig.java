package edu.cit.bigtasin.jobconnect.shared.config;

import org.springframework.context.annotation.Configuration;
import javax.annotation.PostConstruct;

@Configuration
public class DatabaseConfig {

    @PostConstruct
    public void setIPv4Property() {
        System.setProperty("java.net.preferIPv4Stack", "true");
        System.setProperty("java.net.preferIPv6Addresses", "false");
    }
}