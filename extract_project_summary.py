import os
import json
from datetime import datetime

SUMMARY_MD = "project_summary.md"
SUMMARY_JSON = "project_summary.json"
NUM_PREVIEW_LINES = 10  # More context per file
EXCLUDE_DIRS = {'.git', 'node_modules', 'dist', '__pycache__', '.venv'}

def get_file_preview(filepath, num_lines=NUM_PREVIEW_LINES):
    """Return the first N lines of a file for previewing."""
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            return ''.join([next(f) for _ in range(num_lines)])
    except Exception:
        return "[Could not preview file]\n"

def walk_project(root='.'):
    """Walk through the project and collect structured data."""
    project_data = {
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "root": os.path.abspath(root),
        "directories": []
    }

    for dirpath, dirnames, filenames in os.walk(root):
        # Exclude unwanted directories
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
        rel_dir = os.path.relpath(dirpath, root)

        dir_entry = {
            "path": rel_dir,
            "files": []
        }

        for fname in filenames:
            fpath = os.path.join(dirpath, fname)
            try:
                size = os.path.getsize(fpath)
            except Exception:
                size = 0

            file_entry = {
                "path": os.path.relpath(fpath, root),
                "size_bytes": size,
                "preview": get_file_preview(fpath)
            }
            dir_entry["files"].append(file_entry)

        project_data["directories"].append(dir_entry)

    return project_data

def generate_markdown(project_data):
    """Generate a readable Markdown summary from structured data."""
    md = ["# Project Structure and Summary"]
    md.append(f"_Generated on {project_data['generated_at']}_\n")

    for d in project_data["directories"]:
        md.append(f"\n## Directory: `{d['path']}`\n")
        for f in d["files"]:
            md.append(f"### File: `{f['path']}` ({f['size_bytes']} bytes)\n")
            md.append(f"```text\n{f['preview']}\n```\n")

    return "\n".join(md)

def main():
    print("Extracting project summary...")
    project_data = walk_project('.')

    # Save JSON (best for AI continuation)
    with open(SUMMARY_JSON, 'w', encoding='utf-8') as jf:
        json.dump(project_data, jf, indent=2)

    # Save Markdown (best for humans)
    md = generate_markdown(project_data)
    with open(SUMMARY_MD, 'w', encoding='utf-8') as mf:
        mf.write(md)

    print(f"Summary written to {SUMMARY_MD} and {SUMMARY_JSON}")

if __name__ == "__main__":
    main()

