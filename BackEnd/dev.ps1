$env:NODE_ENV = "development"
$env:PORT = "8080"
$env:MONGODB_URI = "mongodb+srv://dimaxer:mongopass@chatappcluster.nzab5.mongodb.net/chatapp?retryWrites=true&w=majority&appName=ChatAppCluster"
$env:JWT_SECRET = "!aT$fieyWNFSWc-c+/Qm26C,75iA+VS89wgBZGcCB2kKb9?4pTSV&K,bWLB,V+y03mXBaGV5:Fnjf/.ey0&cV_P6c:QdR!+$Q6vHBtgBbSah%f2TXS9.w%WXDbVRi9DPVLS3vTWPvzHSfRVTSEiD"
npx ts-node-dev --respawn src/server.ts
