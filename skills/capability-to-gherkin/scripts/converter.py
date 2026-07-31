#!/usr/bin/env python3
"""
capability-to-gherkin converter

A utility that reads a business capability map (produced by legacy-capability-extractor
or any compatible source) and generates Gherkin .feature files. This script automates
the conversion pipeline described in SKILL.md.

Usage:
    python converter.py --input <capability-map> --output <features-dir> [--openspec]

Input formats:
    Markdown  — Hierarchical Markdown (default; matches a6-domain-model.md output)
    JSON      — Structured JSON with L1/L2 capability entries
    YAML      — Structured YAML with L1/L2 capability entries

Output:
    One .feature file per L1 capability, with Scenarios per L2, in the output directory.
    If --openspec is passed, files are written to specs/ and a proposal stub is created.
"""

import argparse
import json
import re
import sys
from pathlib import Path
from datetime import datetime

try:
    import yaml
except ImportError:
    yaml = None


# ---------------------------------------------------------------------------
# Input parsing
# ---------------------------------------------------------------------------

def parse_markdown(input_path):
    """Parse a hierarchical Markdown capability map into structured data."""
    text = Path(input_path).read_text(encoding="utf-8")
    lines = text.splitlines()

    l1_caps = []
    current_l1 = None
    current_l2 = None

    for line in lines:
        stripped = line.strip()

        # Detect L1 heading: ## BC-001: Name
        l1_match = re.match(
            r"^##\s*(?:BC-\d+\s*[-:]?)\s*(.+)", stripped
        )
        if l1_match:
            current_l1 = {
                "id": _extract_id(stripped),
                "name": l1_match.group(1).strip(),
                "description": "",
                "business_value": "",
                "actors": [],
                "l2": [],
                "dependencies": [],
            }
            l1_caps.append(current_l1)
            current_l2 = None
            continue

        # Detect L2 heading: ### BC-001-01: Name
        l2_match = re.match(
            r"^###\s*(?:BC-\d+-\d+\s*[-:]?)\s*(.+)", stripped
        )
        if l2_match and current_l1 is not None:
            current_l2 = {
                "id": _extract_id(stripped),
                "name": l2_match.group(1).strip(),
                "description": "",
                "operations": [],
                "dependencies": [],
            }
            current_l1["l2"].append(current_l2)
            continue

        current = current_l2 or current_l1
        if current is None:
            continue

        # Capture description / value / actors from labeled lines
        if stripped.startswith("**Description:**"):
            current["description"] = _after_label(stripped)
        elif stripped.startswith("**Business Value:**"):
            current["business_value"] = _after_label(stripped)
        elif stripped.startswith("**Actors:**"):
            current["actors"] = [
                a.strip() for a in _after_label(stripped).split(",")
            ]
        elif stripped.startswith("**Cross-Capability Dependencies") or \
             stripped.startswith("**Dependencies**"):
            deps_str = _after_label(stripped)
            current["dependencies"] = [
                d.strip() for d in deps_str.split(",")
            ]

    return l1_caps


