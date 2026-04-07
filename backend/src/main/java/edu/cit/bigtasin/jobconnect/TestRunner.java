package edu.cit.bigtasin.jobconnect;

public class TestRunner {
    public static void main(String[] args) {
        System.out.println("Test is running!");
        System.setProperty("java.net.preferIPv4Stack", "true");
        JobconnectApplication.main(args);
    }
}