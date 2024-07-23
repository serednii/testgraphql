// const graphql = require('graphql');
// const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLSchema, GraphQLList } = graphql;
// const Link = require('../modelsLink/Link');
// const LinkItem = require('../modelsLink/LinkItem');

// const LinkType = new GraphQLObjectType({
//     name: 'Link',
//     fields: () => ({
//         type: { type: new GraphQLNonNull(GraphQLString) },
//         level: { type: new GraphQLNonNull(GraphQLInt) },
//         menu: { type: LinkType },
//         idLinks: { type: LinkItemType },
//     })
// });

// const LinkItemType = new GraphQLObjectType({
//     name: 'LinkItem',
//     fields: () => ({
//         link: { type: GraphQLString },
//         name: { type: new GraphQLNonNull(GraphQLString) },
//         idArticle: { type: GraphQLInt },
//     })
// });

// const RootQueryType = new GraphQLObjectType({
//     name: 'RootQueryType',
//     fields: {
//         link: {
//             type: new GraphQLList(LinkType),
//             resolve() {
//                 return Link.find({});
//             }
//         }
//     }
// });

// module.exports = new GraphQLSchema({
//     query: RootQueryType,
// });


const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLSchema, GraphQLList, GraphQLID } = graphql;
const Menu = require('../modelsLink/Menu');
const LinkItem = require('../modelsLink/LinkItem');
const { GraphQLJSON } = require('graphql-type-json');
// const GraphQLJSON = require('graphql-type-json');

const LinkItemType = new GraphQLObjectType({
    name: 'LinkItem',
    fields: () => ({
        id: { type: GraphQLID },
        link: { type: GraphQLString },
        name: { type: new GraphQLNonNull(GraphQLString) },
        idArticle: { type: GraphQLInt },
    })
});

const MenuType = new GraphQLObjectType({
    name: 'Menu',
    fields: () => ({
        id: { type: GraphQLID },
        menu: { type: GraphQLJSON },
        // type: { type: GraphQLString },
        // nameMenu: { type: GraphQLString },
        // level: { type: GraphQLInt },
        // menu: { type: new GraphQLList(LinkType) }, // Assuming 'menu' is an array of links
        // idLinks: { type: new GraphQLList(LinkItemType) },
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        menu: {
            type: new GraphQLList(MenuType),
            resolve() {
                return Menu.find({});
            }
        },
        linkItems: {
            type: new GraphQLList(LinkItemType),
            resolve() {
                return LinkItem.find({});
            }
        },
        linkItem: {
            type: new GraphQLList(LinkItemType),
            args: { id: { type: GraphQLID } },
            resolve(parent, id) {
                return LinkItem.findById(id);
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        updateMenu: {
            type: MenuType,
            args: {
                id: { type: GraphQLID }, // Оновлення запису за ID
                menu: { type: new GraphQLNonNull(GraphQLJSON) } // Забезпечуємо, що значення обов'язкове
            },
            resolve(parent, { id, menu }) {
                // const newMenu = new Menu({ object: menu }); // Передаємо menu як поле 'object'
                // return newMenu.save();
                if (id) {
                    // Оновлення існуючого меню
                    return Menu.findByIdAndUpdate(id, { menu }, { new: true },);
                } else {
                    // Створення нового меню
                    const newMenu = new Menu({ menu }, { new: true },);
                    return newMenu.save();
                }
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});
