package edu.cit.bigtasin.jobconnectmobile.models

data class Job(
    val id: Long,
    val title: String,
    val description: String,
    val category: String,
    val salaryRange: String,
    val location: String,
    val employmentType: String,
    val status: String,
    val employerName: String?,
    val applicantCount: Int = 0
)