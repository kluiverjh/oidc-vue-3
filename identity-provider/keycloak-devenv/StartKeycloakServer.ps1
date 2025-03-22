Write-Host "Start Keycloak server and import demo realm" -ForegroundColor Green

podman rm -f keycloakdemo

podman run -d --name keycloakdemo `
  -p 8080:8080 `
  -v "${PWD}/import:/opt/keycloak/data/import" `
  -e KEYCLOAK_ADMIN=admin `
  -e KEYCLOAK_ADMIN_PASSWORD=adminpwd `
  quay.io/keycloak/keycloak:latest `
  start-dev  --import-realm

Write-Host "Open website: http:\\localhost:8080" -ForegroundColor Green
Write-Host "Login with admin and adminpwd" -ForegroundColor Green

