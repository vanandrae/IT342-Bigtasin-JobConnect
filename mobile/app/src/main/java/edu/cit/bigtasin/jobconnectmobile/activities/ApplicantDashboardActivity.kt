package edu.cit.bigtasin.jobconnectmobile.activities

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.bottomnavigation.BottomNavigationView
import edu.cit.bigtasin.jobconnectmobile.R
import edu.cit.bigtasin.jobconnectmobile.adapters.JobAdapter
import edu.cit.bigtasin.jobconnectmobile.databinding.ActivityApplicantDashboardBinding
import edu.cit.bigtasin.jobconnectmobile.models.Job
import edu.cit.bigtasin.jobconnectmobile.models.Application
import edu.cit.bigtasin.jobconnectmobile.network.RetrofitClient
import edu.cit.bigtasin.jobconnectmobile.utils.TokenManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class ApplicantDashboardActivity : AppCompatActivity() {
    private lateinit var binding: ActivityApplicantDashboardBinding
    private lateinit var tokenManager: TokenManager
    private lateinit var jobAdapter: JobAdapter
    private val jobList = mutableListOf<Job>()
    private var appliedJobsList = mutableListOf<Application>()
    private var favoriteIds = mutableListOf<Long>()
    private var user = mapOf<String, String?>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityApplicantDashboardBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tokenManager = TokenManager(this)
        user = tokenManager.getUser()

        if (!tokenManager.isLoggedIn()) {
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
            return
        }

        setupToolbar()
        setupBottomNavigation()
        loadData()
    }

    private fun setupToolbar() {
        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayShowTitleEnabled(false)
        binding.tvWelcome.text = "Hello, ${user["fullName"] ?: user["username"]}"
    }

    private fun setupBottomNavigation() {
        binding.bottomNavigation.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_home -> {
                    loadJobs()
                    true
                }
                R.id.nav_applied -> {
                    startActivity(Intent(this, AppliedJobsActivity::class.java))
                    true
                }
                R.id.nav_favorites -> {
                    startActivity(Intent(this, FavoriteJobsActivity::class.java))
                    true
                }
                R.id.nav_profile -> {
                    startActivity(Intent(this, ProfileActivity::class.java))
                    true
                }
                else -> false
            }
        }
    }

    private fun loadData() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val token = tokenManager.getToken() ?: return@launch
                
                // Load jobs
                val jobs = RetrofitClient.instance.getAllJobs("Bearer $token")
                
                // Load applied jobs
                val applications = RetrofitClient.instance.getUserApplications("Bearer $token")
                
                // Load favorites
                val favorites = try {
                    RetrofitClient.instance.getFavorites("Bearer $token")
                } catch (e: Exception) {
                    emptyList()
                }
                
                withContext(Dispatchers.Main) {
                    jobList.clear()
                    jobList.addAll(jobs)
                    
                    appliedJobsList.clear()
                    appliedJobsList.addAll(applications)
                    
                    favoriteIds.clear()
                    favoriteIds.addAll(favorites.map { it.id })
                    
                    setupRecyclerView()
                    
                    binding.tvAppliedJobs.text = applications.size.toString()
                    binding.tvFavoriteJobs.text = favoriteIds.size.toString()
                    
                    showProgress(false)
                    if (jobList.isEmpty()) {
                        binding.tvEmpty.visibility = android.view.View.VISIBLE
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@ApplicantDashboardActivity, "Failed to load data: ${e.message}", Toast.LENGTH_SHORT).show()
                    showProgress(false)
                }
            }
        }
    }

    private fun setupRecyclerView() {
        val appliedJobIds = appliedJobsList.map { it.jobId }
        
        jobAdapter = JobAdapter(
            jobs = jobList,
            onItemClick = { job ->
                val intent = Intent(this, JobDetailActivity::class.java)
                intent.putExtra("job_id", job.id)
                startActivity(intent)
            },
            onFavoriteClick = { job -> toggleFavorite(job.id) },
            isEmployerView = false,
            appliedJobIds = appliedJobIds
        )
        binding.rvJobs.layoutManager = LinearLayoutManager(this)
        binding.rvJobs.adapter = jobAdapter
    }

    private fun loadJobs() {
        showProgress(true)
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val token = tokenManager.getToken() ?: return@launch
                val jobs = RetrofitClient.instance.getAllJobs("Bearer $token")
                withContext(Dispatchers.Main) {
                    jobList.clear()
                    jobList.addAll(jobs)
                    jobAdapter.notifyDataSetChanged()
                    showProgress(false)
                    binding.tvEmpty.visibility = if (jobList.isEmpty()) android.view.View.VISIBLE else android.view.View.GONE
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@ApplicantDashboardActivity, "Failed to load jobs", Toast.LENGTH_SHORT).show()
                    showProgress(false)
                }
            }
        }
    }

    private fun toggleFavorite(jobId: Long) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val token = tokenManager.getToken() ?: return@launch
                if (favoriteIds.contains(jobId)) {
                    RetrofitClient.instance.removeFavorite(jobId, "Bearer $token")
                    favoriteIds.remove(jobId)
                    withContext(Dispatchers.Main) {
                        Toast.makeText(this@ApplicantDashboardActivity, "Removed from favorites", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    RetrofitClient.instance.addFavorite(jobId, "Bearer $token")
                    favoriteIds.add(jobId)
                    withContext(Dispatchers.Main) {
                        Toast.makeText(this@ApplicantDashboardActivity, "Added to favorites", Toast.LENGTH_SHORT).show()
                    }
                }
                // Refresh stats
                binding.tvFavoriteJobs.text = favoriteIds.size.toString()
                // Refresh adapter to update star icons
                jobAdapter.notifyDataSetChanged()
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@ApplicantDashboardActivity, "Failed to update favorites", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun showProgress(show: Boolean) {
        binding.progressBar.visibility = if (show) android.view.View.VISIBLE else android.view.View.GONE
    }
}