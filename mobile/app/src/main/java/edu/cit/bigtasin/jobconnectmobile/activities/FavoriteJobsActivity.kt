package edu.cit.bigtasin.jobconnectmobile.activities

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import edu.cit.bigtasin.jobconnectmobile.adapters.JobAdapter
import edu.cit.bigtasin.jobconnectmobile.databinding.ActivityFavoriteJobsBinding
import edu.cit.bigtasin.jobconnectmobile.models.Job
import edu.cit.bigtasin.jobconnectmobile.network.RetrofitClient
import edu.cit.bigtasin.jobconnectmobile.utils.TokenManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class FavoriteJobsActivity : AppCompatActivity() {
    private lateinit var binding: ActivityFavoriteJobsBinding
    private lateinit var tokenManager: TokenManager
    private lateinit var adapter: JobAdapter
    private val favoriteJobs = mutableListOf<Job>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityFavoriteJobsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tokenManager = TokenManager(this)

        binding.toolbar.setNavigationOnClickListener { onBackPressed() }

        adapter = JobAdapter(favoriteJobs,
            onItemClick = { job ->
                val intent = Intent(this, JobDetailActivity::class.java)
                intent.putExtra("job_id", job.id)
                startActivity(intent)
            },
            onFavoriteClick = null
        )
        binding.rvFavorites.layoutManager = LinearLayoutManager(this)
        binding.rvFavorites.adapter = adapter

        loadFavoriteJobs()
    }

    private fun loadFavoriteJobs() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val token = tokenManager.getToken() ?: return@launch
                val allJobs = RetrofitClient.instance.getAllJobs("Bearer $token")
                val prefs = getSharedPreferences("favorites", MODE_PRIVATE)
                val favoriteIds = prefs.getStringSet("jobs", emptySet()) ?: emptySet()
                val filtered = allJobs.filter { favoriteIds.contains(it.id.toString()) }
                withContext(Dispatchers.Main) {
                    favoriteJobs.clear()
                    favoriteJobs.addAll(filtered)
                    adapter.notifyDataSetChanged()
                    binding.progressBar.visibility = android.view.View.GONE
                    if (favoriteJobs.isEmpty()) binding.tvEmpty.visibility = android.view.View.VISIBLE
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@FavoriteJobsActivity, "Failed to load favorites", Toast.LENGTH_SHORT).show()
                    binding.progressBar.visibility = android.view.View.GONE
                }
            }
        }
    }
}