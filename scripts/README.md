# scripts/

Python scripts for generating trip documents.

## Requirements

```bash
pip install openpyxl markdown
```

(Edge or Chrome required for PDF generation)

## Usage

Run from this folder:

```bash
# Generate Excel (→ scripts/ + public/downloads/)
py generate_excel.py

# Generate PDF (→ scripts/ + public/downloads/)
py generate_pdf.py

# Calculate expense settlement (→ data/)
py settle_expenses.py
```

## Data files

All source data lives in `data/`:

| File | Description |
|------|-------------|
| `athens_trip_april_2026.md` | Full itinerary (Markdown) |
| `athens_itinerary.csv` | Day-by-day schedule |
| `athens_tasks.csv` | Pre-trip checklist |
| `athens_costs.csv` | Cost breakdown |
| `athens_restaurants.csv` | Restaurant list |
| `athens_settlement.md` | Expense settlement output |

> For full documentation on using this as a template for a new trip, see the [root README](../README.md).