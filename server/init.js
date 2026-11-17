const bcryptjs = require('bcryptjs');

const mongoose = require('mongoose');

const Comment = require('./models/comments');
const Community = require('./models/communities');
const LinkFlair = require('./models/linkflairs');
const Post = require('./models/posts');
const User = require('./models/users');

const args = process.argv.slice(2);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (args.length < 4) {
    console.error('You should provide four arguments.');
    console.error('The first argument should be a MongoDB URL.');
    console.error('The second argument should be the email address for the admin account.');
    console.error('The third argument should be the display name for the admin account.');
    console.error('The fourth argument should be the password for the admin account.');
    process.exit(1);
}

if (!args[0].startsWith('mongodb')) {
    console.error('The first argument should be a MongoDB URL.');
    process.exit(1);
}

if (!emailRegex.test(args[1])) {
    console.error('The second argument should be a valid email address.');
    process.exit(1);
}

// The sample users, who take turns voting on the sample posts and comments.
const voters = [];
let nextVoter = 0;

main();

// Dates are relative to the moment the script runs, so the content always looks recent.
function ago({ days = 0, hours = 0, minutes = 0 }) {
    return new Date(Date.now() - ((days * 24 + hours) * 60 + minutes) * 60000);
}

async function main() {
    try {
        await mongoose.connect(args[0]);
        console.log('MongoDB connected.\n');
    } catch (error) {
        console.error(`MongoDB connection error: ${error}.`)
        process.exit(1);
    }

    await Promise.all([Comment.deleteMany({}), Community.deleteMany({}), LinkFlair.deleteMany({}), Post.deleteMany({}), User.deleteMany({})]);
    console.log('Emptied Comment collection.\nEmptied Community collection.\nEmptied LinkFlair collection.\nEmptied Post collection.\nEmptied User collection.\n');

    const users = {};

    const savedUsers = await initializeUsers([
        {
            firstName: 'Maya',
            lastName: 'Okafor',
            email: 'maya@example.com',
            displayName: 'maya_codes',
            password: '1234',
            memberSince: ago({ days: 210 })
        },
        {
            firstName: 'Devon',
            lastName: 'Kim',
            email: 'devon@example.com',
            displayName: 'devon_k',
            password: '1234',
            memberSince: ago({ days: 402 })
        },
        {
            firstName: 'Priya',
            lastName: 'Sharma',
            email: 'priya@example.com',
            displayName: 'priya.s',
            password: '1234',
            memberSince: ago({ days: 95 })
        },
        {
            firstName: 'Tomasz',
            lastName: 'Nowak',
            email: 'tomasz@example.com',
            displayName: 'tomasz',
            password: '1234',
            memberSince: ago({ days: 330 })
        },
        {
            firstName: 'Lena',
            lastName: 'Fischer',
            email: 'lena@example.com',
            displayName: 'lena_runs',
            password: '1234',
            memberSince: ago({ days: 268 })
        },
        {
            firstName: 'Basil',
            lastName: 'Hart',
            email: 'basil@example.com',
            displayName: 'old_man_basil',
            password: '1234',
            memberSince: ago({ days: 511 })
        },
        {
            firstName: 'Ines',
            lastName: 'Moreau',
            email: 'ines@example.com',
            displayName: 'quietreader',
            password: '1234',
            memberSince: ago({ days: 187 })
        },
        {
            firstName: 'Carl',
            lastName: 'Jensen',
            email: 'carl@example.com',
            displayName: 'keycap_carl',
            password: '1234',
            memberSince: ago({ days: 143 })
        },
        {
            firstName: 'Sam',
            lastName: 'Rivera',
            email: 'sam@example.com',
            displayName: 'sourdough_sam',
            password: '1234',
            memberSince: ago({ days: 356 })
        },
        {
            firstName: 'Ivy',
            lastName: 'Tanaka',
            email: 'ivy@example.com',
            displayName: 'fern_and_ivy',
            password: '1234',
            memberSince: ago({ days: 74 })
        },
        {
            firstName: 'Julia',
            lastName: 'Weber',
            email: 'julia@example.com',
            displayName: 'julia_w',
            password: '1234',
            memberSince: ago({ days: 229 })
        },
        {
            firstName: 'Nate',
            lastName: 'Turner',
            email: 'nate@example.com',
            displayName: 'nate_t',
            password: '1234',
            memberSince: ago({ days: 58 })
        },
        {
            firstName: 'Hal',
            lastName: 'Brandt',
            email: 'hal@example.com',
            displayName: 'hot_take_hal',
            password: '1234',
            memberSince: ago({ days: 41 })
        }
    ]);

    savedUsers.forEach(savedUser => users[savedUser.displayName] = savedUser);
    voters.push(...savedUsers.filter(savedUser => !savedUser.isAdmin));

    const linkFlairs = {};

    for (let content of ['Question', 'Discussion', 'Show and Tell', 'Today I Learned', 'Recipe', 'Guide', 'Recommendation', 'Trip Report']) {
        linkFlairs[content] = await createLinkFlair({ content });
    }

    const communities = [
        {
            name: 'Web Development',
            description: 'Frontend, backend, and everything in between. Share what you are building, ask for a code review, and trade notes on tools.\nNew here? The [MDN learning area](https://developer.mozilla.org/en-US/docs/Learn) is a good place to start.',
            startDate: ago({ days: 390 }),
            members: [users.devon_k, users.maya_codes, users['priya.s'], users.tomasz, users.nate_t, users.julia_w, users.quietreader, users.keycap_carl, users.hot_take_hal],
            owner: users.devon_k,
            postIDs: [{
                title: 'How do you structure an Express API once it grows past a handful of routes?',
                content: 'My side project started as a single server.js and now has around forty endpoints. I split the routes by resource, but the handlers are full of repeated validation and permission checks.\nDo you move that into middleware, a service layer, or something else? I am curious what has held up for people on real projects.',
                postedDate: ago({ hours: 5 }),
                views: 412,
                upvotes: 9,
                upvotedBy: [users.maya_codes],
                linkFlairID: linkFlairs['Question'],
                postedBy: users['priya.s'],
                commentIDs: [{
                    content: 'Routers per resource is the right first step. Next I would pull anything that touches more than one model into plain functions the handlers call. A handler then reads like a script: check the input, check the permission, call the function, send the response.',
                    commentedDate: ago({ hours: 3, minutes: 30 }),
                    upvotes: 7,
                    upvotedBy: [users.maya_codes],
                    commentedBy: users.devon_k,
                    commentIDs: [{
                        content: 'That matches what hurts most right now. Deleting a community has to clean up its posts, their comments and the memberships, and all of that is sitting inside one route.',
                        commentedDate: ago({ hours: 3, minutes: 5 }),
                        upvotes: 3,
                        commentedBy: users['priya.s'],
                        commentIDs: [{
                            content: 'Exactly the kind of thing to extract. Cascading deletes are much easier to test as functions than through HTTP.',
                            commentedDate: ago({ hours: 2, minutes: 45 }),
                            upvotes: 4,
                            upvotedBy: [users.maya_codes],
                            commentedBy: users.devon_k,
                            commentIDs: [{
                                content: 'And easier to reuse. Deleting a user needs the same cleanup as deleting each of their posts.',
                                commentedDate: ago({ hours: 2, minutes: 20 }),
                                upvotes: 2,
                                commentedBy: users.tomasz
                            }]
                        }]
                    }, {
                        content: 'Seconding this. I resisted a service layer for a year because it sounded like ceremony. It turned out to be functions in another file.',
                        commentedDate: ago({ hours: 3, minutes: 15 }),
                        upvotes: 2,
                        commentedBy: users.nate_t
                    }]
                }, {
                    content: 'For validation, check at the edge and again in the schema. The [Express routing guide](https://expressjs.com/en/guide/routing.html) shows how far router-level middleware can take you before you need anything heavier.',
                    commentedDate: ago({ hours: 4, minutes: 40 }),
                    upvotes: 5,
                    commentedBy: users.julia_w,
                    commentIDs: [{
                        content: 'Same here. Client-side checks are for the person typing, server-side checks are for the data.',
                        commentedDate: ago({ hours: 4, minutes: 10 }),
                        upvotes: 3,
                        commentedBy: users.maya_codes
                    }]
                }, {
                    content: 'Whatever you pick, write the permission rules down in one place. Mine lived in my head until an admin bug proved otherwise.',
                    commentedDate: ago({ hours: 4, minutes: 20 }),
                    upvotes: 2,
                    commentedBy: users.quietreader
                }]
            }, {
                title: 'TIL a numeric expiresIn in jsonwebtoken means seconds, not milliseconds',
                content: 'I set a token to expire in 60000 * 60 * 24, thinking that was one day. The library reads plain numbers as seconds, so my sessions were valid for about a thousand days.\nPass a string such as "1d", or do the math in seconds.',
                postedDate: ago({ days: 1, hours: 3 }),
                views: 286,
                upvotes: 8,
                downvotes: 1,
                linkFlairID: linkFlairs['Today I Learned'],
                postedBy: users.tomasz,
                commentIDs: [{
                    content: 'The cookie maxAge next to it is in milliseconds, which makes this one very easy to get wrong.',
                    commentedDate: ago({ days: 1, hours: 1 }),
                    upvotes: 4,
                    commentedBy: users.nate_t,
                    commentIDs: [{
                        content: 'That is exactly how I got there. I copied the number from the cookie options.',
                        commentedDate: ago({ hours: 22 }),
                        upvotes: 2,
                        commentedBy: users.tomasz
                    }]
                }, {
                    content: 'Going to check my own project now. Thank you for writing this up.',
                    commentedDate: ago({ hours: 20 }),
                    upvotes: 1,
                    commentedBy: users['priya.s']
                }]
            }, {
                title: 'A dark mode toggle in twenty lines, no dependencies',
                content: 'A data-theme attribute on the root element, two sets of custom properties, and a button that flips the attribute and saves the choice to localStorage.\nIt reads prefers-color-scheme on the first visit, so the page starts in whatever the system uses.',
                postedDate: ago({ days: 2, hours: 2 }),
                views: 233,
                upvotes: 6,
                linkFlairID: linkFlairs['Show and Tell'],
                postedBy: users.nate_t,
                commentIDs: [{
                    content: 'Reading the system preference first is the detail most toggles skip. Nice work.',
                    commentedDate: ago({ days: 1, hours: 22 }),
                    upvotes: 3,
                    commentedBy: users.julia_w,
                    commentIDs: [{
                        content: 'Thanks. That part took longer than everything else combined.',
                        commentedDate: ago({ days: 1, hours: 20 }),
                        upvotes: 1,
                        commentedBy: users.nate_t
                    }]
                }]
            }, {
                title: 'What is the smallest change that made your CSS easier to maintain?',
                content: 'For me it was one stylesheet per component, named after the component. Nothing clever, but I always know where a rule lives.\nWhat was yours?',
                postedDate: ago({ days: 3, hours: 6 }),
                views: 198,
                upvotes: 5,
                linkFlairID: linkFlairs['Discussion'],
                postedBy: users.julia_w,
                commentIDs: [{
                    content: 'Custom properties for colors and spacing. Changing the theme went from a search and replace to editing six lines.',
                    commentedDate: ago({ days: 3, hours: 2 }),
                    upvotes: 3,
                    commentedBy: users.maya_codes
                }, {
                    content: 'Deleting the rules I was afraid to touch. Almost none of them were still used.',
                    commentedDate: ago({ days: 2, hours: 20 }),
                    upvotes: 1,
                    commentedBy: users.keycap_carl
                }]
            }, {
                title: 'Do you still reach for a state library, or is component state enough?',
                content: 'My last two apps kept everything in a top-level component and passed it down as props. It was more typing, but I never had to wonder where a value came from.\nWhere do you draw the line?',
                postedDate: ago({ days: 6, hours: 5 }),
                views: 318,
                upvotes: 6,
                downvotes: 1,
                linkFlairID: linkFlairs['Discussion'],
                postedBy: users.devon_k,
                commentIDs: [{
                    content: 'When three unrelated screens need the same data and you are passing props through components that do not use them. Before that point a library is overhead.',
                    commentedDate: ago({ days: 6, hours: 1 }),
                    upvotes: 4,
                    commentedBy: users.tomasz,
                    commentIDs: [{
                        content: 'That is a better rule than the one I had, which was a vague feeling of dread.',
                        commentedDate: ago({ days: 5, hours: 22 }),
                        upvotes: 2,
                        commentedBy: users.devon_k
                    }]
                }, {
                    content: 'Component state until it hurts. It took a surprisingly long time to hurt.',
                    commentedDate: ago({ days: 5, hours: 15 }),
                    upvotes: 2,
                    commentedBy: users['priya.s']
                }, {
                    content: 'State libraries are always overkill. If your app needs one, your app is designed wrong.',
                    commentedDate: ago({ days: 5, hours: 9 }),
                    downvotes: 4,
                    commentedBy: users.hot_take_hal
                }]
            }]
        },
        {
            name: 'Home Cooking',
            description: 'Recipes, techniques and honest reports from ordinary kitchens. Post what worked, what failed, and what you would change next time.',
            startDate: ago({ days: 340 }),
            members: [users.sourdough_sam, users.maya_codes, users.old_man_basil, users.lena_runs, users.fern_and_ivy, users.julia_w, users['priya.s']],
            owner: users.sourdough_sam,
            postIDs: [{
                title: 'Weeknight sourdough focaccia, no mixer needed',
                content: 'Mix 500 g flour, 400 g water, 100 g active starter and 10 g salt before work. Fold it twice in the evening, rest it in the fridge overnight, then bake at 230 C for 25 minutes.\nThe long cold rest does the kneading for you.',
                postedDate: ago({ hours: 2 }),
                views: 173,
                upvotes: 7,
                upvotedBy: [users.maya_codes],
                linkFlairID: linkFlairs['Recipe'],
                postedBy: users.sourdough_sam,
                commentIDs: [{
                    content: 'Made this last night with rosemary and flaky salt. The crumb was better than my usual kneaded loaf.',
                    commentedDate: ago({ hours: 1, minutes: 30 }),
                    upvotes: 3,
                    commentedBy: users.old_man_basil,
                    commentIDs: [{
                        content: 'Glad it worked. Rosemary is my favorite on this one too.',
                        commentedDate: ago({ hours: 1, minutes: 5 }),
                        upvotes: 2,
                        commentedBy: users.sourdough_sam
                    }]
                }, {
                    content: 'Does it work with a starter straight from the fridge, or should I feed it first?',
                    commentedDate: ago({ minutes: 40 }),
                    upvotes: 1,
                    commentedBy: users.maya_codes
                }]
            }, {
                title: 'Is a carbon steel pan worth it if I already have cast iron?',
                content: 'I cook on cast iron almost every day and I am happy with it. People keep telling me carbon steel is lighter and heats faster.\nIs the difference big enough to justify another pan to season?',
                postedDate: ago({ days: 1, hours: 8 }),
                views: 264,
                upvotes: 6,
                downvotes: 1,
                linkFlairID: linkFlairs['Question'],
                postedBy: users.old_man_basil,
                commentIDs: [{
                    content: 'Worth it for eggs and anything you toss. I still reach for cast iron when I want a hard sear.',
                    commentedDate: ago({ days: 1, hours: 5 }),
                    upvotes: 4,
                    commentedBy: users.julia_w
                }, {
                    content: 'The weight alone sold me. My wrist is grateful.',
                    commentedDate: ago({ days: 1, hours: 2 }),
                    upvotes: 2,
                    commentedBy: users.lena_runs
                }]
            }, {
                title: 'The batch cooking plan that got me through a busy month',
                content: 'Two hours on Sunday: one grain, one pot of beans, two roasted trays of vegetables and a sauce. Everything else that week is assembly.\nI wrote the full plan up with a shopping list in the comments.',
                postedDate: ago({ days: 6, hours: 4 }),
                views: 351,
                upvotes: 8,
                linkFlairID: linkFlairs['Guide'],
                postedBy: users.lena_runs,
                commentIDs: [{
                    content: 'Shopping list: rice or farro, dried chickpeas, two kinds of root vegetables, a head of broccoli, lemons, tahini, garlic and whatever greens look good.',
                    commentedDate: ago({ days: 6, hours: 3 }),
                    upvotes: 5,
                    commentedBy: users.lena_runs
                }, {
                    content: 'Tried it this week. The sauce is what stops it from feeling like leftovers.',
                    commentedDate: ago({ days: 5, hours: 20 }),
                    upvotes: 2,
                    commentedBy: users.fern_and_ivy
                }]
            }]
        },
        {
            name: 'Book Club',
            description: 'One book a month, read together. Nominations open on the first, the discussion thread opens on the fifteenth. Spoilers stay inside the discussion threads.',
            startDate: ago({ days: 180 }),
            members: [users.quietreader, users.maya_codes, users['priya.s'], users.old_man_basil, users.julia_w],
            owner: users.quietreader,
            postIDs: [{
                title: 'This month\'s pick: The Left Hand of Darkness. Discussion thread',
                content: 'The thread is open. To start us off: how did the reports and folk tales between the chapters change the way you read the main story?',
                postedDate: ago({ hours: 9 }),
                views: 148,
                upvotes: 6,
                linkFlairID: linkFlairs['Discussion'],
                postedBy: users.quietreader,
                commentIDs: [{
                    content: 'They slowed me down in a good way. By the time the journey across the ice starts, the world already feels old.',
                    commentedDate: ago({ hours: 7 }),
                    upvotes: 3,
                    commentedBy: users['priya.s'],
                    commentIDs: [{
                        content: 'Well put. The ice chapters would not land the same way without that weight behind them.',
                        commentedDate: ago({ hours: 6 }),
                        upvotes: 2,
                        commentedBy: users.quietreader
                    }]
                }, {
                    content: 'This was a reread for me after thirty years, and it is a different book now. I noticed the friendship far more than the politics.',
                    commentedDate: ago({ hours: 4 }),
                    upvotes: 2,
                    commentedBy: users.old_man_basil
                }]
            }, {
                title: 'Looking for short novels I can finish in a weekend',
                content: 'Work has been busy and I keep abandoning long books halfway through. What are your favorite novels under 200 pages?',
                postedDate: ago({ days: 4, hours: 2 }),
                views: 231,
                upvotes: 7,
                linkFlairID: linkFlairs['Recommendation'],
                postedBy: users.maya_codes,
                commentIDs: [{
                    content: 'We Have Always Lived in the Castle. Short, strange, and impossible to put down.',
                    commentedDate: ago({ days: 4 }),
                    upvotes: 4,
                    commentedBy: users.quietreader
                }, {
                    content: 'Convenience Store Woman. I read it in one sitting on a train.',
                    commentedDate: ago({ days: 3, hours: 18 }),
                    upvotes: 3,
                    commentedBy: users.julia_w
                }, {
                    content: 'The Old Man and the Sea, and not only because of my username.',
                    commentedDate: ago({ days: 3, hours: 9 }),
                    upvotes: 2,
                    commentedBy: users.old_man_basil
                }]
            }]
        },
        {
            name: 'Trail Running',
            description: 'Routes, race reports, gear and training for people who would rather run on dirt. All paces welcome.',
            startDate: ago({ days: 255 }),
            members: [users.lena_runs, users.tomasz, users.nate_t, users.sourdough_sam],
            owner: users.lena_runs,
            postIDs: [{
                title: 'First 25K done. Three things I would tell myself before the start',
                content: 'Walk the climbs from the first kilometer, eat before you feel hungry, and do not trust a downhill just because it looks smooth.\nI finished an hour slower than I planned and I have never been happier with a result.',
                postedDate: ago({ hours: 7 }),
                views: 327,
                upvotes: 9,
                linkFlairID: linkFlairs['Trip Report'],
                postedBy: users.lena_runs,
                commentIDs: [{
                    content: 'Congratulations. Walking the early climbs is the lesson everyone has to learn in person.',
                    commentedDate: ago({ hours: 6 }),
                    upvotes: 4,
                    commentedBy: users.tomasz,
                    commentIDs: [{
                        content: 'I was told. I did not listen. Now I tell others.',
                        commentedDate: ago({ hours: 5 }),
                        upvotes: 2,
                        commentedBy: users.lena_runs
                    }]
                }, {
                    content: 'What did you eat during the race? I am still working that part out.',
                    commentedDate: ago({ hours: 3 }),
                    upvotes: 1,
                    commentedBy: users.nate_t
                }]
            }, {
                title: 'How do you carry water on runs longer than two hours?',
                content: 'A handheld bottle is fine for an hour, but it is not enough for long days and I do not love the feel of a waist belt. Is a vest the only real answer?',
                postedDate: ago({ days: 2, hours: 5 }),
                views: 142,
                upvotes: 4,
                linkFlairID: linkFlairs['Question'],
                postedBy: users.nate_t,
                commentIDs: [{
                    content: 'A vest with two soft flasks in front. After ten minutes you forget you are wearing it.',
                    commentedDate: ago({ days: 2, hours: 1 }),
                    upvotes: 3,
                    commentedBy: users.lena_runs
                }]
            }]
        },
        {
            name: 'Mechanical Keyboards',
            description: 'Builds, switches, keycaps and layouts. Photos of your desk are welcome. So are questions from people about to buy their first board.',
            startDate: ago({ days: 140 }),
            members: [users.keycap_carl, users.devon_k, users.tomasz, users.nate_t, users.hot_take_hal],
            owner: users.keycap_carl,
            postIDs: [{
                title: 'Finished my first hand-wired build. It only took four evenings',
                content: 'Forty-two keys, a column-staggered layout and more solder joints than I care to count. Two diodes went in backwards and one row was dead until I found a cold joint.\nIt types beautifully and I am already planning the next one.',
                postedDate: ago({ hours: 12 }),
                views: 509,
                upvotes: 10,
                linkFlairID: linkFlairs['Show and Tell'],
                postedBy: users.keycap_carl,
                commentIDs: [{
                    content: 'Hand-wiring a first build is brave. Which firmware did you flash?',
                    commentedDate: ago({ hours: 11 }),
                    upvotes: 3,
                    commentedBy: users.devon_k,
                    commentIDs: [{
                        content: 'QMK. The [documentation](https://docs.qmk.fm) walked me through the whole matrix setup.',
                        commentedDate: ago({ hours: 10 }),
                        upvotes: 2,
                        commentedBy: users.keycap_carl
                    }]
                }, {
                    content: 'Backwards diodes are a rite of passage. Welcome.',
                    commentedDate: ago({ hours: 8 }),
                    upvotes: 2,
                    commentedBy: users.tomasz
                }]
            }, {
                title: 'Linear or tactile switches for long coding sessions?',
                content: 'I type for eight hours a day and my current linears feel a little vague. Has anyone switched to tactiles and stayed with them?',
                postedDate: ago({ days: 5, hours: 3 }),
                views: 276,
                upvotes: 5,
                downvotes: 1,
                linkFlairID: linkFlairs['Question'],
                postedBy: users.devon_k,
                commentIDs: [{
                    content: 'Light tactiles, lubed. You get the feedback without the fatigue.',
                    commentedDate: ago({ days: 5 }),
                    upvotes: 3,
                    commentedBy: users.keycap_carl
                }, {
                    content: 'I went the other way and came back within a month. Try a sampler pack before you commit.',
                    commentedDate: ago({ days: 4, hours: 12 }),
                    upvotes: 1,
                    commentedBy: users.nate_t
                }, {
                    content: 'A membrane keyboard does the same job. Everyone here is wasting their money.',
                    commentedDate: ago({ days: 4, hours: 6 }),
                    upvotes: 1,
                    downvotes: 3,
                    commentedBy: users.hot_take_hal
                }]
            }]
        },
        {
            name: 'Houseplants',
            description: 'Leaves, light and the occasional fungus gnat. Ask for a diagnosis, show off new growth, or swap cuttings.',
            startDate: ago({ days: 70 }),
            members: [users.fern_and_ivy, users.sourdough_sam, users['priya.s'], users.lena_runs, users.old_man_basil],
            owner: users.fern_and_ivy,
            postIDs: [{
                title: 'My monstera finally put out a split leaf after two years',
                content: 'Two years of solid heart-shaped leaves, and this week the newest one unfurled with three splits. The only thing I changed was moving it a meter closer to the window.',
                postedDate: ago({ days: 1, hours: 1 }),
                views: 219,
                upvotes: 8,
                linkFlairID: linkFlairs['Show and Tell'],
                postedBy: users.fern_and_ivy,
                commentIDs: [{
                    content: 'More light is the answer to almost every monstera question. Congratulations on the new leaf.',
                    commentedDate: ago({ hours: 22 }),
                    upvotes: 3,
                    commentedBy: users.sourdough_sam
                }, {
                    content: 'Mine did the same after I gave it a moss pole. Patience pays.',
                    commentedDate: ago({ hours: 18 }),
                    upvotes: 1,
                    commentedBy: users.old_man_basil
                }]
            }, {
                title: 'Yellow leaves on a pothos: too much water or not enough light?',
                content: 'The oldest leaves near the soil are turning yellow one at a time. I water once a week and it sits about three meters from a north window.',
                postedDate: ago({ days: 8, hours: 4 }),
                views: 164,
                upvotes: 3,
                linkFlairID: linkFlairs['Question'],
                postedBy: users['priya.s'],
                commentIDs: [{
                    content: 'Most likely water. In low light it drinks slowly, so weekly is too often. Wait until the top few centimeters of soil are dry.',
                    commentedDate: ago({ days: 8, hours: 1 }),
                    upvotes: 4,
                    commentedBy: users.fern_and_ivy,
                    commentIDs: [{
                        content: 'That makes sense. The pot does feel heavy for days after watering.',
                        commentedDate: ago({ days: 7, hours: 20 }),
                        upvotes: 1,
                        commentedBy: users['priya.s']
                    }]
                }]
            }]
        }
    ];

    for (let community of communities) {
        await createCommunity(community);
    }

    const commentCollection = await Comment.find({});

    for (let comment of commentCollection) {
        console.log(`Comment ${comment._id}:`);
        console.log(`\tcontent: ${comment.content}`);
        console.log(`\tcommentedDate: ${comment.commentedDate}`);
        console.log(`\tvoteCount: ${comment.voteCount}`);
        console.log(`\tpostID: ${comment.postID}`);
        console.log(`\tcommentedBy: ${comment.commentedBy}`);
        console.log(`\tcommentIDs: [${comment.commentIDs}]\n`);
    }

    const communityCollection = await Community.find({});

    for (let community of communityCollection) {
        console.log(`Community ${community._id}:`);
        console.log(`\tname: ${community.name}`);
        console.log(`\tdescription: ${community.description}`);
        console.log(`\tstartDate: ${community.startDate}`);
        console.log(`\towner: ${community.owner}`);
        console.log(`\tmembers: [${community.members}]`);
        console.log(`\tpostIDs: ${community.postIDs}`);
        console.log(`\tmemberCount: ${community.memberCount}\n`);
    }

    const linkFlairCollection = await LinkFlair.find({});

    for (let linkFlair of linkFlairCollection) {
        console.log(`LinkFlair ${linkFlair._id}:`);
        console.log(`\tcontent: ${linkFlair.content}\n`);
    }

    const postCollection = await Post.find({});

    for (let post of postCollection) {
        console.log(`Post ${post._id}:`);
        console.log(`\ttitle: ${post.title}`);
        console.log(`\tcontent: ${post.content}`);
        console.log(`\tpostedDate: ${post.postedDate}`);
        console.log(`\tviews: ${post.views}`);
        console.log(`\tvoteCount: ${post.voteCount}`);
        console.log(`\tcommunityID: ${post.communityID}`);
        console.log(`\tpostedBy: ${post.postedBy}`);
        console.log(`\tlinkFlairID: ${post.linkFlairID}`);
        console.log(`\tcommentIDs: [${post.commentIDs}]\n`);
    }

    const userCollection = await User.find({});

    for (let user of userCollection) {
        console.log(`User ${user._id}:`);
        console.log(`\tfirstName: ${user.firstName}`);
        console.log(`\tlastName: ${user.lastName}`);
        console.log(`\temail: ${user.email}`);
        console.log(`\tdisplayName: ${user.displayName}`);
        console.log(`\tmemberSince: ${user.memberSince}`);
        console.log(`\treputation: ${user.reputation}`);
        console.log(`\tisAdmin: ${user.isAdmin}`);
        console.log(`\tcommunityIDs: [${user.communityIDs}]`);
        console.log(`\tpostIDs: [${user.postIDs}]`);
        console.log(`\tupvotedPostIDs: [${user.upvotedPostIDs}]`);
        console.log(`\tdownvotedPostIDs: [${user.downvotedPostIDs}]`);
        console.log(`\tcommentIDs: [${user.commentIDs}]`);
        console.log(`\tupvotedCommentIDs: [${user.upvotedCommentIDs}]`);
        console.log(`\tdownvotedCommentIDs: [${user.downvotedCommentIDs}]\n`);
    }

    process.exit(0);
}

