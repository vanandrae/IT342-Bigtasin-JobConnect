package edu.cit.bigtasin.jobconnectmobile.activities

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import edu.cit.bigtasin.jobconnectmobile.adapters.ManageJobsAdapter
import edu.cit.bigtasin.jobconnectmobile.databinding.ActivityManageJobsBinding
import edu.cit.bigtasin.jobconnectmobile.models.Job
import edu.cit.bigtasin.jobconnectmobile.network.RetrofitClient
import edu.cit.bigtasin.jobconnectmobile.utils.TokenManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class ManageJobsActivity : AppCompatActivity() {
    private lateinit var binding: ActivityManageJobsBinding
    private lateinit var tokenManager: TokenManager
    private lateinit var jobAdapter: ManageJobsAdapter
    private val jobList = mutableListOf<Job>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityManageJobsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tokenManager = TokenManager(this)

        setupToolbar()
        setupRecyclerView()
        loadMyJobs()

        binding.fabAddJob.setOnClickListener {
            startActivity(Intent(this, PostJobActivity::class.java))
        }
    }

    private fun setupToolbar() {
        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        binding.toolbar.setNavigationOnClickListener { onBackPressed() }
        supportActionBar?.title = "My Job Listings"
    }

    private fun setupRecyclerView() {
        jobAdapter = ManageJobsAdapter(jobList,
            onItemClick = { job ->
                val intent = Intent(this, JobDetailActivity::class.java)
                intent.putExtra("job_id", job.id)
                intent.putExtra("is_employer_view", true)
                startActivity(intent)
            },
            onDeleteClick = { job ->
                showDeleteConfirmationDialog(job)
            },
            onViewApplicantsClick = { job ->
                val intent = Intent(this, ApplicantsListActivity::class.java)
                intent.putExtra("job_id", job.id)
                intent.putExtra("job_title", job.title)
                startActivity(intent)
            }
        )
        binding.rvJobs.layoutManager = LinearLayoutManager(this)
        binding.rvJobs.adapter = jobAdapter
    }

    private fun showDeleteConfirmationDialog(job: Job) {
        AlertDialog.Builder(this)
            .setTitle("Delete Job")
            .setMessage("Are you sure you want to delete '${job.title}'? This action cannot be undone.")
            .setPositiveButton("Delete") { _, _ ->
                deleteJob(job.id)
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun deleteJob(jobId: Long) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val token = tokenManager.getToken() ?: return@launch
                val response = RetrofitClient.instance.deleteJob(jobId, "Bearer $token")
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@ManageJobsActivity, "Job deleted successfully", Toast.LENGTH_SHORT).show()
                    loadMyJobs()
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@ManageJobsActivity, "Failed to delete job: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun loadMyJobs() {
        showProgress(true)
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val token = tokenManager.getToken() ?: return@launch
                val jobs = RetrofitClient.instance.getEmployerJobs("Bearer $token")
                withContext(Dispatchers.Main) {
                    jobList.clear()
                    jobList.addAll(jobs)
                    jobAdapter.notifyDataSetChanged()
                    showProgress(false)
                    binding.tvEmpty.visibility = if (jobList.isEmpty()) android.view.View.VISIBLE else android.view.View.GONE
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@ManageJobsActivity, "Failed to load jobs: ${e.message}", Toast.LENGTH_SHORT).show()
                    showProgress(false)
                }
            }
        }
    }

    private fun showProgress(show: Boolean) {
        binding.progressBar.visibility = if (show) android.view.View.VISIBLE else android.view.View.GONE
    }
}