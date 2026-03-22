import pandas as pd
import numpy as np
import scipy.stats as stats
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import os
import warnings

# Use statsmodels for Tukey, scikit-posthocs for Dunn if available
try:
    from statsmodels.stats.multicomp import pairwise_tukeyhsd
    import scikit_posthocs as sp
except ImportError:
    pass

warnings.filterwarnings('ignore')

class DataLoader:
    """Loads and preprocesses the dataset."""
    @staticmethod
    def load_excel(file_path):
        return pd.read_excel(file_path)

class DescriptiveStatsEngine:
    """Handles generation of descriptive statistics."""
    @staticmethod
    def calculate_numeric_stats(df, group_col, numeric_cols):
        return df.groupby(group_col)[numeric_cols].describe()
    
    @staticmethod
    def calculate_categorical_distribution(df, group_col, cat_col):
        freq = pd.crosstab(df[cat_col], df[group_col], dropna=False)
        prop = pd.crosstab(df[cat_col], df[group_col], normalize='columns', dropna=False) * 100
        return freq, prop

class DataExporter:
    """Handles exporting data to CSV and charts."""
    def __init__(self, output_dir="output"):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        
    def export_csv(self, df, filename):
        path = os.path.join(self.output_dir, filename)
        df.to_csv(path)
        print(f"Exported: {path}")
        
    def plot_stacked_bars_100(self, prop_df, title, filename):
        fig, ax = plt.subplots(figsize=(10, 6))
        
        # Transpose to have groups on X axis and categories as stacked bars
        prop_df.T.plot(kind='bar', stacked=True, ax=ax, colormap='viridis')
        
        ax.set_ylabel('Percentage (%)')
        ax.set_title(title)
        plt.legend(title='Categoría', bbox_to_anchor=(1.05, 1), loc='upper left')
        plt.tight_layout()
        
        path = os.path.join(self.output_dir, filename)
        plt.savefig(path)
        plt.close()
        print(f"Exported chart: {path}")

class ComparativeTestEngine:
    """Handles the adaptive sequential strategy for statistical tests."""
    
    @staticmethod
    def cramers_v(confusion_matrix):
        """Calculate Cramer's V statistic for categorical-categorical association."""
        chi2 = stats.chi2_contingency(confusion_matrix, correction=False)[0]
        n = confusion_matrix.sum().sum()
        phi2 = chi2 / n
        r, k = confusion_matrix.shape
        # Handle cases where min(r-1, k-1) might be 0
        min_dim = min((r - 1), (k - 1))
        if min_dim == 0:
            return 0.0
        return np.sqrt(phi2 / min_dim)

    def analyze_numeric(self, df, group_col, numeric_col):
        groups = [group[numeric_col].dropna().values for name, group in df.groupby(group_col)]
        
        # 1. Shapiro-Wilk per group
        normality_results = [stats.shapiro(g)[1] > 0.05 for g in groups if len(g) >= 3]
        all_normal = all(normality_results) if normality_results else False
        
        results = {"Variable": numeric_col, "Normal": all_normal}
        
        # 2. ANOVA or Kruskal-Wallis
        if all_normal:
            stat, p_val = stats.f_oneway(*groups)
            results["Test"] = "ANOVA"
            results["p_value"] = p_val
            
            # Post-hoc Tukey if significant
            if p_val < 0.05:
                # Need linear arrays for statsmodels
                clean_df = df[[group_col, numeric_col]].dropna()
                tukey = pairwise_tukeyhsd(endog=clean_df[numeric_col], groups=clean_df[group_col], alpha=0.05)
                results["PostHoc"] = str(tukey)
            else:
                results["PostHoc"] = "None (p>=0.05)"
                
        else:
            stat, p_val = stats.kruskal(*groups)
            results["Test"] = "Kruskal-Wallis"
            results["p_value"] = p_val
            
            # Post-hoc Dunn-Bonferroni if significant
            if p_val < 0.05:
                try:
                    clean_df = df[[group_col, numeric_col]].dropna()
                    dunn = sp.posthoc_dunn(clean_df, val_col=numeric_col, group_col=group_col, p_adjust='bonferroni')
                    results["PostHoc"] = str(dunn)
                except Exception as e:
                    results["PostHoc"] = f"Dunn test failed or library missing. {str(e)}"
            else:
                results["PostHoc"] = "None (p>=0.05)"
                
        return results

    def analyze_categorical(self, df, group_col, cat_col):
        contingency_table = pd.crosstab(df[cat_col], df[group_col])
        if contingency_table.empty:
            return {"Variable": cat_col, "Error": "Empty table"}
        
        try:
            chi2, p_val, dof, expected = stats.chi2_contingency(contingency_table)
            
            # If expected < 5 in >20% of cells
            low_expected_count = (expected < 5).sum()
            total_cells = expected.size
            if (low_expected_count / total_cells) > 0.2:
                # Try Fisher Exact, but scipy's fisher_exact only works for 2x2.
                # For larger tables, we fallback to Chi-square with Yates but note the warning.
                # Actually, there's no general Fisher in scipy out of the box for R x C, 
                # so we stick to Chi-squared but warn about the assumption.
                test_name = "Chi-square (Warning: expected < 5)"
            else:
                test_name = "Chi-square"
                
            effect_size = self.cramers_v(contingency_table)
            
            return {
                "Variable": cat_col,
                "Test": test_name,
                "p_value": p_val,
                "Cramer_V": effect_size
            }
        except Exception as e:
             return {"Variable": cat_col, "Error": str(e)}

