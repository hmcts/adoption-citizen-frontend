// Infrastructural variables
variable "reform_team" {
  default = "adoption"
}

variable "product" {
  default = "adoption"
  type = "string"
}

variable "frontend_service_name" {
  default = "adoption-frontend"
}

variable "deployment_env" {
  type = "string"
}

variable "microservice" {
  default = "adoption-frontend"
}

variable "raw_product" {
  type    = "string"
  default = "adoption"    // jenkins-library overrides product for PRs and adds e.g. pr-1-adoption
}

variable "component" {
  type = "string"
}

variable "location" {
  default = "UK South"
}

variable "env" {
  type = "string"
}

variable "ilbIp" {}

variable "subscription" {}

variable "common_tags" {
  type = "map"
}

variable "team_contact" {
  default = "#fpla_adoption_tech"
}

variable "tenant_id" {
  description = "(Required) The Azure Active Directory tenant ID that should be used for authenticating requests to the key vault. This is usually sourced from environment variables and not normally required to be specified."
}

variable "jenkins_AAD_objectId" {
  description = "(Required) The Azure AD object ID of a user, service principal or security group in the Azure Active Directory tenant for the vault. The object ID must be unique for the list of access policies."
}


variable "node_config_dir" {
  // for Unix
  // default = "/opt/adoption/frontend/config"

  // for Windows
  default = "D:\\home\\site\\wwwroot\\config"
}

variable "managed_identity_object_id" {
  default = ""
}

variable "enable_ase" {
  default = true
}

variable "appinsights_location" {
  type        = "string"
  default     = "West Europe"
  description = "Location for Application Insights"
}

variable "appinsights_instrumentation_key" {
  description = "Instrumentation key of the App Insights instance this webapp should use. Module will create own App Insights resource if this is not provided"
  default     = ""
}

// IDAM
variable "idam_api_url" {
  type = "string"
}

variable "idam_client_id" {
  type    = "string"
  default = "adoption"
}

variable "security_enabled" {
  type = "string"
  default = "false"
}

variable "idam_token_issuer_uri" {
  type    = "string"
  default = ""
}

variable "idam_token_jwk_set_uri" {
  type    = "string"
  default = ""
}

variable "authentication_web_url" {
  default = ""
}

// Package details
variable "packages_name" {
  default = "adoption-frontend"
}

variable "packages_project" {
  default = "adoption"
}

variable "packages_environment" {
  type = "string"
}

variable "packages_version" {
  default = "-1"
}

variable "public_protocol" {
  default = "https"
}

variable "http_proxy" {
  default = "http://proxyout.reform.hmcts.net:8080/"
}

variable "health_endpoint" {
  default = "/health"
}

variable "additional_host_name" {
  type = "string"
}

variable "capacity" {
  default = "1"
}

// CNP settings
variable "uv_threadpool_size" {
  default = "64"
}

variable "node_env" {
  default = "production"
}

variable "node_path" {
  default = "."
}

variable "node_version" {
  default = "12.14.1"
}
