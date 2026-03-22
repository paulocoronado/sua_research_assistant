import strawberry
from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter

@strawberry.type
class Query:
    @strawberry.field
    def hello(self) -> str:
        return "Hello from SUA API Gateway!"

schema = strawberry.Schema(Query)
graphql_app = GraphQLRouter(schema)

app = FastAPI(title="SUA - API Gateway")
app.include_router(graphql_app, prefix="/graphql")

@app.get("/")
def read_root():
    return {"message": "Welcome to SUA API Gateway"}
