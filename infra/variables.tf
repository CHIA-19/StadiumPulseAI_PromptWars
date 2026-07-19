variable "project_id" {
  type        = string
  description = "The Google Cloud Project ID to deploy resources to"
  default     = "stadium-pulse-ai-2026"
}

variable "region" {
  type        = string
  description = "The target deployment region for Google Cloud resources"
  default     = "us-central1"
}
