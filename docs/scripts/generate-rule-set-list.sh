#!/bin/bash

cd "$(dirname "${BASH_SOURCE:-$0}")"

combined='[]'

for dir in ../rules-in-library/*; do
    if [ -d "$dir" ] && [ -f "$dir/rule-set.json" ]; then
        id=$(basename "$dir" | cut -d'_' -f1)

        if ! [[ $id =~ ^[0-9]+$ ]]; then
            echo "❌ Error: Directory $dir does not start with '<number>_' format."
            exit 1
        fi

        processed_json=$(jq --argjson id "$id" '{id: $id|tonumber, redirectList: .}' "$dir/rule-set.json")
        combined=$(echo "$combined" | jq --argjson newElement "$processed_json" '. += [$newElement]')
    fi
done

wrapped=$(echo "$combined" | jq '{ "ruleSets": . }')
output_dir="../generated/rule-set/"
mkdir -p $output_dir
echo "$wrapped" > $output_dir/list.json
echo "✅ Created list.json"
