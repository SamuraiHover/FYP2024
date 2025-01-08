module.exports = {
    port: 3000,
    db: {
        database: process.env.DB_NAME || 'testdb',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || 'Admin@mysql28', 
        options: {
            dialect: process.env.DIALECT || 'mysql',
            host: process.env.HOST || 'localhost',
        }
    },
    authentication: {
        jwtSecret: process.env.JWT_SECRET || 'secret'
        
    }
}
