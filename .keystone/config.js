"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core2 = require("@keystone-6/core");

// schema.ts
var import_core = require("@keystone-6/core");
var import_fields = require("@keystone-6/core/fields");
var import_fields_document = require("@keystone-6/fields-document");

// access.ts
var isSignedIn = ({ session: session2 }) => {
  return !!session2;
};
var permissions = {
  isAdmin: ({ session: session2 }) => {
    return !!session2?.data.isAdmin;
  },
  isDM: ({ session: session2 }) => {
    return !!session2?.data.isDM;
  },
  isUser: ({ session: session2 }) => {
    return !!session2?.data.isUser;
  }
};
var rules = {
  hideCreateButton: ({ session: session2 }) => {
    if (!session2) {
      return false;
    } else if (!!session2?.data.isAdmin) {
      return false;
    } else {
      return true;
    }
  },
  canRead: ({ session: session2 }) => {
    if (!session2) {
      return false;
    } else {
      return true;
    }
  },
  canUpdate: ({ session: session2 }) => {
    if (!session2) {
      return false;
    } else if (!!session2?.data.isAdmin || !!session2?.data.isDM) {
      return true;
    } else {
      return false;
    }
  },
  hideDeleteButton: ({ session: session2 }) => {
    if (!session2) {
      return false;
    } else if (!!session2?.data.isAdmin) {
      return false;
    } else {
      return true;
    }
  }
};

