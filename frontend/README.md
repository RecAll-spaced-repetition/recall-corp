# RecALL frontend

## Configuring environment
- Bun 1.3.6

```bash
bun i --frozen-lockfile
```

## Running
```bash
bun run dev
```

## OpenAPI services generation
1. Place new OpenAPI schema to `openapi.json`
2. Run `bun run generate-api`

## Tests
```bash
docker compose run frontend-test --build --rm
```
or (if environment configured)
```bash
bun run checks
```

This will check:
1. TS compilation
2. Unit-tests
3. eslint checks

## Contribution
You should have all checks procceeded and correct formatting before commit. Use:
```bash
bun run all-checks
```
it combines tests described above and prettier's execution
