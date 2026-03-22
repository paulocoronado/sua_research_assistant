import sys
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Add parent directory to path to import moodle_metrics_analyzer
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

app = FastAPI(title="SUA - Project Service")

# Add CORS to allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Project Service API is running"}

@app.get("/api/metrics/analyze")
def analyze_metrics():
    try:
        from moodle_metrics_analyzer import MetricAnalyzerSystem
        import pandas as pd
        import numpy as np
        
        # __file__ is Backend/project_service/main.py
        # root is one level above Backend
        root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        file_path = os.path.join(root_dir, "Anexo_ Listado de Métricas de actividad en MOODLE.xlsx")
        
        if not os.path.exists(file_path):
            return JSONResponse(status_code=404, content={"error": "Excel file not found"})
        
        # We will output directly to the FrontEnd public folder so the images are served by Next.js
        output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "FrontEnd", "public", "metrics_output")
        os.makedirs(output_dir, exist_ok=True)
        
        temp_df = pd.read_excel(file_path)
        group_col_name = "Grupo" if "Grupo" in temp_df.columns else temp_df.columns[0]
        numeric_metrics = temp_df.select_dtypes(include=[np.number]).columns.tolist()
        actual_cat_cols = [col for col in temp_df.columns if any(c in col.lower() for c in ['accion', 'tipo', 'finaliz', 'riesgo'])]
        
        analyzer = MetricAnalyzerSystem(file_path, group_col=group_col_name)
        analyzer.exporter.output_dir = output_dir
        analyzer.run_analysis(numeric_cols=numeric_metrics, categorical_cols=actual_cat_cols)
        
        # Read the generated CSVs to return as JSON
        numeric_tests = []
        num_csv = os.path.join(output_dir, "comparative_numeric_tests.csv")
        if os.path.exists(num_csv):
            numeric_tests = pd.read_csv(num_csv).replace({np.nan: None}).to_dict(orient="records")
            
        categorical_tests = []
        cat_csv = os.path.join(output_dir, "comparative_categorical_tests.csv")
        if os.path.exists(cat_csv):
            categorical_tests = pd.read_csv(cat_csv).replace({np.nan: None}).to_dict(orient="records")
            
        desc_tests = []
        desc_csv = os.path.join(output_dir, "descriptive_stats_numeric.csv")
        if os.path.exists(desc_csv):
            desc_tests = pd.read_csv(desc_csv).replace({np.nan: None}).to_dict(orient="records")
            
        return {
            "descriptive_stats": desc_tests,
            "numeric_tests": numeric_tests,
            "categorical_tests": categorical_tests,
            "images": [f"/metrics_output/plot_{cat}.png" for cat in actual_cat_cols],
            "message": "Analysis generated successfully. Charts correctly rendered."
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
