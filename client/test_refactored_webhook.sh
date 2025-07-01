#!/bin/bash

# Test script for the refactored middleware - continues=true only
echo "Testing Enhanced Middleware Pipeline - Batching Mode"

# Test: Multi-part invocation (continues=true)
echo "Test: Multi-part invocation - Part 1 (continues=true)"
curl -X POST http://localhost:3000/published \
-H "Content-Type: application/json" \
-d '{
  "invocation_id": "test-batch-001",
  "continues": true,
  "updates": [
    {
      "identifier": "AAA99EF438B44632AD63AF9F61CD00E4-layout",
      "entity_definition": "LayoutData",
      "operation": "create",
      "entity_culture": "en"
    }
  ]
}'

echo -e "\n\n"

echo "Test: Multi-part invocation - Part 2 (continues=true)"
curl -X POST http://localhost:3000/published \
-H "Content-Type: application/json" \
-d '{
  "invocation_id": "test-batch-001",
  "continues": true,
  "updates": [
    {
      "identifier": "BBB538D7C90A441F98531AB443D70CDB-layout",
      "entity_definition": "LayoutData",
      "operation": "update",
      "entity_culture": "en"
    }
  ]
}'

echo -e "\n\n"

echo "Test: Multi-part invocation - Part 3 (continues=true)"
curl -X POST http://localhost:3000/published \
-H "Content-Type: application/json" \
-d '{
  "invocation_id": "test-batch-001",
  "continues": true,
  "updates": [
    {
      "identifier": "CCC99EF438B44632AD63AF9F61CD00E4-layout",
      "entity_definition": "LayoutData",
      "operation": "update",
      "entity_culture": "en"
    }
  ]
}'

echo -e "\n\nBatching test complete! Check repository stats in responses."
