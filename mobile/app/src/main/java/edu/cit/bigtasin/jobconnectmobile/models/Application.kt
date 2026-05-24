package edu.cit.bigtasin.jobconnectmobile.models

data class Application(
    val id: Long,
    val jobId: Long,
    val jobTitle: String,
    val jobLocation: String,
    val employerName: String,
    val status: String,
    val appliedAt: String
)