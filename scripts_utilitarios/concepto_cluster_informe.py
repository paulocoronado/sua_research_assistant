# Script para dibujar un plano cartesiano centrado en (0,0) con un mapa de calor de fondo
# Representa la clasificación por conglomerados de los participantes de acuerdo a dos dimensiones:
# "Calidad" (eje X) y "Relación con Estrategias" encontradas en el análisis de informes de taller

import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
import numpy as np

def dibujar_plano_estrategico_centrado():
    # 1. Configuración de estilo
    plt.style.use('seaborn-v0_8-white')
    fig, ax = plt.subplots(figsize=(10, 10))

    # 2. Crear el Mapa de Colores con Transición (Basado en Ángulo)
    # Definir colores principales
    c_verde = "#00ff6a"
    c_amarillo = "#ffcc00"
    c_naranja = '#e67e22'
    c_rojo = "#ff1900"

    
    # 4. Configurar Ejes Centrados en (0,0)
    ax.spines['left'].set_position('center')
    ax.spines['bottom'].set_position('center')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color('black')
    ax.spines['bottom'].set_color('black')
    # 5. Añadir Flechas a los Ejes de color verde oscuro
    ax.plot(1, 0, ">k", transform=ax.get_yaxis_transform(), clip_on=False)
    ax.plot(0, 1, "^k", transform=ax.get_xaxis_transform(), clip_on=False)
    ax.plot(0, 0, "vk", transform=ax.get_xaxis_transform(), clip_on=False)
    ax.plot(0, 0, "<k", transform=ax.get_yaxis_transform(), clip_on=False)

    # No mostrar los valores de los ejes
    ax.set_xticks([])
    ax.set_yticks([])

        # Crear un rectángulo para el primer cuadrante
    rect = plt.Rectangle((0, 0), 1, 1, color=c_verde, alpha=0.7, zorder=0)
    ax.add_patch(rect)
    rect = plt.Rectangle((-1, 0), 1, 1, color=c_amarillo, alpha=0.7, zorder=0)
    ax.add_patch(rect)
    rect = plt.Rectangle((-1, -1), 1, 1, color=c_rojo, alpha=0.7, zorder=0)
    ax.add_patch(rect)
    rect = plt.Rectangle((0, -1), 1, 1, color=c_naranja, alpha=0.7, zorder=0)
    ax.add_patch(rect)


    # Establecer límites normalizados
    ax.set_xlim(-1, 1)
    ax.set_ylim(-1, 1)

    ax.set_xlabel('Calidad', fontsize=12, fontweight='bold', color='#34495e')
    ax.xaxis.set_label_coords(0.75, 0.55)
    
    ax.set_ylabel('Relación con Estrategias', fontsize=12, fontweight='bold', color='#34495e', rotation='vertical')    
    ax.yaxis.set_label_coords(0.5, 0.75)
    
    ax.set_title('Conglomerados', fontsize=16, fontweight='bold', color='#2c3e50', pad=30)

    
    # 7. Textos indicativos en los cuadrantes
    pos = 0.5
    ax.text(pos, pos, 'Conglomerado 1', ha='center', va='center', color='black', fontweight='bold')
    ax.text(-pos, pos, 'Conglomerado 2', ha='center', va='center', color='black', fontweight='bold')
    ax.text(-pos, -pos, 'Conglomerado 3', ha='center', va='center', color='black', fontweight='bold')
    ax.text(pos, -pos, 'Conglomerado 4', ha='center', va='center', color='black', fontweight='bold')



    # Usar bbox_inches='tight' para que no se corten las etiquetas externas
    plt.savefig('plano_cartesiano_centrado_calor.png', dpi=300, bbox_inches='tight')
    plt.show()

if __name__ == "__main__":
    dibujar_plano_estrategico_centrado()