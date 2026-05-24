package edu.cit.bigtasin.jobconnectmobile.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.ArrayAdapter
import androidx.appcompat.app.AlertDialog
import androidx.recyclerview.widget.RecyclerView
import edu.cit.bigtasin.jobconnectmobile.databinding.ItemApplicantBinding

class ApplicantsAdapter(
    private var applicants: List<Map<String, Any>>,
    private val onStatusChange: (Long, String) -> Unit
) : RecyclerView.Adapter<ApplicantsAdapter.ApplicantViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ApplicantViewHolder {
        val binding = ItemApplicantBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ApplicantViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ApplicantViewHolder, position: Int) {
        holder.bind(applicants[position])
    }

    override fun getItemCount() = applicants.size

    inner class ApplicantViewHolder(private val binding: ItemApplicantBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(applicant: Map<String, Any>) {
            val name = applicant["seekerName"] as? String ?: "Unknown"
            val email = applicant["email"] as? String ?: "No email"
            val status = applicant["status"] as? String ?: "PENDING"
            val appliedAt = applicant["appliedAt"] as? String ?: ""

            binding.tvName.text = name
            binding.tvEmail.text = email
            binding.tvStatus.text = status
            binding.tvAppliedDate.text = if (appliedAt.isNotEmpty()) appliedAt.substring(0, 10) else "Unknown date"

            // Set status color
            val statusColor = when (status) {
                "PENDING" -> android.graphics.Color.parseColor("#F59E0B")
                "SHORTLISTED" -> android.graphics.Color.parseColor("#8B5CF6")
                "APPROVED" -> android.graphics.Color.parseColor("#10B981")
                "REJECTED" -> android.graphics.Color.parseColor("#EF4444")
                else -> android.graphics.Color.parseColor("#6B7280")
            }
            binding.tvStatus.setTextColor(statusColor)

            binding.btnChangeStatus.setOnClickListener {
                showStatusDialog(applicant["id"] as? Long ?: 0, status)
            }
        }

        private fun showStatusDialog(applicationId: Long, currentStatus: String) {
            val options = arrayOf("PENDING", "SHORTLISTED", "APPROVED", "REJECTED")
            val builder = AlertDialog.Builder(binding.root.context)
            builder.setTitle("Change Application Status")
            builder.setItems(options) { _, which ->
                if (options[which] != currentStatus) {
                    onStatusChange(applicationId, options[which])
                }
            }
            builder.show()
        }
    }
}