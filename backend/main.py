from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import logging

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialisation de l'application
app = FastAPI(
    title="API de Clustering et Analyse",
    description="API backend pour l'analyse de requêtes et clustering automatique",
    version="1.0.0"
)

# Configuration CORS pour le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Ajustez selon votre frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modèles de données
class QueryInput(BaseModel):
    query: str
    timestamp: Optional[str] = None

class ClusterResult(BaseModel):
    cluster_id: int
    queries: List[str]
    centroid: Optional[str] = None

class AllocationResult(BaseModel):
    fragment_id: str
    size: float
    usage: float

# Routes
@app.get("/")
def read_root():
    """Endpoint de santé de l'API"""
    return {
        "message": "Backend FastAPI OK!",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    """Vérification détaillée de la santé de l'API"""
    return {
        "status": "healthy",
        "services": {
            "api": "running",
            "clustering": "available",
            "query_analyzer": "available"
        }
    }

@app.post("/api/analyze-query")
async def analyze_query(query_input: QueryInput):
    """Analyse une requête SQL"""
    try:
        logger.info(f"Analyzing query: {query_input.query[:50]}...")
        # TODO: Implémenter l'analyse de requête
        return {
            "query": query_input.query,
            "analysis": {
                "type": "SELECT",
                "complexity": "medium",
                "estimated_cost": 100
            }
        }
    except Exception as e:
        logger.error(f"Error analyzing query: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/clustering/auto")
async def auto_clustering(queries: List[QueryInput]):
    """Effectue un clustering automatique des requêtes"""
    try:
        logger.info(f"Clustering {len(queries)} queries...")
        # TODO: Implémenter le clustering
        return {
            "clusters": [
                {
                    "cluster_id": 0,
                    "size": len(queries),
                    "queries": [q.query for q in queries[:3]]
                }
            ],
            "total_clusters": 1
        }
    except Exception as e:
        logger.error(f"Error in clustering: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/allocation/fragments")
async def get_fragments():
    """Récupère l'état des fragments alloués"""
    try:
        # TODO: Implémenter la récupération des fragments
        return {
            "fragments": [
                {"id": "frag_1", "size": 1024, "usage": 75.5},
                {"id": "frag_2", "size": 2048, "usage": 45.2}
            ],
            "total_size": 3072,
            "average_usage": 60.35
        }
    except Exception as e:
        logger.error(f"Error getting fragments: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.on_event("startup")
async def startup_event():
    """Actions au démarrage de l'application"""
    logger.info("Application starting up...")
    # TODO: Initialiser les connexions DB, cache, etc.

@app.on_event("shutdown")
async def shutdown_event():
    """Actions à l'arrêt de l'application"""
    logger.info("Application shutting down...")
    # TODO: Fermer les connexions proprement

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)