class MetricAnalyzerSystem:
    """Facade that unifies the complete analysis workflow."""
    def __init__(self, file_path, group_col='Grupo'):
        self.file_path = file_path
        self.group_col = group_col
        self.df = DataLoader.load_excel(file_path)
        self.exporter = DataExporter()
        self.comp_engine = ComparativeTestEngine()
        
    def run_analysis(self, numeric_cols, categorical_cols):
        print(f"--- Starting Analysis for {self.file_path} ---")
        
        # 1. Descriptive Stats
        print("\n[1] Generating Descriptive Statistics (Numeric)...")
        if numeric_cols:
            desc_stats = DescriptiveStatsEngine.calculate_numeric_stats(self.df, self.group_col, numeric_cols)
            self.exporter.export_csv(desc_stats, "descriptive_stats_numeric.csv")
        
        # 2. Categorical Distribution & Export 
        print("\n[2] Generating Categorical Distributions & Bar Charts...")
        for cat in categorical_cols:
            if cat not in self.df.columns:
                print(f"  [-] Column '{cat}' missing, skipping.")
                continue
                
            freq, prop = DescriptiveStatsEngine.calculate_categorical_distribution(self.df, self.group_col, cat)
            self.exporter.export_csv(freq, f"freq_{cat}.csv")
            self.exporter.export_csv(prop, f"prop_{cat}.csv")
            self.exporter.plot_stacked_bars_100(prop, f"Distribución de {cat} por {self.group_col}", f"plot_{cat}.png")
            
        # 3. Comparative Tests
        print("\n[3] Running Comparative Tests...")
        comp_results_numeric = []
        for num in numeric_cols:
            if num in self.df.columns:
                res = self.comp_engine.analyze_numeric(self.df, self.group_col, num)
                comp_results_numeric.append(res)
                
        if comp_results_numeric:
            df_comp_num = pd.DataFrame(comp_results_numeric)
            self.exporter.export_csv(df_comp_num, "comparative_numeric_tests.csv")
            
        comp_results_cat = []
        for cat in categorical_cols:
            if cat in self.df.columns:
                res = self.comp_engine.analyze_categorical(self.df, self.group_col, cat)
                comp_results_cat.append(res)
                
        if comp_results_cat:
            df_comp_cat = pd.DataFrame(comp_results_cat)
            self.exporter.export_csv(df_comp_cat, "comparative_categorical_tests.csv")
            
        print("\n--- Analysis Complete! Files generated in /output ---")

if __name__ == "__main__":
    # Define your specific metrics here
    FILE_PATH = "../Anexo_ Listado de Métricas de actividad en MOODLE.xlsx"
    
    # Example usage based on requirement:
    CATEGORICAL_METRICS = [
        "accion_predominante", "tipo_de_participacion", 
        "finalizacion_por_calificacion", "finalizacion_del_curso", "riesgo"
    ]
    
    # You might want to get the actual numeric columns dynamically or specify them.
    # We will grab all float/int columns except the 'Grupo' as default numeric columns.
    temp_df = pd.read_excel(FILE_PATH) if os.path.exists(FILE_PATH) else pd.DataFrame()
    if not temp_df.empty:
        GROUP_COL_NAME = "Grupo" if "Grupo" in temp_df.columns else temp_df.columns[0] # Fallback to first col
        NUMERIC_METRICS = temp_df.select_dtypes(include=[np.number]).columns.tolist()
        
        # Verify categorical columns actually exist, adjusting names if they differ in the excel
        actual_cat_cols = [col for col in temp_df.columns if any(c in col.lower() for c in ['accion', 'tipo', 'finaliz', 'riesgo'])]
        
        analyzer = MetricAnalyzerSystem(FILE_PATH, group_col=GROUP_COL_NAME)
        analyzer.run_analysis(numeric_cols=NUMERIC_METRICS, categorical_cols=actual_cat_cols)
    else:
        print(f"Could not load the file: {FILE_PATH}. Make sure it exists.")
