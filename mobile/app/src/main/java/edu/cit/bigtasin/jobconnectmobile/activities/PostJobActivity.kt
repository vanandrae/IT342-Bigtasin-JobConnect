package edu.cit.bigtasin.jobconnectmobile.activities

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import edu.cit.bigtasin.jobconnectmobile.databinding.ActivityPostJobBinding
import edu.cit.bigtasin.jobconnectmobile.network.RetrofitClient
import edu.cit.bigtasin.jobconnectmobile.utils.TokenManager
import kotlinx.coroutines.launch

class PostJobActivity : AppCompatActivity() {
    private lateinit var binding: ActivityPostJobBinding
    private lateinit var tokenManager: TokenManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPostJobBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tokenManager = TokenManager(this)

        setupToolbar()
        setupSpinners()
        setupSalaryRangeFilter()
        setupClickListeners()
    }

    private fun setupToolbar() {
        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        binding.toolbar.setNavigationOnClickListener { onBackPressed() }
        supportActionBar?.title = "Post a Job"
    }

    private fun setupSpinners() {
        // Category Spinner
        val categories = arrayOf("Engineering", "Design", "Product", "Marketing", "Sales", "Human Resources", "Finance", "Operations")
        val categoryAdapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, categories)
        binding.spinnerCategory.adapter = categoryAdapter

        // Employment Type Spinner
        val types = arrayOf("FULL_TIME", "PART_TIME", "CONTRACT", "REMOTE", "INTERNSHIP")
        val typeAdapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, types)
        binding.spinnerEmploymentType.adapter = typeAdapter
    }

    private fun setupSalaryRangeFilter() {
        binding.etSalaryRange.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}

            override fun afterTextChanged(s: Editable?) {
                if (s != null) {
                    // Remove all non-numeric characters except spaces and hyphens
                    val filtered = s.toString().replace(Regex("[^0-9\\s-]"), "")
                    if (s.toString() != filtered) {
                        binding.etSalaryRange.setText(filtered)
                        binding.etSalaryRange.setSelection(filtered.length)
                    }
                }
            }
        })
    }

    private fun setupClickListeners() {
        binding.btnPostJob.setOnClickListener {
            submitJob()
        }
    }

    private fun submitJob() {
        val title = binding.etTitle.text.toString().trim()
        val description = binding.etDescription.text.toString().trim()
        val category = binding.spinnerCategory.selectedItem.toString()
        val salaryRange = binding.etSalaryRange.text.toString().trim()
        val location = binding.etLocation.text.toString().trim()
        val employmentType = binding.spinnerEmploymentType.selectedItem.toString()

        // Validate required fields
        if (title.isEmpty()) {
            binding.etTitle.error = "Job title is required"
            return
        }
        if (description.isEmpty()) {
            binding.etDescription.error = "Job description is required"
            return
        }
        if (location.isEmpty()) {
            binding.etLocation.error = "Location is required"
            return
        }

        val jobData = mapOf(
            "title" to title,
            "description" to description,
            "category" to category,
            "salaryRange" to salaryRange,
            "location" to location,
            "employmentType" to employmentType,
            "status" to "OPEN"
        )

        showProgress(true)
        lifecycleScope.launch {
            try {
                val token = tokenManager.getToken() ?: return@launch
                RetrofitClient.instance.createJob("Bearer $token", jobData)
                Toast.makeText(this@PostJobActivity, "Job posted successfully!", Toast.LENGTH_SHORT).show()
                finish()
            } catch (e: Exception) {
                Toast.makeText(this@PostJobActivity, "Failed to post job: ${e.message}", Toast.LENGTH_SHORT).show()
                showProgress(false)
            }
        }
    }

    private fun showProgress(show: Boolean) {
        binding.btnPostJob.isEnabled = !show
        binding.progressBar.visibility = if (show) android.view.View.VISIBLE else android.view.View.GONE
    }
}