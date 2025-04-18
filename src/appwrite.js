import { Client, Databases, Query,ID } from "appwrite";
const PROJECT_ID = import.meta.env.VITE_APPWRITE_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DB_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const client = new Client()
.setEndpoint('https://fra.cloud.appwrite.io/v1')
.setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie)=>{
    //1. check search term exists or not. if it exist update the count
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', searchTerm),
        ]);
        if(result.documents.length>0){
            const doc = result.documents[0];
            await database.updateDocument(DATABASE_ID,COLLECTION_ID, doc.$id, {
                count:doc.count+1,
        })
        }else{
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(),{
                searchTerm,
                count:1,
                movie_id:movie.id,
                poster_url:`https://image.tmdb.org/t/p/w500/${movie.poster_path}`
        })
        }
    } catch (error) {
        console.log('Error in DB connection: ',error);
    }
}