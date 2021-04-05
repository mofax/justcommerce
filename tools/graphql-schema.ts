import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
} from 'graphql';

const graphqlSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootQuery',
        fields: {
            hello: {
                type: GraphQLString,
                resolve() {
                    return 'world';
                },
            },
        },
    }),
});

export { graphqlSchema }