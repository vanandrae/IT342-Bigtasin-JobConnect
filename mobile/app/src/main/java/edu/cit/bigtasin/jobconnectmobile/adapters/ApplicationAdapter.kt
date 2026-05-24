package edu.cit.bigtasin.jobconnectmobile.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import edu.cit.bigtasin.jobconnectmobile.databinding.ItemApplicationBinding
import edu.cit.bigtasin.jobconnectmobile.models.Application

class ApplicationAdapter(private var applications: List<Application>) :
    RecyclerView.Adapter<ApplicationAdapter.ApplicationViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ApplicationViewHolder {
        val binding = ItemApplicationBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ApplicationViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ApplicationViewHolder, position: Int) {
        holder.bind(applications[position])
    }

    override fun getItemCount() = applications.size

    inner class ApplicationViewHolder(private val binding: ItemApplicationBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(app: Application) {
            binding.tvJobTitle.text = app.jobTitle
            binding.tvCompany.text = app.employerName
            binding.tvLocation.text = app.jobLocation
            binding.tvStatus.text = app.status
            binding.tvDate.text = if (app.appliedAt.length >= 10) app.appliedAt.substring(0, 10) else app.appliedAt
        }
    }
}