curl -X POST http://localhost:3000/published?ppp=1 \
-H "Content-Type: application/json" \
-d '{
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