def parse_json(input_path):
    """Parse a JSON capability map into structured data."""
    with open(input_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return _normalize_json(data)


def parse_yaml(input_path):
    """Parse a YAML capability map into structured data."""
    if yaml is None:
        print("ERROR: PyYAML is required for YAML input. Install with: pip install pyyaml",
              file=sys.stderr)
        sys.exit(1)
    with open(input_path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    return _normalize_json(data)


def _normalize_json(data):
    """Normalize JSON/YAML data into the same structure as Markdown parsing."""
    caps = []
    for item in data.get("capabilities", data.get("L1", [])):
        l1 = {
            "id": item.get("id", ""),
            "name": item.get("name", item.get("L1", "")),
            "description": item.get("description", ""),
            "business_value": item.get("businessValue", item.get("business_value", "")),
            "actors": item.get("actors", []),
            "l2": [],
            "dependencies": item.get("dependencies", []),
        }
        for sub in item.get("l2", item.get("subcapabilities", [])):
            l2 = {
                "id": sub.get("id", ""),
                "name": sub.get("name", sub.get("L2", "")),
                "description": sub.get("description", ""),
                "operations": sub.get("operations", sub.get("keyOperations", [])),
                "dependencies": sub.get("dependencies", []),
            }
            l1["l2"].append(l2)
        caps.append(l1)
    return caps


def _extract_id(text):
    """Extract a capability ID (BC-001, BC-001-01) from a heading line."""
    m = re.search(r"BC-\d+(?:-\d+)?", text)
    return m.group(0) if m else ""


def _after_label(line):
    """Extract text after a '**Label:**' prefix."""
    m = re.match(r"\*\*[^:]+:\*\*\s*(.*)", line)
    return m.group(1).strip() if m else line


# ---------------------------------------------------------------------------
# Gherkin generation
# ---------------------------------------------------------------------------

def generate_feature(l1_cap, output_dir, openspec_mode=False):
    """Generate a Gherkin .feature file from an L1 capability."""
    name = l1_cap["name"]
    slug = _slugify(name)
    actors = l1_cap.get("actors", [])
    primary_actor = actors[0] if actors else "Business User"

    lines = []
    lines.append(f"# Traceability: capability map → {l1_cap['id']} {name}")
    if l1_cap.get("dependencies"):
        lines.append(f"# Depends on: {', '.join(l1_cap['dependencies'])}")
    lines.append("")
    lines.append(f"@capability @level1 @{slug}")
    lines.append(f"Feature: {name}")
    if l1_cap.get("description"):
        lines.append(f"  {l1_cap['description']}")
    if l1_cap.get("business_value"):
        lines.append(f"  {l1_cap['business_value']}")
    lines.append("")
    lines.append(f"  As a {primary_actor}")
    lines.append(f"  I want to {name.lower()}")
    lines.append(f"  So that {l1_cap.get('business_value', 'business objectives are met')}")
    lines.append("")
    lines.append("  Background:")
    lines.append("    Given the system is in a valid initial state")
    lines.append("    And standard test data is loaded")
    lines.append("")

    # Generate scenarios for each L2
    for l2 in l1_cap.get("l2", []):
        lines.extend(_generate_scenarios(l2))
        lines.append("")

    content = "\n".join(lines).rstrip() + "\n"

    out_dir = Path(output_dir)
    if openspec_mode:
        out_dir = out_dir / "specs"
    out_dir.mkdir(parents=True, exist_ok=True)
    feature_path = out_dir / f"{slug}.feature"
    feature_path.write_text(content, encoding="utf-8")
    print(f"Generated: {feature_path}")
    return feature_path


def _generate_scenarios(l2_cap):
    """Generate Gherkin scenarios for an L2 capability."""
    tag = _slugify(l2_cap["name"])
    name = l2_cap["name"]
    desc = l2_cap.get("description", "")

    lines = []
    # Happy path
    lines.append(f"  @capability @level2 @{tag} @happy-path")
    lines.append(f"  Scenario: {name} — happy path")
    lines.append(f"    Given {desc.lower() if desc else 'the relevant preconditions are met'}")
    lines.append("    When the triggering event occurs")
    lines.append("    Then the expected outcome should be achieved")
    lines.append("    And the business value should be realized")
    lines.append("")

    # Exception
    lines.append(f"  @capability @level2 @{tag} @exception")
    lines.append(f"  Scenario: {name} — error case")
    lines.append("    Given an error-triggering condition exists")
    lines.append("    When the triggering event occurs under error conditions")
    lines.append("    Then the error should be handled gracefully")
    lines.append("    And the system state should remain consistent")
    lines.append("")

    # Boundary (as Scenario Outline if there are known values)
    lines.append(f"  @capability @level2 @{tag} @boundary")
    lines.append(f"  Scenario Outline: {name} — boundary values")
    lines.append("    Given the preconditions for the boundary case are met")
    lines.append('    When the input contains "<value>"')
    lines.append("    Then the boundary-appropriate outcome should occur")
    lines.append("")
    lines.append("    Examples:")
    lines.append("      | value |")
    lines.append("      | min   |")
    lines.append("      | max   |")
    lines.append("      | empty |")
    return lines


def _slugify(text):
    """Convert text to a kebab-case slug for tags and filenames."""
    s = re.sub(r"[^\w\s-]", "", text.lower())
    s = re.sub(r"[\s_]+", "-", s.strip())
    return s


# ---------------------------------------------------------------------------
# Main

def main():
    parser = argparse.ArgumentParser(
        description="Convert a business capability map to Gherkin .feature files."
    )
    parser.add_argument(
        "--input", "-i",
        required=True,
        help="Path to the capability map (Markdown, JSON, or YAML).",
    )
    parser.add_argument(
        "--output", "-o",
        required=True,
        help="Output directory for generated .feature files.",
    )
    parser.add_argument(
        "--format", "-f",
        choices=["markdown", "json", "yaml"],
        default=None,
        help="Input format (auto-detected from file extension if omitted).",
    )
    parser.add_argument(
        "--openspec",
        action="store_true",
        help="Generate files into specs/ and create an OpenSpec proposal stub.",
    )

    args = parser.parse_args()

    fmt = args.format or _detect_format(args.input)
    if fmt == "markdown":
        caps = parse_markdown(args.input)
    elif fmt == "json":
        caps = parse_json(args.input)
    elif fmt == "yaml":
        caps = parse_yaml(args.input)
    else:
        print(f"ERROR: Cannot detect format for {args.input}. Use --format.", file=sys.stderr)
        sys.exit(1)

    if not caps:
        print("WARNING: No L1 capabilities found in the input.", file=sys.stderr)

    for l1 in caps:
        generate_feature(l1, args.output, openspec_mode=args.openspec)

    if args.openspec:
        _create_openspec_proposal(args.output)

    print(f"\nDone. Generated {len(caps)} Feature file(s).")


def _detect_format(path):
    ext = Path(path).suffix.lower()
    return {
        ".md": "markdown",
        ".json": "json",
        ".yaml": "yaml",
        ".yml": "yaml",
    }.get(ext)


def _create_openspec_proposal(output_dir):
    """Create a stub OpenSpec proposal file."""
    proposal_dir = Path(output_dir) / "specs"
    proposal_dir.mkdir(parents=True, exist_ok=True)
    proposal_path = proposal_dir / "proposals" / "capability-to-gherkin-proposal.md"
    proposal_path.parent.mkdir(parents=True, exist_ok=True)
    proposal_path.write_text(
        f"# OpenSpec Proposal: Capability → Gherkin Conversion\n\n"
        f"Created: {datetime.now().isoformat()}\n\n"
        f"Proposes adding Gherkin Feature files generated from the business capability map.\n"
        f"Run `/opsx:propose`, `/opsx:apply`, `/opsx:verify`, and `/opsx:archive` to manage this change.\n",
        encoding="utf-8",
    )
    print(f"Created proposal stub: {proposal_path}")


if __name__ == "__main__":
    main()