// schema.ts
var lists = {
  // the Character list for character creation
  Character: (0, import_core.list)({
    access: {
      operation: {
        create: () => true,
        query: () => true,
        update: () => true,
        delete: (session2) => permissions.isAdmin(session2)
      }
    },
    fields: {
      // the name of the user
      username: (0, import_fields.text)({
        validation: { isRequired: true },
        isIndexed: true
      }),
      // the role of the user + virtual booleans
      role: (0, import_fields.select)({
        type: "string",
        defaultValue: "admin",
        options: [
          {
            label: "Adminisztr\xE1tor",
            value: "admin"
          },
          {
            label: "Mes\xE9l\u0151",
            value: "DM"
          },
          {
            label: "Felhaszn\xE1l\xF3",
            value: "user"
          }
        ]
      }),
      isAdmin: (0, import_fields.virtual)({
        field: import_core.graphql.field({
          type: import_core.graphql.Boolean,
          resolve(item) {
            return item.role === "admin";
          }
        })
      }),
      isDM: (0, import_fields.virtual)({
        field: import_core.graphql.field({
          type: import_core.graphql.Boolean,
          resolve(item) {
            return item.role === "DM";
          }
        })
      }),
      isUser: (0, import_fields.virtual)({
        field: import_core.graphql.field({
          type: import_core.graphql.Boolean,
          resolve(item) {
            return item.role === "user";
          }
        })
      }),
      // the serial number of the registered character
      serial: (0, import_fields.text)({
        ui: {
          itemView: {
            fieldMode: ({ session: session2, context, item }) => "read"
          }
        },
        hooks: {
          resolveInput: async ({ operation, resolvedData, context }) => {
            const charCount = await context.db.Character.count({
              where: { NOT: { username: { equals: "KeystoneJS" } } }
            });
            if (operation === "create") {
              return "#" + (charCount + 1);
            }
            return resolvedData.serial;
          }
        }
      }),
      // the name of the player character
      characterName: (0, import_fields.text)({
        isIndexed: "unique"
      }),
      // the sex of the character
      sex: (0, import_fields.select)({
        type: "string",
        defaultValue: "F",
        options: [
          {
            label: "F\xE9rfi",
            value: "F"
          },
          {
            label: "N\u0151",
            value: "N"
          }
        ]
      }),
      // the email address used to register onto the website
      email: (0, import_fields.text)({
        validation: { isRequired: true },
        isIndexed: "unique"
      }),
      // password used to register onto the website
      password: (0, import_fields.password)({ validation: { isRequired: true } }),
      // reactions of the specific Character
      reacts: (0, import_fields.relationship)({ ref: "Reaction", many: true }),
      // the money amount at the beginnning for every character
      money: (0, import_fields.integer)({ defaultValue: 100 }),
      // selected race
      raceSelect: (0, import_fields.relationship)({ ref: "Race", many: false }),
      // the level of the character
      characterLevel: (0, import_fields.integer)({ defaultValue: 1 }),
      // the rank of the player character + virtual booleans
      rank: (0, import_fields.select)({
        type: "string",
        defaultValue: "beginner",
        options: [
          {
            label: "Kezd\u0151 J\xE1t\xE9kos",
            value: "beginner"
          },
          {
            label: "J\xE1t\xE9kos",
            value: "player"
          },
          {
            label: "Halad\xF3 j\xE1t\xE9kos",
            value: "advanced"
          },
          {
            label: "Tapasztalt J\xE1t\xE9kos",
            value: "experienced"
          }
        ]
      }),
      isBeginner: (0, import_fields.virtual)({
        field: import_core.graphql.field({
          type: import_core.graphql.Boolean,
          resolve(item) {
            return item.rank === "beginner";
          }
        })
      }),
      isPlayer: (0, import_fields.virtual)({
        field: import_core.graphql.field({
          type: import_core.graphql.Boolean,
          resolve(item) {
            return item.rank === "player";
          }
        })
      }),
      isAdvanced: (0, import_fields.virtual)({
        field: import_core.graphql.field({
          type: import_core.graphql.Boolean,
          resolve(item) {
            return item.rank === "advanced";
          }
        })
      }),
      isExperienced: (0, import_fields.virtual)({
        field: import_core.graphql.field({
          type: import_core.graphql.Boolean,
          resolve(item) {
            return item.rank === "experienced";
          }
        })
      }),
      // ability scores and modifiers
      strength: (0, import_fields.integer)({ defaultValue: 0 }),
      strengthScoreIncrease: (0, import_fields.virtual)({
        field: import_core.graphql.field({
          type: import_core.graphql.Int,
          async resolve(item, args, context) {
            const raceDataRecord = await context.db.Race.findOne({
              where: { id: item.raceSelectId?.toString() }
            });
            return raceDataRecord.strength;
          }
        })
      }),
      dexterity: (0, import_fields.integer)({ defaultValue: 0 }),
      dexterityScoreIncrease: (0, import_fields.virtual)({
        field: import_core.graphql.field({
          type: import_core.graphql.Int,
          async resolve(item, args, context) {
            const raceDataRecord = await context.db.Race.findOne({
              where: { id: item.raceSelectId?.toString() }
            });
            return raceDataRecord.dexterity;
          }
        })
      }),
      constitution: (0, import_fields.integer)({ defaultValue: 0 }),
      constitutionScoreIncrease: (0, import_fields.virtual)({
        field: import_core.graphql.field({
          type: import_core.graphql.Int,
          async resolve(item, args, context) {
            const raceDataRecord = await context.db.Race.findOne({
              where: { id: item.raceSelectId?.toString() }
            });
            return raceDataRecord.constitution;
          }
        })
      }),
      intelligence: (0, import_fields.integer)({ defaultValue: 0 }),
      intelligenceScoreIncrease: (0, import_fields.virtual)({
        field: import_core.graphql.field({
          type: import_core.graphql.Int,
          async resolve(item, args, context) {
            const raceDataRecord = await context.db.Race.findOne({
              where: { id: item.raceSelectId?.toString() }
            });
            return raceDataRecord.intelligence;
          }
        })
      }),
      wisdom: (0, import_fields.integer)({ defaultValue: 0 }),
      wisdomScoreIncrease: (0, import_fields.virtual)({
        field: import_core.graphql.field({
          type: import_core.graphql.Int,
          async resolve(item, args, context) {
            const raceDataRecord = await context.db.Race.findOne({
              where: { id: item.raceSelectId?.toString() }
            });
            return raceDataRecord.wisdom;
          }
        })
      }),
      charisma: (0, import_fields.integer)({ defaultValue: 0 }),
      charismaScoreIncrease: (0, import_fields.virtual)({
        field: import_core.graphql.field({
          type: import_core.graphql.Int,
          async resolve(item, args, context) {
            const raceDataRecord = await context.db.Race.findOne({
              where: { id: item.raceSelectId?.toString() }
            });
            return raceDataRecord.charisma;
          }
        })
      }),
      // languages spoken by the character
      languages: (0, import_fields.relationship)({ ref: "Language", many: true }),
      // outer description textbox
      outerDescription: (0, import_fields_document.document)({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1]
        ],
        links: true,
        dividers: true,
        access: {
          // outer description can read by anyone, who is signed in
          read: isSignedIn,
          // can be created by only the same person equals to the characters person
          create: () => true,
          // can be updated by only the same person equals to the characters person or by a DM
          update: ({ session: session2, context, listKey, fieldKey, operation, inputData, item }) => {
            if (session2.itemId === item.id || session2?.data.isDM) {
              return true;
            }
            return false;
          }
        }
      }),
      // inner description textbox
      innerDescription: (0, import_fields_document.document)({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1]
        ],
        links: true,
        dividers: true,
        access: {
          // inner description can be read by anyone who is signed in
          read: isSignedIn,
          // can be created by only the same person equals to the characters person
          create: () => true,
          // can be updated by only the same person equals to the characters person or by a DM
          update: ({ session: session2, context, listKey, fieldKey, operation, inputData, item }) => {
            if (session2.itemId === item.id || session2?.data.isDM) {
              return true;
            }
            return false;
          }
        }
      }),
      // the necessary backstory textbox
      backStory: (0, import_fields_document.document)({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1]
        ],
        links: true,
        dividers: true,
        access: {
          // can be read by only the same person equals to the characters person or by a DM
          read: ({ session: session2, context, listKey, fieldKey, operation, item }) => {
            if (session2.itemId === item.id || session2?.data.isDM) {
              return true;
            }
            return false;
          },
          // can be created by only the same person equals to the characters person
          create: () => true,
          // can be updated by only the same person equals to the characters person or by a DM
          update: ({ session: session2, context, listKey, fieldKey, operation, inputData, item }) => {
            if (session2.itemId === item.id || session2?.data.isDM) {
              return true;
            }
            return false;
          }
        }
      }),
      // player can take notes for self, hidden from others in this box
      notes: (0, import_fields_document.document)({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1]
        ],
        links: true,
        dividers: true,
        ui: {
          createView: {
            fieldMode: ({ session: session2, context }) => "hidden"
          },
          itemView: {
            // can only be read by the writer itself, nobody else
            fieldMode: async ({ session: session2, context, item }) => {
              if (session2.itemId === item.id) {
                return "edit";
              }
              return "hidden";
            }
          },
          listView: {
            fieldMode: ({ session: session2, context }) => "hidden"
          }
        },
        access: {
          read: ({ session: session2, context, listKey, fieldKey, operation, item }) => {
            if (session2.itemId === item.id) {
              return true;
            }
            return false;
          },
          create: () => true,
          update: ({ session: session2, context, listKey, fieldKey, operation, inputData, item }) => {
            if (session2.itemId === item.id) {
              return true;
            }
            return false;
          }
        }
      }),
      // gaming style
      gameStyle: (0, import_fields.select)({
        type: "string",
        defaultValue: "lightcore",
        options: [
          {
            label: "J\xE1mbor",
            value: "lightcore"
          },
          {
            label: "\xD3vatos",
            value: "midcore"
          },
          {
            label: "B\xE1tor",
            value: "hardcore"
          }
        ],
        access: {
          // gamestyle can be read anyone logged in
          read: isSignedIn,
          // TODO testing who can do it, who cannot
          create: () => true,
          // can be updated only by the character in-name
          update: ({ session: session2, context, listKey, fieldKey, operation, inputData, item }) => {
            if (session2.itemId === item.id) {
              return true;
            }
            return false;
          }
        }
      }),
      // TODO
      // the belief of the character
      belief: (0, import_fields.select)({
        type: "string",
        defaultValue: "ateist",
        options: [
          {
            label: "Pog\xE1ny",
            value: "ateist"
          },
          {
            label: "NEED IDEA",
            value: "TO BE FILLED IN"
          },
          {
            label: "WHAT COMES HERE",
            value: "TO BE FILLED OUT"
          }
        ]
      }),
      // in-game events recorded by DMs
      events: (0, import_fields_document.document)({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1]
        ],
        links: true,
        dividers: true,
        access: {
          read: ({ session: session2, context, listKey, fieldKey, operation, item }) => true,
          create: ({ session: session2, context, listKey, fieldKey, operation, inputData }) => {
            if (session2?.data.isDM) {
              return true;
            }
            return false;
          },
          update: async ({ session: session2, context, listKey, fieldKey, operation, inputData, item }) => {
            if (session2?.data.isDM) {
              return true;
            }
            return false;
          }
        }
      }),
      // TODO: needs Access Control and Automatization
      // backpack recorded automatically at buying and selling or dropping items
      ...(0, import_core.group)({
        label: "H\xE1tizs\xE1k",
        description: "Automatikusan szerkeszt\u0151d\u0151 h\xE1tizs\xE1k",
        fields: {
          // the contents of the backpack
          backpack: (0, import_fields_document.document)({
            formatting: true,
            layouts: [
              [1, 1],
              [1, 1, 1],
              [2, 1],
              [1, 2],
              [1, 2, 1]
            ],
            links: true,
            dividers: true,
            ui: {
              itemView: {
                fieldMode: ({ session: session2, context, item }) => "edit"
              }
            },
            access: {
              read: ({ session: session2, context, listKey, fieldKey, operation, item }) => true,
              create: ({ session: session2, context, listKey, fieldKey, operation, inputData }) => true,
              update: ({ session: session2, context, listKey, fieldKey, operation, inputData, item }) => true
            }
          }),
          // backpack contents count
          // updating through Frontend ONLY
          backPackContents: (0, import_fields.integer)({
            defaultValue: 0,
            ui: {
              itemView: {
                fieldMode: ({ session: session2, context, item }) => "read"
              }
            }
          }),
          // default backpack slots, 
          // can be upgraded as character level grows
          // (THROUGH THE FRONTEND ONLY)
          backPackSlots: (0, import_fields.integer)({
            defaultValue: 3,
            ui: {
              itemView: {
                fieldMode: ({ session: session2, context, item }) => "read"
              }
            }
          })
        }
      }),
      // the time when the character has been registered
      registeredAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      })
    },
    // Admin UI settings
    ui: {
      labelField: "characterName",
      listView: {
        initialColumns: ["username", "characterName", "email", "raceSelect", "registeredAt"]
      },
      description: "Regisztr\xE1lt karakterek list\xE1ja"
    }
  }),
  // list of connected multi-characters, meanoing characters registered bu the same user
  // allows to connect and easily navigate between charactes on the frontend
  Multi: (0, import_core.list)({
    access: {
      operation: {
        create: () => true,
        query: () => true,
        update: () => true,
        delete: () => true
      }
    },
    ui: {
      listView: {
        initialColumns: ["main", "id", "mainCharacter", "connectedCharacters"]
      }
    },
    fields: {
      main: (0, import_fields.text)({
        validation: { isRequired: true },
        hooks: {
          resolveInput: async ({ operation, inputData, resolvedData, context }) => {
            const mainChar = await context.db.Character.findOne({
              where: { id: inputData.mainCharacter?.connect?.id?.toString() }
            });
            if (operation === "create" || operation === "update") {
              return mainChar?.characterName;
            }
            return resolvedData.main;
          }
        }
      }),
      mainCharacter: (0, import_fields.relationship)({
        ref: "Character",
        many: false
      }),
      connectedCharacters: (0, import_fields.relationship)({
        ref: "Character",
        many: true
      })
    }
  }),
  // inventory management
  Inventory: (0, import_core.list)({
    access: {
      operation: {
        create: () => true,
        query: () => true,
        update: () => true,
        delete: () => true
      }
    },
    fields: {
      rightHandWeapon: (0, import_fields.text)(),
      leftHandWeapon: (0, import_fields.text)(),
      shield: (0, import_fields.text)(),
      armor: (0, import_fields.text)(),
      casque: (0, import_fields.text)(),
      amulet: (0, import_fields.text)(),
      other: (0, import_fields.text)()
    },
    ui: {
      listView: {
        initialColumns: ["id", "rightHandWeapon", "leftHandWeapon", "shield", "armor", "casque", "amulet", "other"]
      },
      description: "Felszerel\xE9s lista \xE9s kezel\xE9s"
    }
  }),
  // Reactions management
  Reaction: (0, import_core.list)({
    access: {
      operation: {
        create: () => true,
        query: () => true,
        update: () => true,
        delete: () => true
      }
    },
    fields: {
      // the name of the reaction made up of 
      // the characters name, the location and the date (e.g. HugoTempleOfDoom20230817)
      title: (0, import_fields.text)({ validation: { isRequired: true } }),
      // TODO: when editing, add a message that it was edited by the author or by the Staff, 
      // TODO: FRONTEND SOLUTION
      // the body of the whole reaction written by the character
      reaction: (0, import_fields_document.document)({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1]
        ],
        links: true,
        dividers: true
      }),
      // Author, Location and Serial Number
      ...(0, import_core.group)({
        label: "Szerz\u0151, Helysz\xEDn, Sorsz\xE1m",
        description: "A sorsz\xE1m egy\xE9ni a k\xFCl\xF6nb\xF6z\u0151 helysz\xEDneknek",
        fields: {
          // the author of the reactions
          author: (0, import_fields.text)({
            validation: { isRequired: true },
            hooks: {
              resolveInput: async ({ context, inputData, resolvedData, item, operation }) => {
                const reactionRecord = await context.db.Reaction.findOne({
                  where: { id: item?.id }
                });
                if (operation === "update") {
                  return reactionRecord?.author;
                }
                return resolvedData.author;
              }
            },
            ui: {
              itemView: {
                fieldMode: ({ context, session: session2, item }) => "read"
              }
            }
          }),
          // location, where the reaction has been written
          location: (0, import_fields.text)({
            validation: { isRequired: true },
            isIndexed: true
          }),
          // the serial number of the reaction
          serial: (0, import_fields.integer)({
            defaultValue: -1,
            ui: {
              itemView: {
                fieldMode: ({ context, session: session2, item }) => "read"
              }
            },
            hooks: {
              resolveInput: async ({ context, inputData, resolvedData, item, operation }) => {
                const loc = await context.db.Reaction.count({
                  where: {
                    location: { equals: inputData.location }
                  }
                });
                if (operation === "create") {
                  return loc + 1;
                }
                ;
                return resolvedData.serial;
              }
            }
          })
        }
      }),
      // timestamp the creation date of the reaction
      writtenAt: (0, import_fields.timestamp)({ defaultValue: { kind: "now" } })
    },
    // Admin UI settings
    ui: {
      listView: {
        initialColumns: ["title", "author", "location", "serial", "writtenAt"],
        initialSort: { field: "location", direction: "ASC" }
      },
      hideCreate: (session2) => rules.hideCreateButton(session2),
      hideDelete: (session2) => rules.hideDeleteButton(session2)
    }
  }),
  // list of game requests
  // requests auto-delete after 5 days
  Request: (0, import_core.list)({
    access: {
      operation: {
        create: () => true,
        query: () => true,
        update: (session2) => permissions.isDM(session2) || permissions.isAdmin(session2),
        delete: () => true
      }
    },
    fields: {
      // the user or character who requested the game
      who: (0, import_fields.text)(),
      // the game type the character requested
      gameType: (0, import_fields.select)({
        type: "string",
        defaultValue: "1v1",
        options: [
          {
            label: "Mag\xE1n",
            value: "1v1"
          },
          {
            label: "Mag\xE1n Mes\xE9l\u0151vel",
            value: "1v1DM"
          },
          {
            label: "Multi",
            value: "multi"
          },
          {
            label: "Multi Mes\xE9l\u0151vel",
            value: "multiDM"
          }
        ]
      }),
      // description of game the character wants to play out
      description: (0, import_fields_document.document)({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1]
        ],
        links: true,
        dividers: true
      }),
      // accept or reject a game request with DM
      ...(0, import_core.group)({
        label: "J\xE1t\xE9kfelk\xE9r\xE9s elfogad\xE1sa/elutas\xEDt\xE1sa",
        description: "Csak Mes\xE9l\u0151 felk\xE9r\u0151s j\xE1t\xE9kokn\xE1l m\xFAk\xF6dik",
        fields: {
          accepted: (0, import_fields.checkbox)({ defaultValue: false }),
          rejected: (0, import_fields.checkbox)({ defaultValue: false })
        }
      }),
      // reason for rejection
      rejectionReason: (0, import_fields.text)(),
      // rejection feedback
      rejectionFeedback: (0, import_fields_document.document)({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1]
        ],
        links: true,
        dividers: true
      }),
      // timestamp when the request was made
      requestedAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      })
    },
    ui: {
      labelField: "who",
      listView: {
        initialColumns: ["who", "gameType", "accepted", "rejected", "requestedAt"],
        defaultFieldMode: "read"
      },
      itemView: {
        defaultFieldMode: "read"
      },
      hideCreate: (session2) => rules.hideCreateButton(session2),
      hideDelete: (session2) => rules.hideDeleteButton(session2),
      description: "J\xE1t\xE9kost\xE1rs keres\xE9sek(JTK) list\xE1ja"
    }
  }),
  // list of available, playable races on Wazi
  Race: (0, import_core.list)({
    access: {
      operation: {
        create: () => true,
        query: () => true,
        update: () => true,
        delete: () => true
      }
    },
    fields: {
      // name of the race
      name: (0, import_fields.text)({ validation: { isRequired: true }, isIndexed: "unique" }),
      // life phases and other general description
      description: (0, import_fields_document.document)({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1]
        ],
        links: true,
        dividers: true
      }),
      // ASI table
      ...(0, import_core.group)({
        label: "K\xE9pess\xE9g Pontsz\xE1m B\xF3nusz",
        description: "Fajf\xFCgg\u0151",
        fields: {
          strength: (0, import_fields.integer)({ defaultValue: 0 }),
          dexterity: (0, import_fields.integer)({ defaultValue: 0 }),
          constitution: (0, import_fields.integer)({ defaultValue: 0 }),
          intelligence: (0, import_fields.integer)({ defaultValue: 0 }),
          wisdom: (0, import_fields.integer)({ defaultValue: 0 }),
          charisma: (0, import_fields.integer)({ defaultValue: 0 })
        }
      })
    },
    // Admin UI settings
    ui: {
      hideCreate: (session2) => rules.hideCreateButton(session2),
      hideDelete: (session2) => rules.hideDeleteButton(session2),
      labelField: "name",
      listView: {
        initialColumns: ["name", "strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"]
      },
      description: "Fajok list\xE1ja Wazi-n"
    }
  }),
  // list of languages spoken in Wazi
  Language: (0, import_core.list)({
    access: {
      operation: {
        create: () => true,
        query: () => true,
        update: () => true,
        delete: (session2) => permissions.isAdmin(session2)
      }
    },
    fields: {
      // the name of the language spoken in Wazi
      name: (0, import_fields.text)({ validation: { isRequired: true } })
    },
    // Admin UI settings
    ui: {
      hideCreate: (session2) => rules.hideCreateButton(session2),
      hideDelete: (session2) => rules.hideDeleteButton(session2),
      labelField: "name",
      description: "Besz\xE9lt nyelvek list\xE1ja Wazi-n"
    }
  }),
  // the main calendar of the game, accepted mostly by humans 
  Calendar: (0, import_core.list)({
    access: {
      operation: {
        create: () => true,
        query: () => true,
        update: () => true,
        delete: () => true
      }
    },
    fields: {
      // JSON fields as calendar data containers
      calendarName: (0, import_fields.text)({ validation: { isRequired: true }, isIndexed: "unique" }),
      startingYear: (0, import_fields.json)({ defaultValue: { "year": 0 } }),
      firstDay: (0, import_fields.json)({ defaultValue: { "first_day": 0 } }),
      yearLength: (0, import_fields.json)({ defaultValue: { "year_len": 360 } }),
      numberOfMonths: (0, import_fields.json)({ defaultValue: { "n_months": 11 } }),
      months: (0, import_fields.json)({ defaultValue: { "months": ["Ananeeh", "Arakeh", "Thanike", "Thalyta", "Beetary", "Kaniti", "Shadokti", "Jashruna", "Eurnia", "Bilara", "Kathirikh"] } }),
      monthsLength: (0, import_fields.json)({ defaultValue: { "month_len": { "Ananeeh": 33, "Arakeh": 33, "Thanike": 33, "Thalyta": 32, "Beetary": 33, "Kaniti": 33, "Shadokti": 32, "Jashruna": 33, "Eurnia": 33, "Bilara": 33, "Kathirikh": 32 } } }),
      weekLength: (0, import_fields.json)({ defaultValue: { "week_len": 7 } }),
      weekDays: (0, import_fields.json)({ defaultValue: { "weekdays": ["Katib", "Suriel", "Binem", "Jeha", "Daliel", "Penur", "Durim"] } }),
      numberOfMoons: (0, import_fields.json)({ defaultValue: { "n_moons": 1 } }),
      moons: (0, import_fields.json)({ defaultValue: { "moons": ["Camua"] } }),
      lunarCycle: (0, import_fields.json)({ defaultValue: { "lunar_cyc": { "Camua": 32 } } })
    },
    // Admin UI settings
    ui: {
      labelField: "calendarName",
      listView: {
        initialColumns: ["calendarName", "id"]
      },
      description: "Wazi Napt\xE1r JSON form\xE1tumban GraphQL lek\xE9rdez\xE9sekhez"
    }
  }),
  // log of when the users logged in and out of the system
  Log: (0, import_core.list)({
    access: {
      operation: {
        create: () => true,
        query: (session2) => permissions.isAdmin(session2),
        update: () => false,
        delete: (session2) => permissions.isAdmin(session2)
      }
    },
    ui: {
      hideCreate: (session2) => rules.hideCreateButton(session2),
      hideDelete: (session2) => rules.hideDeleteButton(session2),
      labelField: "who",
      listView: {
        initialColumns: ["id", "who", "what", "when"]
      },
      description: "Be/kil\xE9p\xE9si Napl\xF3"
    },
    fields: {
      who: (0, import_fields.text)({
        validation: { isRequired: true }
      }),
      what: (0, import_fields.select)({
        type: "string",
        defaultValue: "",
        options: [
          {
            label: "Login",
            value: "login"
          },
          {
            label: "Logout",
            value: "logout"
          }
        ]
      }),
      when: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      })
    }
  }),
  // private messaging
  PM: (0, import_core.list)({
    access: {
      operation: {
        create: () => true,
        query: () => true,
        update: () => true,
        delete: (session2) => permissions.isAdmin(session2)
      },
      filter: {
        query: ({ session: session2, context, listKey, operation }) => {
          return { reported: { equals: true } };
        }
      }
    },
    ui: {
      hideCreate: (session2) => rules.hideCreateButton(session2),
      hideDelete: (session2) => rules.hideDeleteButton(session2),
      labelField: "who",
      listView: {
        initialColumns: ["id", "reported", "who", "toWhom", "when"]
      },
      description: "Priv\xE1t \xFCzenetek"
    },
    fields: {
      who: (0, import_fields.text)({
        validation: { isRequired: true }
      }),
      toWhom: (0, import_fields.text)({
        validation: { isRequired: true }
      }),
      what: (0, import_fields_document.document)({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1]
        ],
        links: true,
        dividers: true,
        access: {
          read: () => true,
          // async ({ session, context, listKey, fieldKey, operation, item }) => {
          //   const characterRecord = await context.db.Character.findOne({ where: { characterName: item.who?.toString() }});
          //   if (characterRecord.id === session.itemId) {
          //     return true
          //   }
          //   return false
          // },
          create: ({ session: session2, context, listKey, fieldKey, operation, inputData }) => true,
          update: ({ session: session2, context, listKey, fieldKey, operation, inputData, item }) => false
        }
      }),
      reported: (0, import_fields.checkbox)(),
      when: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      })
    }
  })
};

