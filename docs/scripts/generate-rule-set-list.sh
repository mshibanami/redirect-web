#!/bin/bash

cd "$(dirname "${BASH_SOURCE:-$0}")"

supported_rule_set_files=(
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

        rule_set_file=""
        for file in "${supported_rule_set_files[@]}"; do
            if [ -f "$dir/$file" ]; then
                rule_set_file="$dir/$file"
                break
            fi
        done
        metadata_file="$dir/metadata.json"

        if [ -n "$rule_set_file" ]; then
            processed_rule_set=$(jq --argjson id "$id" '{id: $id|tonumber, redirectList: ., metadata: .}' "$rule_set_file" "$metadata_file")
            combined=$(echo "$combined" | jq --argjson newElement "$processed_rule_set" '. += [$newElement]')
        fi
    fi
done

wrapped=$(echo "$combined" | jq '{ "ruleSets": . }')
output_dir="../generated/rule-sets/"
mkdir -p $output_dir
echo "$wrapped" > $output_dir/list.json
echo "✅ Created list.json at $output_dir/list.json"