async function createCommunity(community) {
    try {
        const newCommunity = new Community({
            name: community.name,
            description: community.description,
            startDate: community.startDate,
            owner: community.owner,
            members: community.members
        });

        if (community.postIDs) {
            for (let postID of community.postIDs) {
                postID.communityID = newCommunity;
                newCommunity.postIDs.push(await createPost(postID));
            }
        }

        const savedCommunity = await newCommunity.save();
        await Promise.all(savedCommunity.members.map(member => User.findByIdAndUpdate(member._id, { $push: { communityIDs: savedCommunity } })));

        return savedCommunity;
    } catch (error) {
        console.error('Error at createCommunity: ', error);
        process.exit(1);
    }
}

async function createPost(post) {
    try {
        const newPost = new Post({
            title: post.title,
            content: post.content,
            postedDate: post.postedDate,
            views: post.views,
            communityID: post.communityID,
            postedBy: post.postedBy
        });

        if (post.linkFlairID) {
            newPost.linkFlairID = post.linkFlairID;
        }

        if (post.commentIDs) {
            for (let commentID of post.commentIDs) {
                newPost.commentIDs.push(await createComment({ ...commentID, postID: newPost }));
            }
        }

        newPost.voteCount = await castVotes(newPost, 'Post', post.postedBy, post);

        const savedPost = await newPost.save();
        await User.findByIdAndUpdate(savedPost.postedBy._id, { $push: { postIDs: savedPost } });

        return savedPost;
    } catch (error) {
        console.error('Error at createPost: ', error);
        process.exit(1);
    }
}

