#  SPACE configuration

## Environment variables:

### ENVIRONMENT

Environment can take the following values:
- development
- testing
- production

If you choose `development` or `testing` MongoDB get populated automatically
with `json` schemas. Use `production` if you want a clean setup of SPACE.

:::info

If you choose `development` or `testing` MongoDB automatically populates with
the JSON definitions defined in `space/api/src/main/database/seeders/mongo`:
- `contracts/contracts.json`
- `pricings/pricings.json`
- `services/services.json`
- `users/users.json`

:::

### REDIS_URL

URL pointing to a deployed Redis instance 

### JWT_SECRET

password used in JSON Web Signature

### JWT_SALT

Salt to used in PBKDF2 algorithm

### JWT_EXPIRATION

Duration of the JWT. 

### ADMIN_USER

Default admin username 

### ADMIN_PASSWORD

Default admin password
