import pandas as pd
import numpy as np
from pathlib import Path
from dateutil import parser
from unidecode import unidecode
import re

DATA_DIR = Path(__file__).resolve().parents[1] / "data"
OUT_DIR  = DATA_DIR

def read_csv_safe(path):
    try:
        return pd.read_csv(path, low_memory=False)
    except UnicodeDecodeError:
        return pd.read_csv(path, encoding="latin1", low_memory=False)

def normalize_colname(c: str) -> str:
    c = unidecode(str(c))               # remove accents (Interação -> Interacao)
    c = c.strip().lower()
    c = c.replace("%", "pct")
    c = re.sub(r"[^a-z0-9]+", "_", c)   # spaces/punct -> _
    c = re.sub(r"_+", "_", c).strip("_")
    return c

def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    df.columns = [normalize_colname(c) for c in df.columns]
    return df

def coerce_date_col(df):
    # try common date headers (PT/EN): data, data_inicio, data_fim, date, created_time, time
    candidates = [c for c in df.columns if any(k in c for k in ["data","date","time","dia","created"])]
    date_col = candidates[0] if candidates else None

    def _parse(val):
        if pd.isna(val):
            return pd.NaT
        try:
            return parser.parse(str(val)).date()
        except Exception:
            return pd.NaT

    if date_col:
        df["date"] = df[date_col].apply(_parse)
    else:
        df["date"] = pd.NaT
    return df

def numericize(df: pd.DataFrame) -> pd.DataFrame:
    for c in df.columns:
        if c in ("date", "post_id", "__source_file"): 
            continue
        if df[c].dtype == object:
            try:
                df[c] = pd.to_numeric(df[c].str.replace(",",""), errors="ignore")
            except Exception:
                pass
    return df

def extract_post_id(df: pd.DataFrame) -> pd.Series:
    # try common variants
    for k in ["post_id","id","publicacao","publicacao_id","publicacoe_id","post","postagem","permalink","link"]:
        if k in df.columns:
            return df[k].astype(str)
    # fallback: NaN
    return pd.Series([np.nan]*len(df))

def load_all_frames():
    frames = []
    for path in DATA_DIR.glob("*.csv"):
        df = read_csv_safe(path)
        df = normalize_columns(df)
        df = coerce_date_col(df)
        df = numericize(df)
        df["post_id"] = extract_post_id(df)
        df["__source_file"] = path.name

        # map possible metric names (PT-BR/PT-PT/EN)
        def pick(*names):
            for n in names:
                if n in df.columns: 
                    return df[n]
            return 0

        reach         = pick("reach","alcance")
        impressions   = pick("impressions","impressoes","impressoes_totais","impressoes_total","impressoes_totais_de_conteudo")
        link_clicks   = pick("link_clicks","cliques_em_ligacoes","cliques_em_ligacoes_","cliques_no_link","cliques_em_links")
        likes         = pick("likes","gostos","curtidas","reacoes","reactions_total","reactions")
        comments      = pick("comments","comentarios","comentarios_")
        shares        = pick("shares","partilhas","compartilhamentos")
        engagements   = pick("engagement","engagements","interacoes","interacao","interacoes_totais")
        views         = pick("views","visualizacoes","visualizacoes_de_video","video_views","visualizacoes_totais")
        visits        = pick("visitas","sessao","sessoes","sessions","users","utilizadores")  # optional
        calls         = pick("ligacoes_em_cliques","cliques_em_ligacoes_para_chamada","call_clicks")  # optional

        out = pd.DataFrame({
            "date": df["date"],
            "post_id": df["post_id"],
            "reach": reach,
            "impressions": impressions,
            "link_clicks": link_clicks,
            "likes": likes,
            "comments": comments,
            "shares": shares,
            "engagements": engagements if isinstance(engagements, pd.Series) else 0,
            "views": views,
            "visits": visits if isinstance(visits, pd.Series) else 0,
            "call_clicks": calls if isinstance(calls, pd.Series) else 0,
            "source_file": df["__source_file"]
        })
        frames.append(out)
    if not frames:
        raise SystemError("No CSVs found in /data.")
    return pd.concat(frames, ignore_index=True)

def build_unified(df: pd.DataFrame) -> pd.DataFrame:
    # prefer grouping by post_id when present; else daily aggregate
    group_cols = ["date"]
    if df["post_id"].notna().any():
        group_cols.append("post_id")

    agg = (df.groupby(group_cols, dropna=True, as_index=False)
             .agg({
                 "reach":"sum",
                 "impressions":"sum",
                 "link_clicks":"sum",
                 "likes":"sum",
                 "comments":"sum",
                 "shares":"sum",
                 "engagements":"sum",
                 "views":"sum",
                 "visits":"sum",
                 "call_clicks":"sum"
              }))

    # derived metrics
    agg["ctr"] = np.where(agg["impressions"]>0, agg["link_clicks"]/agg["impressions"], 0.0)
    denom = agg["reach"].replace(0, np.nan)
    agg["engagement_rate"] = (agg["engagements"]/denom).fillna(0.0)
    agg["visits_per_click"] = np.where(agg["link_clicks"]>0, agg["visits"]/agg["link_clicks"], 0.0)
    agg["calls_per_click"] = np.where(agg["link_clicks"]>0, agg["call_clicks"]/agg["link_clicks"], 0.0)

    # fix NaNs
    num_cols = agg.select_dtypes(include=[np.number]).columns
    agg[num_cols] = agg[num_cols].fillna(0)

    return agg

if __name__ == "__main__":
    raw = load_all_frames()
    unified = build_unified(raw)
    out = OUT_DIR / "final_insights.csv"
    unified.to_csv(out, index=False)
    print(f"Wrote {len(unified):,} rows -> {out}")