async function createComment(comment) {
    try {
        const newComment = new Comment({
            content: comment.content,
            commentedDate: comment.commentedDate,
            postID: comment.postID,
            commentedBy: comment.commentedBy
        });

        if (comment.commentIDs) {
            for (let commentID of comment.commentIDs) {
                newComment.commentIDs.push(await createComment({ ...commentID, postID: comment.postID }));
            }
        }

        newComment.voteCount = await castVotes(newComment, 'Comment', comment.commentedBy, comment);

        const savedComment = await newComment.save();
        await User.findByIdAndUpdate(comment.commentedBy._id, { $push: { commentIDs: savedComment } });

        return savedComment;
    } catch (error) {
        console.error('Error at createComment: ', error);
        process.exit(1);
    }
}

// Records the votes on the voters and on the author's reputation the way the vote routes do,
// and returns the resulting vote count. Voters in upvotedBy always upvote; the rest take turns.
async function castVotes(votable, kind, author, { upvotes = 0, downvotes = 0, upvotedBy = [] }) {
    const upvoters = [...upvotedBy];
    const downvoters = [];

    while (upvoters.length < upvotes || downvoters.length < downvotes) {
        const voter = voters[nextVoter++ % voters.length];

        if (voter === author || upvoters.includes(voter) || downvoters.includes(voter)) {
            continue;
        }

        if (upvoters.length < upvotes) {
            upvoters.push(voter);
        } else {
            downvoters.push(voter);
        }
    }

    await Promise.all([
        User.updateMany({ _id: { $in: upvoters.map(voter => voter._id) } }, { $push: { [`upvoted${kind}IDs`]: votable._id } }),
        User.updateMany({ _id: { $in: downvoters.map(voter => voter._id) } }, { $push: { [`downvoted${kind}IDs`]: votable._id } }),
        User.updateOne({ _id: author._id }, { $inc: { reputation: 5 * upvoters.length - 10 * downvoters.length } })
    ]);

    return upvoters.length - downvoters.length;
}

