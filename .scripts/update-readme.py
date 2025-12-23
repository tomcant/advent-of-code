"""
Script to update README.md with progress information for each year.
"""

import os
from pathlib import Path


def update_readme(repo_path):
    years = {
        int(year_dir.name): {
            lang_dir.name: {
                "solution_count": count_solutions(lang_dir),
                "total_days": get_total_days_for_year(year_dir.name),
            }
            for lang_dir in year_dir.iterdir()
            if lang_dir.is_dir()
        }
        for year_dir in Path(repo_path).iterdir()
        if year_dir.name.isdigit()
    }

    lines = [
        "# Advent of Code",
        "",
        "My solutions to the [Advent of Code](https://adventofcode.com) programming puzzles.",
        "",
        "## Progress by Year",
        "",
        *format_years(years),
    ]

    with open(Path(repo_path) / "README.md", "w") as f:
        f.write("\n".join(lines))


def count_solutions(lang_dir):
    return len(
        [
            day_dir
            for day_dir in (lang_dir / "solutions").iterdir()
            if day_dir.name.isdigit()
        ]
    )


def get_total_days_for_year(year):
    return 12 if int(year) >= 2025 else 25


def format_years(years):
    LANGUAGES = {
        "javascript": "JavaScript",
        "typescript": "TypeScript",
        "python": "Python",
        "fsharp": "F#",
        "rust": "Rust",
    }

    lines = []
    min_year, max_year = min(years.keys()), max(years.keys())

    for year in range(max_year, min_year - 1, -1):
        lines.append(f"### {year}")

        if year not in years:
            lines.append("- TBD\n")
            continue

        year_data = years[year]
        sorted_langs = sorted(
            year_data.keys(),
            key=lambda lang: (
                -(year_data[lang]["solution_count"] / year_data[lang]["total_days"]),
                lang,
            ),
        )

        for lang in sorted_langs:
            solution_count = year_data[lang]["solution_count"]
            total_days = year_data[lang]["total_days"]
            percentage = (solution_count / total_days) * 100
            progress_bar = build_progress_bar(percentage)

            lines.append(
                f"- [{LANGUAGES[lang]}](./{year}/{lang}/solutions) ({solution_count}/{total_days}) {progress_bar}"
            )

        lines.append("")

    return lines


def build_progress_bar(percentage, width=10):
    filled = int(width * percentage / 100)
    bar = "▓" * filled + "░" * (width - filled)
    return f"{bar} {percentage:.0f}%"


if __name__ == "__main__":
    repo_path = os.path.join(os.path.dirname(__file__), "..")
    update_readme(repo_path)
