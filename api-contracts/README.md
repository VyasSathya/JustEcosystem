# API Contracts Directory

This directory contains the OpenAPI/Swagger specifications for all major APIs in the JustEcosystem project.

## Purpose
- Serve as the single source of truth for API contracts between services (e.g., JustWorks, JustStuff, JustCreate).
- Enable contract testing, code generation, and integration validation.
- Help onboard new developers by documenting endpoints, data models, and expected behaviors.

## Usage
- Add or update OpenAPI specs for each service as features evolve.
- Reference these contracts in integration checklists and CI/CD pipelines.
- Use contract testing tools (e.g., schemathesis, Dredd) to validate that services conform to their contracts.

## Adding a New Contract
1. Create a new `.openapi.yaml` (or `.json`) file for the API/feature.
2. Document all endpoints, request/response schemas, and authentication requirements.
3. Update this README with a description of the new contract.

## Example
- `justworks-auth.openapi.yaml`: Auth API contract for JustWorks backend.

## See Also
- Integration checklists in each repo for required contracts.
- `/integration-tests/` for contract and smoke test scripts.
