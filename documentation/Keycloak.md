# Keycloak

## Automatic configure Keycloak

A docker container is used to run Keycloak. It is possible to use the [keycloak webportal](http://localhost:8080) to configure it . For the demo some sample configuration should be added. There are multiple approaches of automating this, for example:  

* [Keycloak Admin CLI](https://www.keycloak.org/docs/latest/server_admin/index.html#admin-cli) (`kcadm.sh`)

* [Keycloak Admin REST API](https://www.keycloak.org/docs-api/latest/rest-api/index.html) (powershell)

* [Use Realm JSON Import](https://www.keycloak.org/server/importExport)

* [Terraform Provider for Keycloak](https://registry.terraform.io/providers/mrparkers/keycloak/latest/docs#keycloak-setup)

## Initial values Keycloak

This demo uses the REALM import functionality. On startup of the container, the REALM file is imported in the `demo` realm. 

To update the database:

* Login webportal Keycloak (user `admin` with password `adminpwd`)

* Select REALM `demo`

* Select `Realm settings`

* In the `action section` select `Partial export`

* Export the file with all options .

* Update the content of`import\demo-realm-import.json` with the new export
