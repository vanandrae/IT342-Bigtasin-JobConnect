package edu.cit.bigtasin.jobconnectmobile.activities

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import edu.cit.bigtasin.jobconnectmobile.adapters.ApplicantsAdapter
import edu.cit.bigtasin.jobconnectmobile.databinding.ActivityApplicantsListBinding
import edu.cit.bigtasin.jobconnectmobile.network.RetrofitClient
import edu.cit.bigtasin.jobconnectmobile.utils.TokenManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class ApplicantsListActivity : AppCompatActivity() {
    private lateinit var binding: ActivityApplicantsListBinding
    private lateinit var tokenManager: TokenManager
    private lateinit var adapter: ApplicantsAdapter
    private val applicantsList = mutableListOf<Map<String, Any>>()
    private var jobId: Long = 0
    private var jobTitle: String = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityApplicantsListBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tokenManager = TokenManager(this)
        jobId = intent.getLongExtra("job_id", 0)
        jobTitle = intent.getStringExtra("job_title") ?: "Job"

        setupToolbar()
        setupRecyclerView()
        loadApplicants()
    }

    private fun setupToolbar() {
        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        binding.toolbar.setNavigationOnClickListener { onBackPressed() }
        supportActionBar?.title = "Applicants - $jobTitle"
    }

    private fun setupRecyclerView() {
        adapter = ApplicantsAdapter(applicantsList,
            onStatusChange = { applicationId, newStatus ->
                updateApplicationStatus(applicationId, newStatus)
            }
        )
        binding.rvApplicants.layoutManager = LinearLayoutManager(this)
        binding.rvApplicants.adapter = adapter
    }

    private fun loadApplicants() {
        showProgress(true)
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val token = tokenManager.getToken() ?: return@launch
                val applicants = RetrofitClient.instance.getJobApplications(jobId, "Bearer $token")
                withContext(Dispatchers.Main) {
                    applicantsList.clear()
                    applicantsList.addAll(applicants)
                    adapter.notifyDataSetChanged()
                    showProgress(false)
                    if (applicantsList.isEmpty()) {
                        binding.tvEmpty.visibility = android.view.View.VISIBLE
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@ApplicantsListActivity, "Failed to load applicants: ${e.message}", Toast.LENGTH_SHORT).show()
                    showProgress(false)
                }
            }
        }
    }

    private fun updateApplicationStatus(applicationId: Long, newStatus: String) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val token = tokenManager.getToken() ?: return@launch
                val statusMap = mapOf("status" to newStatus)
                val response = RetrofitClient.instance.updateApplicationStatus(applicationId, "Bearer $token", statusMap)
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@ApplicantsListActivity, "Status updated to $newStatus", Toast.LENGTH_SHORT).show()
                    loadApplicants() // Refresh list
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@ApplicantsListActivity, "Failed to update status: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun showProgress(show: Boolean) {
        binding.progressBar.visibility = if (show) android.view.View.VISIBLE else android.view.View.GONE
    }
}