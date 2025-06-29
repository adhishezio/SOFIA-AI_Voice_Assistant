import logging
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.documents import Document
from chromadb.config import Settings
import os

PERSIST_DIRECTORY = "sofia_memory_db"
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"

class MemorySystem:
    def __init__(self):
        logging.info("Initializing MemorySystem...")
        self.embedding_model = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL_NAME)
        client_settings = Settings(anonymized_telemetry=False)
        self.vector_store = Chroma(
            persist_directory=PERSIST_DIRECTORY,
            embedding_function=self.embedding_model,
            client_settings=client_settings
        )
        logging.info("MemorySystem initialized successfully.")

    def add_memory(self, user_identity: str, memory_text: str) -> str:
        try:
            doc = Document(page_content=memory_text, metadata={"user_id": user_identity})
            self.vector_store.add_documents([doc])
            logging.info(f"Added memory for user '{user_identity}': {memory_text}")
            return "I will remember that."
        except Exception as e:
            logging.error(f"Error adding memory: {e}")
            return f"An internal error occurred while saving to my memory banks: {e}"

    def recall_memory(self, user_identity: str, query: str) -> str:
        try:
            results = self.vector_store.similarity_search(
                query,
                k=3,
                filter={"user_id": user_identity}
            )
            if not results:
                return "I don't seem to have any memories related to that."
            
            recalled_info = "\n".join([f"- {doc.page_content}" for doc in results])
            logging.info(f"Recalled for user '{user_identity}' based on query '{query}':\n{recalled_info}")
            return f"Based on my memory, here's what I found related to your query:\n{recalled_info}"
        except Exception as e:
            logging.error(f"Error recalling memory: {e}")
            return f"An internal error occurred while accessing my memory banks: {e}"

    def delete_memory(self, user_identity: str, query: str) -> str:
        """searches for and deletes memories related to a specific query for a user."""
        try:
            # search for documents related to the user's identity
            search_results = self.vector_store.get(
                where={"user_id": user_identity},
                include=["metadatas", "documents"] 
            )
            # check if we have any results
            if not search_results or not search_results["ids"]:
                return "I couldn't find any relevant memories to delete."

            # langChain's similarity search 
            docs_to_check = [Document(page_content=doc, metadata=meta) 
                             for doc, meta in zip(search_results['documents'], search_results['metadatas'])]
            
            # use a separate retriever to find the most relevant document to the delete query
            retriever = self.vector_store.as_retriever(search_kwargs={'k': 1, 'filter': {'user_id': user_identity}})
            relevant_docs = retriever.invoke(query)

            if not relevant_docs:
                return "I found no specific memory matching that description to delete."
            
            content_to_delete = relevant_docs[0].page_content
            id_to_delete = None

            # find the ID of the document with the matching content
            for i, doc_content in enumerate(search_results["documents"]):
                if doc_content == content_to_delete:
                    id_to_delete = search_results["ids"][i]
                    break
            
            if id_to_delete:
                self.vector_store.delete(ids=[id_to_delete])
                logging.info(f"Deleted memory for user '{user_identity}': {content_to_delete}")
                return "I have now deleted that information from my memory banks."
            else:
                return "I couldn't pinpoint the exact memory to delete."

        except Exception as e:
            logging.error(f"Error deleting memory: {e}")
            return "I encountered an error while trying to forget that information."