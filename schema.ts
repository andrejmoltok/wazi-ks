// Wazi KeystoneJS Schema file

import { list, graphql, group } from '@keystone-6/core';
import {
  text,
  relationship,
  password,
  timestamp,
  integer,
  virtual,
  select,
  checkbox,
  json,
} from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';
import type { Lists } from '.keystone/types';
import { isSignedIn, permissions, rules } from './access';

export const lists: Lists = {

  // the Character list for character creation
  Character: list({
    access: {
      operation: {
        create: () => true,
        query: () => true,
        update: () => true,
        delete: (session) => permissions.isAdmin(session),
      },
    },

    fields: {
      // the name of the user
      username: text({ 
        validation: { isRequired: true },
        isIndexed: true, 
      }),

      // the role of the user + virtual booleans
      role: select({
        type: 'string',
        defaultValue: 'admin',
        options: [
          {
            label: 'Adminisztrátor',
            value: 'admin',
          },
          {
            label: 'Mesélő',
            value: 'DM',
          },
          {
            label: 'Felhasználó',
            value: 'user',
          }
        ]
      }),

      isAdmin: virtual({
        field: graphql.field({
          type: graphql.Boolean,
          resolve(item) {
            return item.role === 'admin';
          }
        }),
      }),

      isDM: virtual({
        field: graphql.field({
          type: graphql.Boolean,
          resolve(item) {
            return item.role === 'DM';
          }
        }),
      }),

      isUser: virtual({
        field: graphql.field({
          type: graphql.Boolean,
          resolve(item) {
            return item.role === 'user';
          }
        }),
      }),

      // the serial number of the registered character
      serial: text({
        ui: {
          itemView: {
            fieldMode: ({ session, context, item }) => 'read',
          },
        },
        hooks: {
          resolveInput: async ({operation,resolvedData,context}) => {
            const charCount = await context.db.Character.count({
              where: { NOT: { username: { equals: "KeystoneJS" } } }
            });
            if (operation === 'create') {
              return '#' + (charCount + 1)
            }
            return resolvedData.serial
          },
        }
      }),

      // the name of the player character
      characterName: text({
        isIndexed: 'unique',
      }),

      // the sex of the character
      sex: select({
        type: 'string',
        defaultValue: 'F',
        options: [
          {
            label: 'Férfi',
            value: 'F',
          },
          {
            label: 'Nő',
            value: 'N',
          }
        ],
      }),

      // the email address used to register onto the website
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),

      // password used to register onto the website
      password: password({ validation: { isRequired: true } }),

      // reactions of the specific Character
      reacts: relationship({ ref: 'Reaction', many: true }),

      // the money amount at the beginnning for every character
      money: integer({ defaultValue: 100 }),

      // selected race
      raceSelect: relationship({ ref: 'Race', many: false}),

      // the level of the character
      characterLevel: integer({ defaultValue: 1 }),

      // the rank of the player character + virtual booleans
      rank: select({
        type: 'string',
        defaultValue: 'beginner',
        options: [
          {
            label: 'Kezdő Játékos',
            value: 'beginner',
          },
          {
            label: 'Játékos',
            value: 'player',
          },
          {
            label: 'Haladó játékos',
            value: 'advanced',
          },
          {
            label: 'Tapasztalt Játékos',
            value: 'experienced',
          }
        ],
      }),

      isBeginner: virtual({
        field: graphql.field({
          type: graphql.Boolean,
          resolve(item) {
            return item.rank === 'beginner';
          }
        }),
      }),

      isPlayer: virtual({
        field: graphql.field({
          type: graphql.Boolean,
          resolve(item) {
            return item.rank === 'player';
          }
        }),
      }),

      isAdvanced: virtual({
        field: graphql.field({
          type: graphql.Boolean,
          resolve(item) {
            return item.rank === 'advanced';
          }
        }),
      }),

      isExperienced: virtual({
        field: graphql.field({
          type: graphql.Boolean,
          resolve(item) {
            return item.rank === 'experienced';
          }
        }),
      }),

      // ability scores and modifiers
      strength: integer({ defaultValue: 0 }),

      strengthScoreIncrease: virtual({
        field: graphql.field({
          type: graphql.Int,
          async resolve(item,args,context) {
            const raceDataRecord = await context.db.Race.findOne({
              where: { id: item.raceSelectId?.toString() }
            }); 
            return raceDataRecord.strength;
          }
        }),
      }),

      dexterity: integer({ defaultValue: 0 }),

      dexterityScoreIncrease: virtual({
        field: graphql.field({
          type: graphql.Int,
          async resolve(item,args,context) {
            const raceDataRecord = await context.db.Race.findOne({
              where: { id: item.raceSelectId?.toString() }
            });
            return raceDataRecord.dexterity;
          }
        }),
      }),

      constitution: integer({ defaultValue: 0 }),

      constitutionScoreIncrease: virtual({
        field: graphql.field({
          type: graphql.Int,
          async resolve(item,args,context) {
            const raceDataRecord = await context.db.Race.findOne({
              where: { id: item.raceSelectId?.toString() }
            });
            return raceDataRecord.constitution;
          }
        }),
      }),

      intelligence: integer({ defaultValue: 0 }),

      intelligenceScoreIncrease: virtual({
        field: graphql.field({
          type: graphql.Int,
          async resolve(item,args,context) {
            const raceDataRecord = await context.db.Race.findOne({
              where: { id: item.raceSelectId?.toString() }
            }); 
            return raceDataRecord.intelligence;
          }
        }),
      }),

      wisdom: integer({ defaultValue: 0 }),

      wisdomScoreIncrease: virtual({
        field: graphql.field({
          type: graphql.Int,
          async resolve(item,args,context) {
            const raceDataRecord = await context.db.Race.findOne({
              where: { id: item.raceSelectId?.toString() }
            });
            return raceDataRecord.wisdom;
          }
        }),
      }),

      charisma: integer({ defaultValue: 0 }),

      charismaScoreIncrease: virtual({
        field: graphql.field({
          type: graphql.Int,
          async resolve(item,args,context) {
            const raceDataRecord = await context.db.Race.findOne({
              where: { id: item.raceSelectId?.toString() }
            });
            return raceDataRecord.charisma;
          }
        }),
      }),

      // languages spoken by the character
      languages: relationship({ ref: 'Language', many: true }),

      // outer description textbox
      outerDescription: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
        access: {
          // outer description can read by anyone, who is signed in
          read: isSignedIn,

          // can be created by only the same person equals to the characters person
          create: () => true,

          // can be updated by only the same person equals to the characters person or by a DM
          update: ({ session, context, listKey, fieldKey, operation, inputData, item }) => {
            if (session.itemId === item.id || session?.data.isDM) {
              return true
            }
            return false
          },
        }
      }),

      // inner description textbox
      innerDescription: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
        access: {
          // inner description can be read by anyone who is signed in
          read: isSignedIn,

          // can be created by only the same person equals to the characters person
          create: () => true,

          // can be updated by only the same person equals to the characters person or by a DM
          update: ({ session, context, listKey, fieldKey, operation, inputData, item }) => {
            if (session.itemId === item.id || session?.data.isDM) {
              return true
            }
            return false
          },
        },
      }),

      // the necessary backstory textbox
      backStory: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
        access: {
          // can be read by only the same person equals to the characters person or by a DM
          read: ({ session, context, listKey, fieldKey, operation, item }) => {
            if (session.itemId === item.id || session?.data.isDM) {
              return true
            }
            return false
          },

          // can be created by only the same person equals to the characters person
          create: () => true,

          // can be updated by only the same person equals to the characters person or by a DM
          update: ({ session, context, listKey, fieldKey, operation, inputData, item }) => {
            if (session.itemId === item.id || session?.data.isDM) {
              return true
            }
            return false
          },
        }
      }),

      // player can take notes for self, hidden from others in this box
      notes: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
        ui:{
          createView: {
            fieldMode: ({ session, context }) => 'hidden',
          },
          itemView: {
            // can only be read by the writer itself, nobody else
            fieldMode: async ({ session, context, item }) => {
                if (session.itemId === item.id) {
                  return 'edit'
                }
                return 'hidden'
            }
          },
          listView: {
            fieldMode: ({ session, context }) => 'hidden',
          },
        },
        access: {
          read: ({ session, context, listKey, fieldKey, operation, item }) => {
            if (session.itemId === item.id) {
              return true
            }
            return false
          },
          create: () => true,
          update: (({ session, context, listKey, fieldKey, operation, inputData, item }) => {
            if (session.itemId === item.id) {
              return true
            }
            return false
          }),
        }
      }),

      // gaming style
      gameStyle: select({
        type: 'string',
        defaultValue: 'lightcore',
        options:[
          {
            label: 'Jámbor',
            value: 'lightcore',
          },
          {
            label: 'Óvatos',
            value: 'midcore',
          },
          {
            label: 'Bátor',
            value: 'hardcore',
          }
        ],
        access: {
          // gamestyle can be read anyone logged in
          read: isSignedIn,

          // TODO testing who can do it, who cannot
          create: () => true,

          // can be updated only by the character in-name
          update: ({ session, context, listKey, fieldKey, operation, inputData, item }) => {
            if (session.itemId === item.id) {
              return true
            }
            return false
          },
        }
      }),

      // TODO
      // the belief of the character
      belief: select({
        type: 'string',
        defaultValue: 'ateist',
        options: [
          {
            label: 'Pogány',
            value: 'ateist',
          },
          {
            label: 'NEED IDEA',
            value: 'TO BE FILLED IN',
          },
          {
            label: 'WHAT COMES HERE',
            value: 'TO BE FILLED OUT',
          },
        ],
      }),

      // in-game events recorded by DMs
      events: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
        access: {
          read: ({ session, context, listKey, fieldKey, operation, item }) => true,
          create: ({ session, context, listKey, fieldKey, operation, inputData }) => {
            if (session?.data.isDM) {
              return true;
            }
            return false;
          },
          update: async ({ session, context, listKey, fieldKey, operation, inputData, item }) => {
            if (session?.data.isDM) {
              return true;
            }
            return false;
          },
        }
      }),

      // TODO: needs Access Control and Automatization
      // backpack recorded automatically at buying and selling or dropping items
      ...group({
        label: 'Hátizsák',
        description: 'Automatikusan szerkesztődő hátizsák',
        fields: {
          // the contents of the backpack
          backpack: document({
            formatting: true,
            layouts: [
              [1, 1],
              [1, 1, 1],
              [2, 1],
              [1, 2],
              [1, 2, 1],
            ],
            links: true,
            dividers: true,
            ui: {
              itemView: {
                fieldMode: ({ session, context, item }) => 'edit',
              },
            },
            access: {
              read: ({ session, context, listKey, fieldKey, operation, item }) => true,
              create: ({ session, context, listKey, fieldKey, operation, inputData }) => true,
              update: ({ session, context, listKey, fieldKey, operation, inputData, item }) => true,
            }
          }),
          
          // backpack contents count
          // updating through Frontend ONLY
          backPackContents: integer({
            defaultValue: 0,
            ui: {
              itemView: {
                fieldMode: ({ session, context, item }) => 'read',
              },
            },
          }),

          // default backpack slots, 
          // can be upgraded as character level grows
          // (THROUGH THE FRONTEND ONLY)
          backPackSlots: integer({
            defaultValue: 3,
            ui: {
              itemView: {
                fieldMode: ({ session, context, item }) => 'read',
              }
            }
          }),
        },
      }),

      // the time when the character has been registered
      registeredAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
    // Admin UI settings
    ui: {
      labelField: 'characterName',
      listView: {
        initialColumns: ['username','characterName','email','raceSelect','registeredAt'],
      },
      description: 'Regisztrált karakterek listája',
    },
  }),

  // list of connected multi-characters, meanoing characters registered bu the same user
  // allows to connect and easily navigate between charactes on the frontend
  Multi: list({
    access: {
      operation: {
        create: () => true,
        query: () => true,
        update: () => true,
        delete: () => true,
      },
    },
    ui: {
      listView: {
        initialColumns: ['main','id','mainCharacter','connectedCharacters'],
      }
    },
    fields: {
      main: text({ validation: { isRequired: true },
        hooks: {
          resolveInput: async ({operation,inputData,resolvedData,context}) => {
            const mainChar = await context.db.Character.findOne({
              where: { id: inputData.mainCharacter?.connect?.id?.toString() }
            });
            if (operation === 'create' || operation === 'update') {
              return mainChar?.characterName
            }
            return resolvedData.main
          }
        }
      }),
      mainCharacter: relationship({
        ref: 'Character', many: false,
      }),
      connectedCharacters: relationship({
        ref: 'Character', many: true,
      }),
    }
  }),

  // inventory management
  Inventory: list({
    access: {
      operation: {
        create: () => true,
        query: () => true,
        update: () => true,
        delete: () => true,
      }
    },
    fields: {
      rightHandWeapon: text(),
      leftHandWeapon: text(),
      shield: text(),
      armor: text(),
      casque: text(),
      amulet: text(),
      other: text(),
    },
    ui: {
      listView: {
        initialColumns: ['id','rightHandWeapon','leftHandWeapon','shield','armor','casque','amulet','other'],
      },
      description: 'Felszerelés lista és kezelés',
    }
  }),

  // Reactions management
  Reaction: list({
    access: {
      operation: {
        create: () => true,
        query: () => true,
        update: () => true,
        delete: () => true,
      },
    },
    fields: {
      // the name of the reaction made up of 
      // the characters name, the location and the date (e.g. HugoTempleOfDoom20230817)
      title: text({ validation: { isRequired: true }}),

      // TODO: when editing, add a message that it was edited by the author or by the Staff, 
      // TODO: FRONTEND SOLUTION
      // the body of the whole reaction written by the character
      reaction: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),

      // Author, Location and Serial Number
      ...group({
        label: 'Szerző, Helyszín, Sorszám',
        description: 'A sorszám egyéni a különböző helyszíneknek',
        fields: {
          // the author of the reactions
          author: text({ 
            validation: { isRequired: true },
            hooks: {
              resolveInput: async ({ context, inputData, resolvedData, item, operation }) => {
                const reactionRecord = await context.db.Reaction.findOne({
                  where: { id: item?.id }
                });
                if (operation === 'update') {
                  return reactionRecord?.author
                }
                return resolvedData.author
              }
            },
            ui: {
              itemView: {
                fieldMode: ({ context, session, item }) => 'read',
              }
            }
          }),

          // location, where the reaction has been written
          location: text({ 
            validation: { isRequired: true },
            isIndexed: true,
          }),

          // the serial number of the reaction
          serial: integer({ 
            defaultValue: -1,
            ui: {
              itemView: {
                fieldMode: ({ context, session, item }) => 'read',
              }
            },
            hooks: {
              resolveInput: async ({context, inputData, resolvedData, item, operation}) => {
                const loc = await context.db.Reaction.count({
                  where: { location: { equals: inputData.location }
                }});
                if (operation === 'create') {
                  return (loc + 1);
                };
                return resolvedData.serial;
              },
            },
          }),
        },
      }),

      // timestamp the creation date of the reaction
      writtenAt: timestamp({ defaultValue: { kind: 'now' }}),
    },

    // Admin UI settings
    ui: {
      listView: {
        initialColumns: ['title','author','location','serial','writtenAt'],
        initialSort: { field: 'location', direction: 'ASC' },
      },
      hideCreate: (session) => rules.hideCreateButton(session),
      hideDelete: (session) => rules.hideDeleteButton(session),
    },
    
  }),

  // list of game requests
  // requests auto-delete after 5 days
  Request: list({
    access: {
      operation: {
        create: () => true,
        query: () => true,
        update: (session) => permissions.isDM(session) || permissions.isAdmin(session),
        delete: () => true,
      },
    },
    fields: {
      // the user or character who requested the game
      who: text(),

      // the game type the character requested
      gameType: select({
        type: 'string',
        defaultValue: '1v1',
        options: [
          {
            label: 'Magán',
            value: '1v1',
          },
          {
            label: 'Magán Mesélővel',
            value: '1v1DM',
          },
          {
            label: 'Multi',
            value: 'multi',
          },
          {
            label: 'Multi Mesélővel',
            value: 'multiDM',
          }
        ],
      }),

      // description of game the character wants to play out
      description: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),

      // accept or reject a game request with DM
      ...group({
        label: 'Játékfelkérés elfogadása/elutasítása',
        description: 'Csak Mesélő felkérős játékoknál múködik',
        fields: {
         accepted: checkbox({ defaultValue: false }),
         rejected: checkbox({ defaultValue: false }),
        }
      }),

      // reason for rejection
      rejectionReason: text(),

      // rejection feedback
      rejectionFeedback: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),

      // timestamp when the request was made
      requestedAt: timestamp({
        defaultValue: { kind: 'now'}
      })
    },
    ui: {
      labelField: 'who',
      listView: {
        initialColumns: ['who','gameType','accepted','rejected','requestedAt'],
        defaultFieldMode: 'read',
      },
      itemView: {
        defaultFieldMode: 'read',
      },
      hideCreate: (session) => rules.hideCreateButton(session),
      hideDelete: (session) => rules.hideDeleteButton(session),
      description: 'Játékostárs keresések(JTK) listája',
    },
  }),

  // list of available, playable races on Wazi
  Race: list({
    access: {
      operation: {
        create: () => true,
        query: () => true,
        update: () => true,
        delete: () => true,
      },
    },
    fields: {
      // name of the race
      name: text({ validation: { isRequired: true }, isIndexed: 'unique' }),

      // life phases and other general description
      description: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),

      // ASI table
      ...group({
          label: 'Képesség Pontszám Bónusz',
          description: 'Fajfüggő',
          fields: {
            strength: integer({ defaultValue: 0 }),
            dexterity: integer({ defaultValue: 0 }),
            constitution: integer({ defaultValue: 0 }),
            intelligence: integer({ defaultValue: 0 }),
            wisdom: integer({ defaultValue: 0 }),
            charisma: integer({ defaultValue: 0 }),
          },
      }),
    },

    // Admin UI settings
    ui: {
      hideCreate: (session) => rules.hideCreateButton(session),
      hideDelete: (session) => rules.hideDeleteButton(session),
      labelField: 'name',
      listView: {
        initialColumns: ['name','strength','dexterity','constitution','intelligence','wisdom','charisma'],
      },
      description: 'Fajok listája Wazi-n',
    }
  }),

  // list of languages spoken in Wazi
  Language: list({
    access: {
      operation: {
        create: () => true,
        query: () => true,
        update: () => true,
        delete: (session) => permissions.isAdmin(session),
      },
    },
    fields: {
      // the name of the language spoken in Wazi
      name: text({ validation: { isRequired: true }})
    },

    // Admin UI settings
    ui: {
      hideCreate: (session) => rules.hideCreateButton(session),
      hideDelete: (session) => rules.hideDeleteButton(session),
      labelField: 'name',
      description: 'Beszélt nyelvek listája Wazi-n',
    },
  }),

  // the main calendar of the game, accepted mostly by humans 
  Calendar: list({
    access: {
      operation: {
        create: () => true,
        query: () => true,
        update: () => true,
        delete: () => true,
      },
    },
    fields: {
      // JSON fields as calendar data containers
      calendarName: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
      startingYear: json({ defaultValue: { 'year': 0 } }),
      firstDay: json({ defaultValue: { 'first_day': 0 } }),
      yearLength: json({ defaultValue: { 'year_len': 360 } }),
      numberOfMonths: json({ defaultValue: { 'n_months': 11 } }),
      months: json({ defaultValue: { 'months': ["Ananeeh","Arakeh","Thanike","Thalyta","Beetary","Kaniti","Shadokti","Jashruna","Eurnia","Bilara","Kathirikh"] } }),
      monthsLength: json({ defaultValue: { 'month_len': {"Ananeeh":33,"Arakeh":33,"Thanike":33,"Thalyta":32,"Beetary":33,"Kaniti":33,"Shadokti":32,"Jashruna":33,"Eurnia":33,"Bilara":33,"Kathirikh":32} } }),
      weekLength: json({ defaultValue: { 'week_len': 7 } }),
      weekDays: json({ defaultValue: { 'weekdays': ["Katib","Suriel","Binem","Jeha","Daliel","Penur","Durim"] } }),
      numberOfMoons: json({ defaultValue: { 'n_moons': 1 } }),
      moons: json({ defaultValue: { 'moons': ["Camua"] } }),
      lunarCycle: json({ defaultValue: { 'lunar_cyc': {"Camua":32} } }),
    },

    // Admin UI settings
    ui: {
      labelField: 'calendarName',
      listView: {
        initialColumns: ['calendarName','id'],
      },
      description: 'Wazi Naptár JSON formátumban GraphQL lekérdezésekhez',
    }
  }),

  // log of when the users logged in and out of the system
  Log: list({
    access: {
      operation: {
        create: () => true,
        query: (session) => (permissions.isAdmin(session)),
        update: () => false,
        delete: (session) => permissions.isAdmin(session),
      },
    },
    ui: {
      hideCreate: (session) => rules.hideCreateButton(session),
      hideDelete: (session) => rules.hideDeleteButton(session),
      labelField: 'who',
      listView: {
        initialColumns: ['id','who','what','when'],
      },
      description: 'Be/kilépési Napló',
    },
    fields: {
      who: text({
        validation: { isRequired: true }
      }),
      what: select({
        type: 'string',
        defaultValue: '',
        options: [
          {
            label: 'Login',
            value: 'login',
          },
          {
            label: 'Logout',
            value: 'logout',
          }
        ],
      }),
      when: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  // private messaging
  PM: list({
    access: {
      operation: {
        create: () => true,
        query: () => true,
        update: () => true,
        delete: (session) => permissions.isAdmin(session),
      },
      filter: {
        query: ({ session, context, listKey, operation }) => {
          return { reported: { equals: true } };
        },
      },
    },
    ui: {
      hideCreate: (session) => rules.hideCreateButton(session),
      hideDelete: (session) => rules.hideDeleteButton(session),
      labelField: 'who',
      listView: {
        initialColumns: ['id','reported','who','toWhom','when'],
      },
      description: 'Privát üzenetek',
    },
    fields: {
      who: text({
        validation: { isRequired: true }
      }),
      toWhom: text({
        validation: { isRequired: true }
      }),
      what: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
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
          create: ({ session, context, listKey, fieldKey, operation, inputData }) => true,
          update: ({ session, context, listKey, fieldKey, operation, inputData, item }) => false,
        }
      }),
      reported: checkbox(),
      when: timestamp({
        defaultValue: { kind: 'now' },
      }),
    }
  }),

};
