#!/bin/bash

cd "$(dirname "${BASH_SOURCE:-$0}")"

supported_json_files=(
    "rule-set.json"
    "rule-set.redirectweb"
)

combined='[]'
for dir in ../library/rules/*; do
    if [ -d "$dir" ]; then
        id=$(basename "$dir" | cut -d'_' -f1)

        if ! [[ $id =~ ^[0-9]+$ ]]; then
            echo "❌ Error: Directory $dir does not start with '<number>_' format."
            exit 1
        fi

        json_file=""
        for file in "${supported_json_files[@]}"; do
            if [ -f "$dir/$file" ]; then
                json_file="$dir/$file"
                break
            fi
        done

        if [ -n "$json_file" ]; then
            processed_json=$(jq --argjson id "$id" '{id: $id|tonumber, redirectList: .}' "$json_file")
            combined=$(echo "$combined" | jq --argjson newElement "$processed_json" '. += [$newElement]')
        fi
    fi
done

wrapped=$(echo "$combined" | jq '{ "ruleSets": . }')
output_dir="../generated/rule-set/"
mkdir -p $output_dir
echo "$wrapped" > $output_dir/list.json
echo "✅ Created list.json"
