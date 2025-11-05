import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parents[1] / "data"

def sniff(path: Path):
    try:
        df = pd.read_csv(path, low_memory=False)
    except UnicodeDecodeError:
        df = pd.read_csv(path, encoding="latin1", low_memory=False)
    cols = list(df.columns)
    print(f"\n=== {path.name} ===")
    print(f"rows={len(df):,}  cols={len(df.columns)}")
    print("columns:", cols)
    print("sample:")
    print(df.head(3))
    return cols

if __name__ == "__main__":
    paths = sorted(DATA_DIR.glob("*.csv"))
    if not paths:
        print("No CSVs found in /data. Upload them first.")
        raise SystemExit(1)
    for p in paths:
        sniff(p)