// auth.ts
var import_crypto = require("crypto");
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== "production") {
  sessionSecret = (0, import_crypto.randomBytes)(32).toString("hex");
}
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "Character",
  identityField: "email",
  // this is a GraphQL query fragment for fetching what data will be attached to a context.session
  //   this can be helpful for when you are writing your access control functions
  //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
  sessionData: "id username isAdmin isDM isUser",
  secretField: "password",
  // WARNING: remove initFirstItem functionality in production
  //   see https://keystonejs.com/docs/config/auth#init-first-item for more
  initFirstItem: {
    // if there are no items in the database, by configuring this field
    //   you are asking the Keystone AdminUI to create a new user
    //   providing inputs for these fields
    fields: ["username", "email", "password"]
    // it uses context.sudo() to do this, which bypasses any access control you might have
    //   you shouldn't use this in production
  }
});
var sessionMaxAge = 60 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret,
  ironOptions: {
    encryption: {
      saltBits: 256,
      algorithm: "aes-256-cbc",
      iterations: 1,
      minPasswordlength: 8
    },
    integrity: {
      saltBits: 256,
      algorithm: "sha256",
      iterations: 1,
      minPasswordlength: 8
    },
    ttl: 0,
    timestampSkewSec: 60,
    localtimeOffsetMsec: 0
  },
  secure: true,
  path: "/",
  domain: "localhost",
  sameSite: "none"
});

// keystone.ts
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
var keystone_default = withAuth(
  (0, import_core2.config)({
    db: {
      provider: "mysql",
      url: `${process.env.DATABASE_URL}`
    },
    lists,
    session,
    server: {
      cors: { origin: ["http://localhost:8000"], credentials: true },
      port: 3e3
    }
  })
);
//# sourceMappingURL=config.js.map
