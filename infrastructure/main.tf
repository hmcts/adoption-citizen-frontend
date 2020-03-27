provider "azurerm" {}

locals {
  public_hostname = "${var.product}-${var.component}-${var.env}.service.${local.aseName}.internal"
  vault_name    = "${(var.env == "preview" || var.env == "spreview") ? (var.env == "preview") ? "${var.raw_product}-aat" : "${var.raw_product}-saat" : "${var.raw_product}-${var.env}"}"
}

resource "azurerm_resource_group" "rg" {
  name     = "${var.product}-${var.component}-${var.env}"
  location = "${var.location}"

  tags     = "${var.common_tags}"
}

resource "azurerm_application_insights" "appinsights" {
  name                = "${var.product}-appinsights-${var.env}"
  location            = "${var.appinsights_location}"
  resource_group_name = "${azurerm_resource_group.rg.name}"
  application_type    = "web"

  tags                = "${var.common_tags}"
}

module "key-vault" {
  source                     = "git@github.com:hmcts/cnp-module-key-vault?ref=master"
  name                       = "${var.product}-${var.env}"
  product                    = "${var.product}"
  env                        = "${var.env}"
  tenant_id                  = "${var.tenant_id}"
  object_id                  = "${var.jenkins_AAD_objectId}"
  resource_group_name        = "${azurerm_resource_group.rg.name}"
  product_group_object_id    = ""
  common_tags                = "${var.common_tags}"

  #aks migration
  managed_identity_object_id = "${var.managed_identity_object_id}"
}

data "azurerm_key_vault" "adoption_key_vault" {
  name                = "${local.vault_name}"
  resource_group_name = "${local.vault_name}"
}

data "azurerm_key_vault_secret" "oauth_client_secret" {
  name = "oauth-client-secret"
  key_vault_id        = "${data.azurerm_key_vault.adoption_key_vault.id}"
}

module "adoption-frontend" {
  source                          = "git@github.com:hmcts/cnp-module-webapp?ref=master"
  product                         = "${var.product}-${var.component}"
  location                        = "${var.location}"
  env                             = "${var.env}"
  ilbIp                           = "${var.ilbIp}"
  is_frontend                     = "${var.env != "preview" ? 1: 0}"
  subscription                    = "${var.subscription}"
  additional_host_name            = "${var.env != "preview" ? var.additional_host_name : "null"}"
  https_only                      = "false"
  capacity                        = "${var.capacity}"
  common_tags                     = "${var.common_tags}"
  instance_size                   = "I3"
  appinsights_instrumentation_key = "${var.appinsights_instrumentation_key}"
  enable_ase                      = "${var.enable_ase}"

  app_settings = {

    // Node specific vars
    NODE_ENV = "${var.node_env}"
    NODE_PATH = "${var.node_path}"
    WEBSITE_NODE_DEFAULT_VERSION = "${var.node_version}"

    BASE_URL = "${var.public_protocol}://${local.public_hostname}"

    UV_THREADPOOL_SIZE = "${var.uv_threadpool_size}"
    NODE_CONFIG_DIR = "${var.node_config_dir}"

    // Logging vars
    REFORM_TEAM = "${var.reform_team}"
    component = "${var.component}"
    REFORM_ENVIRONMENT = "${var.env}"
    DEPLOYMENT_ENV="${var.deployment_env}"

    // Packages
    PACKAGES_NAME="${var.packages_name}"
    PACKAGES_PROJECT="${var.packages_project}"
    PACKAGES_ENVIRONMENT="${var.packages_environment}"
    PACKAGES_VERSION="${var.packages_version}"

    // Service name
    SERVICE_NAME="${var.frontend_service_name}"

    // IDAM
    IDAM_API_URL = "${var.idam_api_url}"
    IDAM_AUTHENTICATION_WEB_URL = "${var.authentication_web_url}"
    OAUTH_CLIENT_SECRET = "${data.azurerm_key_vault_secret.oauth_client_secret.value}"
  }
}
