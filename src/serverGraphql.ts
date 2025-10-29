import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import jwtConfig from './config/jwt';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';

const app = express();

const server = new ApolloServer({ typeDefs, resolvers });

(async () => {
    await server.start();

    app.use(
        '/graphql',
        cors(),
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req }) => {
                const token = req.headers.authorization?.split(' ')[1];
                if (!token) return { user: null };
                try {
                    const payload = jwt.verify(token, jwtConfig.secret) as any;
                    return { user: payload };
                } catch {
                    return { user: null };
                }
            },
        })
    );

    const PORT = process.env.GRAPHQL_PORT || 4001;
    app.listen(PORT, () => {
        console.log(`GraphQL server running at http://localhost:${PORT}/graphql`);
    });
})();
