import strawberry
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
from github_service.schema import GitHubQuery

@strawberry.type
class Query(GitHubQuery):
    @strawberry.field
    def hello(self) -> str:
        return "Hello from SUA API Gateway!"

schema = strawberry.Schema(Query)
graphql_app = GraphQLRouter(schema)

app = FastAPI(title="SUA - API Gateway")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(graphql_app, prefix="/graphql")

@app.get("/")
def read_root():
    return {"message": "Welcome to SUA API Gateway"}
