# RecALL frontend

## Configuring environment
- Bun 1.3.6

```bash
bun i --frozen-lockfile

bunx playwright install # for browser tests
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
or 
```bash
bun run test:unit:dev
bun run test:unit:check
bun run test:browser:dev
bun run test:browser:check
```

## Contribution
You should have all checks procceeded and correct formatting before commit. Use:
```bash
bun run all-checks
```
This will check:
1. TS compilation
2. Unit-tests
3. Browser tests
4. eslint checks
5. prettier's formatting
