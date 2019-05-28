import React from 'react';
import { storiesOf } from '@storybook/html';
// import { setupGraphiQL } from '@storybook/addon-graphql';

// const graphiql = setupGraphiQL({
//   url: 'https://graphql-pokemon.now.sh/?',
// });

storiesOf('React|GraphQL', module).add('get Pickachu', () => <div>hello</div>, {
  framework: 'react',
  graphiql: {
    query: `{
        pokemon(name: "Pikachu") {
          id
          number
          name
          attacks {
            special {
              name
              type
              damage
            }
          }
          evolutions {
            id
            number
            name
            weight {
              minimum
              maximum
            }
            attacks {
              fast {
                name
                type
                damage
              }
            }
          }
        }
      }`,
    url: 'https://graphql-pokemon.now.sh/?',
  },
});
