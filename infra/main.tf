# Terraform configuration for StadiumPulse AI Google Cloud Platform Infrastructure
# Provisions BigQuery, Cloud Run, Pub/Sub, and Firestore databases.

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# 1. Enable Required Google Cloud APIs
resource "google_project_service" "apis" {
  for_each = toset([
    "run.googleapis.com",
    "pubsub.googleapis.com",
    "firestore.googleapis.com",
    "bigquery.googleapis.com",
    "aiplatform.googleapis.com", # Vertex AI
    "translate.googleapis.com"
  ])
  service            = each.key
  disable_on_destroy = false
}

# 2. Pub/Sub Event Bus for IoT turnstile events
resource "google_pubsub_topic" "sensor_events" {
  name       = "sensor-events"
  depends_on = [google_project_service.apis]
}

# 3. BigQuery Dataset for sensor logs and sustainability metrics
resource "google_bigquery_dataset" "sensor_data" {
  dataset_id                  = "sensor_data"
  friendly_name               = "Stadium Influx Sensor Data"
  description                 = "Stores real-time turnstile entry events and sustainability audits"
  location                    = "US"
  default_table_expiration_ms = 3600000 * 24 * 7 # 7 days retention
  depends_on                  = [google_project_service.apis]
}

# 4. Firestore instance (State Layer)
resource "google_firestore_database" "stadium_state" {
  name        = "(default)"
  location_id = "nam5"
  type        = "FIRESTORE_ONLY"
  depends_on  = [google_project_service.apis]
}

# 5. Cloud Run services for the 5 agents
variable "agents" {
  type    = list(string)
  default = ["concierge-agent", "crowd-flow-agent", "incident-agent", "mobility-agent", "sustainability-agent"]
}

resource "google_cloud_run_v2_service" "agent_services" {
  for_each = toset(var.agents)
  name     = each.key
  location = var.region

  template {
    containers {
      image = "gcr.io/${var.project_id}/${each.key}:latest"
      
      env {
        name  = "GOOGLE_CLOUD_PROJECT"
        value = var.project_id
      }
      env {
        name  = "FIRESTORE_DATABASE"
        value = google_firestore_database.stadium_state.name
      }
    }
  }

  depends_on = [google_project_service.apis]
}
