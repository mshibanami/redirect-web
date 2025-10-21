#!/usr/bin/env bash

set -e

cd "$(dirname "$0")/.."

PRESERVE_DESCRIPTION=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --preserve-existing-description)
            PRESERVE_DESCRIPTION=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--preserve-existing-description]"
            exit 1
            ;;
    esac
done

declare -A TRANSLATABLE_KEYS=(
    ["metadata.json"]="title description"
    ["rule-set.json"]="title comments"
)

extract_from_file() {
    local file_path="$1"
    local file_name="$2"
    local keys="$3"
    local is_array_item="$4"
    
    if [[ ! -f "$file_path" ]]; then
        echo "{}"
        return
    fi
    
    local keys_array=$(echo "$keys" | tr ' ' '\n' | jq -R . | jq -s .)
    
    if [[ "$is_array_item" == "true" ]]; then
        jq -r --argjson keys "$keys_array" '
            .redirects |
            to_entries |
            map(
                .key as $index |
                .value |
                to_entries |
                map(
                    select([.key] | inside($keys)) |
                    {
                        key: ("'"$file_name"'#/redirects/" + ($index | tostring) + "/" + .key),
                        value: {
                            message: .value,
                            description: (
                                "The " + .key + " of redirect rule #" + ($index | tostring)
                            )
                        }
                    }
                )
            ) |
            flatten |
            from_entries
        ' "$file_path"
    else
        jq -r --argjson keys "$keys_array" '
            to_entries |
            map(
                select([.key] | inside($keys)) |
                {
                    key: ("'"$file_name"'#/" + .key),
                    value: {
                        message: .value,
                        description: (
                            "The " + .key + " of the rule set in '"$file_name"'"
                        )
                    }
                }
            ) |
            from_entries
        ' "$file_path"
    fi
}

for rule_dir in library/rule-sets/*/; do
    rule_name=$(basename "$rule_dir")
    
    if [[ "$rule_name" == .* ]] || [[ "$rule_name" == *DELETED* ]] || [[ "$rule_name" == *HIDDEN* ]]; then
        echo "Skipping $rule_name"
        continue
    fi
    
    rule_set_file="${rule_dir}rule-set.json"
    if [[ ! -f "$rule_set_file" ]]; then
        echo "Skipping $rule_name (no rule-set.json found)"
        continue
    fi
    
    echo "Processing $rule_name..."
    
    messages_dir="${rule_dir}i18n/en"
    messages_file="${messages_dir}/messages.json"
    
    mkdir -p "$messages_dir"
    
    metadata_file="${rule_dir}metadata.json"
    metadata_json=$(extract_from_file "$metadata_file" "metadata.json" "${TRANSLATABLE_KEYS[metadata.json]}" "false")
    
    rule_set_json=$(extract_from_file "$rule_set_file" "rule-set.json" "${TRANSLATABLE_KEYS[rule-set.json]}" "true")
    
    existing_messages="{}"
    if [[ -f "$messages_file" && "$PRESERVE_DESCRIPTION" == "true" ]]; then
        existing_messages=$(cat "$messages_file")
    fi
    
    merged_json=$(echo "$metadata_json" "$rule_set_json" | jq -s '.[0] * .[1] | to_entries | sort_by(.key) | from_entries')
    
    if [[ "$PRESERVE_DESCRIPTION" == "true" && "$existing_messages" != "{}" ]]; then
        echo "$merged_json" "$existing_messages" | jq -s '
            .[0] as $new |
            .[1] as $old |
            $new | to_entries | map(
                .key as $k |
                .value as $v |
                if $old[$k] and $old[$k].description then
                    {key: $k, value: {message: $v.message, description: $old[$k].description}}
                else
                    {key: $k, value: $v}
                end
            ) | from_entries
        ' > "$messages_file"
    else
        echo "$merged_json" > "$messages_file"
    fi
    
    echo "  Created $messages_file"
done

echo "Done!"
