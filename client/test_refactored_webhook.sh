#!/bin/bash

# Test script for the refactored middleware
echo "Testing Enhanced Middleware Pipeline"

# Test 1: Single invocation with layout updates
echo "Test 1: Single batch with layout updates"
curl -X POST http://localhost:3000/published \
-H "Content-Type: application/json" \
-d '{
  "invocation_id": "test-001",
  "continues": false,
  "updates": [
    {
      "identifier": "AFE99EF438B44632AD63AF9F61CD00E4-layout",
      "entity_definition": "LayoutData",
      "operation": "create",
      "entity_culture": "en"
    },
    {
      "identifier": "E79538D7C90A441F98531AB443D70CDB-layout",
      "entity_definition": "LayoutData",
      "operation": "update",
      "entity_culture": "en"
    }
  ]
}'

echo -e "\n\n"

# Test 2: Multi-part invocation (continues=true)
echo "Test 2: Multi-part invocation - Part 1"
curl -X POST http://localhost:3000/published \
-H "Content-Type: application/json" \
-d '{
  "invocation_id": "test-002",
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

echo "Test 2: Multi-part invocation - Part 2 (final)"
curl -X POST http://localhost:3000/published \
-H "Content-Type: application/json" \
-d '{
  "invocation_id": "test-002",
  "continues": false,
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

# Test 3: Non-layout updates (should be filtered out)
echo "Test 3: Non-layout updates (should be filtered)"
curl -X POST http://localhost:3000/published \
-H "Content-Type: application/json" \
-d '{
  "invocation_id": "test-003",
  "continues": false,
  "updates": [
    {
      "identifier": "CCC99EF438B44632AD63AF9F61CD00E4",
      "entity_definition": "ContentData",
      "operation": "create",
      "entity_culture": "en"
    }
  ]
}'

echo -e "\n\nTesting complete!"
