package edu.cit.bigtasin.jobconnectmobile.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import edu.cit.bigtasin.jobconnectmobile.databinding.ItemManageJobBinding
import edu.cit.bigtasin.jobconnectmobile.models.Job

class ManageJobsAdapter(
    private var jobs: List<Job>,
    private val onItemClick: (Job) -> Unit,
    private val onDeleteClick: (Job) -> Unit,
    private val onViewApplicantsClick: (Job) -> Unit
) : RecyclerView.Adapter<ManageJobsAdapter.ManageJobViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ManageJobViewHolder {
        val binding = ItemManageJobBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ManageJobViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ManageJobViewHolder, position: Int) {
        holder.bind(jobs[position])
    }

    override fun getItemCount() = jobs.size

    inner class ManageJobViewHolder(private val binding: ItemManageJobBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(job: Job) {
            binding.tvTitle.text = job.title
            binding.tvCompany.text = job.employerName ?: "Company"
            binding.tvLocation.text = job.location
            binding.tvType.text = job.employmentType
            binding.tvSalary.text = job.salaryRange
            
            val statusText = if (job.status == "OPEN") "Active" else "Closed"
            val statusColor = if (job.status == "OPEN") android.graphics.Color.parseColor("#0BA02C") else android.graphics.Color.parseColor("#666")
            binding.tvStatus.text = statusText
            binding.tvStatus.setTextColor(statusColor)

            binding.cardView.setOnClickListener { onItemClick(job) }
            binding.btnDelete.setOnClickListener { onDeleteClick(job) }
            binding.btnViewApplicants.setOnClickListener { onViewApplicantsClick(job) }
        }
    }
}