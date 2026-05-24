package edu.cit.bigtasin.jobconnectmobile.activities

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import edu.cit.bigtasin.jobconnectmobile.R
import edu.cit.bigtasin.jobconnectmobile.databinding.ActivityJobDetailBinding
import edu.cit.bigtasin.jobconnectmobile.network.RetrofitClient
import edu.cit.bigtasin.jobconnectmobile.utils.TokenManager
import kotlinx.coroutines.launch

class JobDetailActivity : AppCompatActivity() {
    private lateinit var binding: ActivityJobDetailBinding
    private lateinit var tokenManager: TokenManager
    private var jobId: Long = 0
    private var isEmployerView: Boolean = false
    private var hasApplied = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityJobDetailBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tokenManager = TokenManager(this)
        jobId = intent.getLongExtra("job_id", 0)
        isEmployerView = intent.getBooleanExtra("is_employer_view", false)

        if (jobId == 0L) finish()

        setupToolbar()
        
        if (isEmployerView) {
            binding.btnApply.visibility = android.view.View.GONE
            loadJobDetails()
        } else {
            checkIfApplied()
        }
    }

    private fun setupToolbar() {
        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        binding.toolbar.setNavigationOnClickListener { onBackPressed() }
    }

    private fun checkIfApplied() {
        lifecycleScope.launch {
            try {
                val token = tokenManager.getToken() ?: return@launch
                val applications = RetrofitClient.instance.getUserApplications("Bearer $token")
                hasApplied = applications.any { it.jobId == jobId }
                
                loadJobDetails()
                
                if (hasApplied) {
                    binding.btnApply.isEnabled = false
                    binding.btnApply.text = "Already Applied"
                    binding.btnApply.setBackgroundColor(ContextCompat.getColor(this@JobDetailActivity, R.color.gray))
                } else {
                    binding.btnApply.setOnClickListener { applyForJob() }
                }
            } catch (e: Exception) {
                loadJobDetails()
                binding.btnApply.setOnClickListener { applyForJob() }
            }
        }
    }

    private fun loadJobDetails() {
        showProgress(true)
        lifecycleScope.launch {
            try {
                val token = tokenManager.getToken() ?: return@launch
                val job = RetrofitClient.instance.getJobById(jobId, "Bearer $token")
                binding.tvTitle.text = job.title
                binding.tvCompany.text = job.employerName ?: "Company"
                binding.tvLocation.text = job.location
                binding.tvType.text = job.employmentType
                binding.tvSalary.text = job.salaryRange
                binding.tvDescription.text = job.description
                showProgress(false)
            } catch (e: Exception) {
                Toast.makeText(this@JobDetailActivity, "Failed to load job details", Toast.LENGTH_SHORT).show()
                finish()
            }
        }
    }

    private fun applyForJob() {
        if (hasApplied) {
            Toast.makeText(this, "You have already applied for this job", Toast.LENGTH_SHORT).show()
            return
        }

        lifecycleScope.launch {
            try {
                val token = tokenManager.getToken() ?: return@launch
                val response = RetrofitClient.instance.applyForJob(jobId, "Bearer $token")
                Toast.makeText(this@JobDetailActivity, response["message"] ?: "Applied successfully", Toast.LENGTH_SHORT).show()
                hasApplied = true
                binding.btnApply.isEnabled = false
                binding.btnApply.text = "Applied"
                binding.btnApply.setBackgroundColor(ContextCompat.getColor(this@JobDetailActivity, R.color.gray))
            } catch (e: Exception) {
                val errorMsg = if (e.message?.contains("400") == true) {
                    "You have already applied for this job"
                } else {
                    "Failed to apply: ${e.message}"
                }
                Toast.makeText(this@JobDetailActivity, errorMsg, Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun showProgress(show: Boolean) {
        binding.progressBar.visibility = if (show) android.view.View.VISIBLE else android.view.View.GONE
    }
}