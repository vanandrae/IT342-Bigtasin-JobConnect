package edu.cit.bigtasin.jobconnectmobile.activities

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import edu.cit.bigtasin.jobconnectmobile.adapters.ApplicationAdapter
import edu.cit.bigtasin.jobconnectmobile.databinding.ActivityAppliedJobsBinding
import edu.cit.bigtasin.jobconnectmobile.models.Application
import edu.cit.bigtasin.jobconnectmobile.network.RetrofitClient
import edu.cit.bigtasin.jobconnectmobile.utils.TokenManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class AppliedJobsActivity : AppCompatActivity() {
    private lateinit var binding: ActivityAppliedJobsBinding
    private lateinit var tokenManager: TokenManager
    private lateinit var adapter: ApplicationAdapter
    private val applicationList = mutableListOf<Application>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAppliedJobsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tokenManager = TokenManager(this)

        binding.toolbar.setNavigationOnClickListener { onBackPressed() }

        adapter = ApplicationAdapter(applicationList)
        binding.rvApplications.layoutManager = LinearLayoutManager(this)
        binding.rvApplications.adapter = adapter

        loadApplications()
    }

    private fun loadApplications() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val token = tokenManager.getToken() ?: return@launch
                val response = RetrofitClient.instance.getUserApplications("Bearer $token")
                withContext(Dispatchers.Main) {
                    applicationList.clear()
                    applicationList.addAll(response)
                    adapter.notifyDataSetChanged()
                    binding.progressBar.visibility = android.view.View.GONE
                    if (applicationList.isEmpty()) binding.tvEmpty.visibility = android.view.View.VISIBLE
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@AppliedJobsActivity, "Failed to load applications", Toast.LENGTH_SHORT).show()
                    binding.progressBar.visibility = android.view.View.GONE
                }
            }
        }
    }
}