async function createUser(user) {
    try {
        const saltRounds = 10;
        const passwordHash = await bcryptjs.hash(user.password, saltRounds);

        const newUser = new User({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            displayName: user.displayName,
            passwordHash: passwordHash
        });

        if (user.memberSince) {
            newUser.memberSince = user.memberSince;
        }

        if (user.reputation) {
            newUser.reputation = user.reputation;
        }

        if (user.isAdmin) {
            newUser.isAdmin = user.isAdmin;
        }

        const savedUser = await newUser.save();

        return savedUser;
    } catch (error) {
        console.error('Error at createUser: ', error);
        process.exit(1);
    }
}

async function initializeUsers(users) {
    try {
        const savedAdmin = await createUser({
            firstName: 'Phreddit',
            lastName: 'Admin',
            email: args[1],
            displayName: args[2],
            password: args[3],
            memberSince: ago({ days: 540 }),
            reputation: 1000,
            isAdmin: true
        });

        const savedUsers = await Promise.all(users.map(user => createUser(user)));

        return [savedAdmin, ...savedUsers];
    } catch (error) {
        console.error('Error at initializeUsers: ', error);
        process.exit(1);
    }
}

async function createLinkFlair(linkFlair) {
    try {
        const newLinkFlair = new LinkFlair({
            content: linkFlair.content
        });

        const savedLinkFlair = await newLinkFlair.save();

        return savedLinkFlair;
    } catch (error) {
        console.error('Error at createLinkFlair: ', error);
        process.exit(1);
    }
}
