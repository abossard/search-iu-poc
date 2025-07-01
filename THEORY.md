# Refactoring ideas
- in src/loggerMiddleware.ts the jsonOnlyMiddleware should not check the type of every update item but filter out updates that don't conform to isUpdate and also filter out the ones that don't have "-layout" in their "identifier" property
- we need a "CollectAndProcessMiddleware", that collects updates for an invocation id, until "continues" is false, when it's false it forwards the collected updates, except if the count it above a certain threshold
- create a lightweight repository facade (in-memory) to collect the invocations and their items