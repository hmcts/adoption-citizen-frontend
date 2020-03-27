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
