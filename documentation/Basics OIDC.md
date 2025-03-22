# Oauth2 & openid connect

The [oauth2](https://datatracker.ietf.org/doc/html/rfc6749) protocol is used for authorization. In authorization only contains information if the requestor has permissions for an resource (like view document, delete document) . With authentication information about the requestor can be retrieved (like name, e-mail, phone, etc.) This is specified in the [Openid connect (OIDC)]([Explore All Specifications - OpenID Foundation](https://openid.net/developers/specs/)) standard. The OIDC is build on top of oauth (like an extension). 

## Identity Provider

There should be a trusted party that can be used to verify the user credentials. If this party also support OIDC than it is called an Identity Provider (IDP). Well known IDPs are facebook, github and google. There are also plenty of open source and commercial IDP provider. In this example open source IDP [Keycloak](https://www.keycloak.org/) is used. This IDP can run from a docker container and has a very user friendly web interface.

The user must trust the IDP (for example logging into google), but the IDP must also trust the web application (called client in OIDC)! In the IDP database the client is added with a client ID (and client secret). When requesting a token this client id is provided. 

### Token

The IDP will send an token to the requestor. A token is a base64 blob ([JWT](https://jwt.io/) with 3 sections:

* Header - Generic information about token (used encryption, expire date, etc. )

* Payload - Contains the actual data (claims, information)

* Signature - Ensures that the token is not modified (like digital signing of document)

There are various kinds of tokens like:

* access token - claims (also known as bearer token)

* identity token - requestor information (name, email, etc. )

* refresh token - needed to refresh a token

On the JWT website there is an online tool to decode and view the token. For security purposes the tokens (should) have a short lifetime (expire date). The standard define predefined fields, but it also possible to add custom fields (private claims, extra user info).

## HTTPS

A encrypted communication channel should be used when exchanging tokens (https uses TLS encryption).  When not encrypted attackers could use JWT token to fake identity (or just view user specific data). The combination of https and short expire time of a token should make it safe to use. For demo purpose a (unsecure) http connection is used (easer to setup)

## Token validation

For most of the time the JWT token is a blob of data for the web application. When invoking a REST API call on the backend, the JWT token blob is added to the REST header:

```
Authorization: Bearer <token>
```

The backend wil decode the JWT and check if the required claims are in the token. Because the JWT token is digital signed the backend service known that is validated by the IDP (there is no communication needed between backend end IDP). A exception is the identity token, the web client will decode this JWT token to extract the user information.

## Scope

With the scope concept can the request specify which information the IDP should include in the token. This is in addition to the standard information in the token. In the login screen of the IDP, the user gets information about what data is requested by the web application (client).

## REALM

For security reason all authentication with the same purpose should be grouped in a realm (namespace). It possible to use the default realm `master` but this is bad practice.

## Authentication flows

The standard describe several authentication flows that can be used to request a token. A flow describes the sequence of data exchange between user, client (web application) and IDP. The flow is designed to make it secure as possible.

* Authorization Code Flow

* Implicit Flow (Deprecated)

* Hybrid Flow

* Client Credentials Flow (No user login, server to server)

* Resource Owner Password Credentials (ROPC)

## OIDC library (includes OAUTH)

The OAUTH and OIDC standard only specify the protocol. It is not complicated to create your own REST calls and follow the authentication flow to retrieve a token from the IDP. The typescript [oidc-client-ts](https://authts.github.io/oidc-client-ts/) library handles this out-of-the-box (used in vue.js 3 application). 
