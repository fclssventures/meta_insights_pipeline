import streamlit as st
import pandas as pd
import plotly.express as px
from pathlib import Path

st.set_page_config(page_title="Meta Insights Dashboard", layout="wide")
DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "final_insights.csv"

@st.cache_data
def load_data():
    df = pd.read_csv(DATA_PATH)
    if "date" in df.columns:
        df["date"] = pd.to_datetime(df["date"], errors="coerce")
    for c in ["reach","impressions","link_clicks","likes","comments","shares","engagements","views","visits","call_clicks","ctr","engagement_rate","visits_per_click","calls_per_click"]:
        if c in df.columns:
            df[c] = pd.to_numeric(df[c], errors="coerce").fillna(0)
    return df

def kpi(label, value, fmt="{:,.0f}"):
    st.metric(label, fmt.format(value))

def main():
    st.title("Meta Insights — Executive Dashboard")

    if not DATA_PATH.exists():
        st.warning("Run ETL first: `python scripts/etl.py` to generate data/final_insights.csv")
        st.stop()

    df = load_data()

    c1,c2,c3 = st.columns(3)
    with c1:
        if "date" in df.columns:
            dr = st.date_input("Date range", value=(df["date"].min(), df["date"].max()))
        else:
            dr = None
    with c2:
        has_post = "post_id" in df.columns and df["post_id"].notna().any()
        post = st.text_input("Filter by Post ID (optional)") if has_post else ""
    with c3:
        metric = st.selectbox("Primary metric", ["impressions","reach","link_clicks","engagements","views","visits","ctr","engagement_rate","visits_per_click"])

    if dr and isinstance(dr, tuple):
        start, end = pd.to_datetime(dr[0]), pd.to_datetime(dr[1])
        df = df[(df["date"]>=start) & (df["date"]<=end)]
    if post and has_post:
        df = df[df["post_id"].astype(str).str.contains(post.strip(), na=False)]

    k1,k2,k3,k4,k5,k6 = st.columns(6)
    kpi("Reach", df.get("reach", pd.Series([0])).sum())
    kpi("Impressions", df.get("impressions", pd.Series([0])).sum())
    kpi("Link Clicks", df.get("link_clicks", pd.Series([0])).sum())
    kpi("Engagements", df.get("engagements", pd.Series([0])).sum())
    kpi("Avg CTR", df.get("ctr", pd.Series([0])).mean()*100, "{:,.2f}%")
    kpi("Avg Engagement Rate", df.get("engagement_rate", pd.Series([0])).mean()*100, "{:,.2f}%")

    st.divider()

    if "date" in df.columns:
        ts = df.groupby("date", as_index=False)[metric].sum()
        st.plotly_chart(px.line(ts, x="date", y=metric, title=f"{metric.title()} over time"), use_container_width=True)

    if "post_id" in df.columns and df["post_id"].notna().any():
        top = (df.groupby("post_id", as_index=False)[metric]
                 .sum()
                 .sort_values(metric, ascending=False)
                 .head(15))
        st.plotly_chart(px.bar(top, x="post_id", y=metric, title=f"Top posts by {metric}"), use_container_width=True)

    cols = [c for c in ["reach","impressions","link_clicks","visits"] if c in df.columns]
    if cols:
        sums = df[cols].sum()
        funnel = pd.DataFrame({"stage": sums.index.str.title(), "value": sums.values})
        st.plotly_chart(px.bar(funnel, x="stage", y="value", title="Funnel summary"), use_container_width=True)

    st.caption("Source: Meta Business Suite CSVs (Portuguese headers handled).")

if __name__ == "__main__":
    main()
