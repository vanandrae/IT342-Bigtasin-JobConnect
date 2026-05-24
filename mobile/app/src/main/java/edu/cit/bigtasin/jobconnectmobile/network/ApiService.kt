package edu.cit.bigtasin.jobconnectmobile.network

import edu.cit.bigtasin.jobconnectmobile.models.*
import retrofit2.http.*

interface ApiService {
    // Auth endpoints
    @POST("api/auth/register")
    suspend fun register(@Body request: RegisterRequest): ApiResponse

    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): LoginResponse

    // Job endpoints - for job seekers
    @GET("api/jobs")
    suspend fun getAllJobs(@Header("Authorization") token: String): List<Job>

    @GET("api/jobs/{id}")
    suspend fun getJobById(@Path("id") id: Long, @Header("Authorization") token: String): Job

    // Job endpoints - for employers
    @POST("api/jobs")
    suspend fun createJob(@Header("Authorization") token: String, @Body job: Map<String, Any>): Job

    @GET("api/jobs/employer/me")
    suspend fun getEmployerJobs(@Header("Authorization") token: String): List<Job>

    @PUT("api/jobs/{id}")
    suspend fun updateJob(@Path("id") id: Long, @Header("Authorization") token: String, @Body job: Map<String, Any>): Job

    @DELETE("api/jobs/{id}")
    suspend fun deleteJob(@Path("id") id: Long, @Header("Authorization") token: String): Map<String, String>

    // Application endpoints
    @POST("api/applications")
    suspend fun applyForJob(@Query("jobId") jobId: Long, @Header("Authorization") token: String): Map<String, String>

    @GET("api/applications/user/me")
    suspend fun getUserApplications(@Header("Authorization") token: String): List<Application>

    @GET("api/applications/job/{jobId}")
    suspend fun getJobApplications(@Path("jobId") jobId: Long, @Header("Authorization") token: String): List<Map<String, Any>>

    @PATCH("api/applications/{id}/status")
    suspend fun updateApplicationStatus(@Path("id") id: Long, @Header("Authorization") token: String, @Body status: Map<String, String>): Map<String, String>

    // Favorite endpoints
    @GET("api/favorites")
    suspend fun getFavorites(@Header("Authorization") token: String): List<Job>

    @POST("api/favorites/{jobId}")
    suspend fun addFavorite(@Path("jobId") jobId: Long, @Header("Authorization") token: String): Map<String, String>

    @DELETE("api/favorites/{jobId}")
    suspend fun removeFavorite(@Path("jobId") jobId: Long, @Header("Authorization") token: String): Map<String, String>
}