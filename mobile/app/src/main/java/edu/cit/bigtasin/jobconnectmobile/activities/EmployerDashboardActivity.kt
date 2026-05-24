package edu.cit.bigtasin.jobconnectmobile.activities

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.bottomnavigation.BottomNavigationView
import edu.cit.bigtasin.jobconnectmobile.R
import edu.cit.bigtasin.jobconnectmobile.adapters.JobAdapter
import edu.cit.bigtasin.jobconnectmobile.databinding.ActivityEmployerDashboardBinding
import edu.cit.bigtasin.jobconnectmobile.models.Job
import edu.cit.bigtasin.jobconnectmobile.network.RetrofitClient
import edu.cit.bigtasin.jobconnectmobile.utils.TokenManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class EmployerDashboardActivity : AppCompatActivity() {
    private lateinit var binding: ActivityEmployerDashboardBinding
    private lateinit var tokenManager: TokenManager
    private lateinit var jobAdapter: JobAdapter
    private val jobList = mutableListOf<Job>()
    private var user = mapOf<String, String?>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityEmployerDashboardBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tokenManager = TokenManager(this)
        user = tokenManager.getUser()

        if (!tokenManager.isLoggedIn()) {
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
            return
        }

        setupToolbar()
        setupRecyclerView()
        setupBottomNavigation()
        loadJobs()
        loadStats()
    }

    private fun setupToolbar() {
        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayShowTitleEnabled(false)
        // Toolbar already has JobConnect logo in XML
    }

    private fun setupRecyclerView() {
        // Pass false for isEmployerView to hide apply button
        jobAdapter = JobAdapter(jobList,
            onItemClick = { job ->
                val intent = Intent(this, JobDetailActivity::class.java)
                intent.putExtra("job_id", job.id)
                intent.putExtra("is_employer_view", true)
                startActivity(intent)
            },
            onFavoriteClick = null,
            isEmployerView = true
        )
        binding.rvJobs.layoutManager = LinearLayoutManager(this)
        binding.rvJobs.adapter = jobAdapter
    }

    private fun setupBottomNavigation() {
        binding.bottomNavigation.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_home -> {
                    loadJobs()
                    true
                }
                R.id.nav_post_job -> {
                    startActivity(Intent(this, PostJobActivity::class.java))
                    true
                }
                R.id.nav_manage_jobs -> {
                    startActivity(Intent(this, ManageJobsActivity::class.java))
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
                    Toast.makeText(this@EmployerDashboardActivity, "Failed to load jobs", Toast.LENGTH_SHORT).show()
                    showProgress(false)
                }
            }
        }
    }

    private fun loadStats() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val token = tokenManager.getToken() ?: return@launch
                val jobs = RetrofitClient.instance.getEmployerJobs("Bearer $token")
                withContext(Dispatchers.Main) {
                    binding.tvTotalJobs.text = jobs.size.toString()
                    binding.tvActiveJobs.text = jobs.filter { it.status == "OPEN" }.size.toString()
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    binding.tvTotalJobs.text = "0"
                    binding.tvActiveJobs.text = "0"
                }
            }
        }
    }

    private fun showProgress(show: Boolean) {
        binding.progressBar.visibility = if (show) android.view.View.VISIBLE else android.view.View.GONE
    }
}