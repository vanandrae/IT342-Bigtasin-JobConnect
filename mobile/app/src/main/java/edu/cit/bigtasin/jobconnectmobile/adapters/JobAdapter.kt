package edu.cit.bigtasin.jobconnectmobile.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import edu.cit.bigtasin.jobconnectmobile.R
import edu.cit.bigtasin.jobconnectmobile.databinding.ItemJobBinding
import edu.cit.bigtasin.jobconnectmobile.models.Job

class JobAdapter(
    private var jobs: List<Job>,
    private val onItemClick: (Job) -> Unit,
    private val onFavoriteClick: ((Job) -> Unit)?,
    private val isEmployerView: Boolean = false,
    private val appliedJobIds: List<Long> = emptyList()
) : RecyclerView.Adapter<JobAdapter.JobViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): JobViewHolder {
        val binding = ItemJobBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return JobViewHolder(binding)
    }

    override fun onBindViewHolder(holder: JobViewHolder, position: Int) {
        holder.bind(jobs[position])
    }

    override fun getItemCount() = jobs.size

    fun updateAppliedJobs(ids: List<Long>) {
        notifyDataSetChanged()
    }

    inner class JobViewHolder(private val binding: ItemJobBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(job: Job) {
            binding.tvTitle.text = job.title
            binding.tvCompany.text = job.employerName ?: "Company"
            binding.tvLocation.text = job.location
            binding.tvSalary.text = job.salaryRange
            binding.tvType.text = job.employmentType

            val isApplied = appliedJobIds.contains(job.id)

            if (isEmployerView) {
                binding.btnApply.visibility = android.view.View.GONE
                binding.btnFavorite.visibility = android.view.View.GONE
            } else {
                if (isApplied) {
                    binding.btnApply.isEnabled = false
                    binding.btnApply.text = "Applied"
                    binding.btnApply.setBackgroundColor(
                        ContextCompat.getColor(binding.root.context, R.color.gray)
                    )
                } else {
                    binding.btnApply.isEnabled = true
                    binding.btnApply.text = "Apply Now"
                    binding.btnApply.setBackgroundColor(
                        ContextCompat.getColor(binding.root.context, R.color.primary)
                    )
                }
                binding.btnApply.setOnClickListener { onItemClick(job) }
                binding.btnFavorite.setOnClickListener { onFavoriteClick?.invoke(job) }
            }

            binding.root.setOnClickListener { onItemClick(job) }
        }
    }
}