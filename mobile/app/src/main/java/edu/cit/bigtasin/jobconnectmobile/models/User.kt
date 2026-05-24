package edu.cit.bigtasin.jobconnectmobile.models

data class User(
    val id: Long? = null,
    val username: String,
    val email: String,
    val fullName: String,
    val role: String = "JOBSEEKER"
)

data class LoginRequest(val username: String, val password: String)

data class LoginResponse(
    val token: String,
    val username: String,
    val email: String,
    val role: String,
    val fullName: String
)

data class RegisterRequest(
    val username: String,
    val email: String,
    val password: String,
    val fullName: String,
    val role: String = "JOBSEEKER"
)

data class ApiResponse(val message: String, val user: User?)