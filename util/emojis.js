global.emoji = {}
const emojis = [
    {
        name: 'deafened',
        mention: '<:deafened:884909716155805726>'
    },
    {
        name: 'undeafened',
        mention: '<:undeafened:884909716101271562>'
    },
    {
        name: 'muted',
        mention: '<:muted:884909716269056040>'
    },
    {
        name: 'unmuted',
        mention: '<:unmuted:884909716302618674>'
    },
    {
        name: 'voice_channel',
        mention: '<:voice:884909716231290910>'
    },
    {
        name: 'voice_channel_locked',
        mention: '<:voicelocked:884909716084518953>'
    },
    {
        name: 'channel',
        mention: '<:channel:884909716281630780>'
    },
    {
        name: 'channel_locked',
        mention: '<:channellocked:884909715837042759>'
    },
    {
        name: 'pin',
        mention: '<:pin:884909716327784469>'
    },
    {
        name: 'unpin',
        mention: '<:pinunread:884909715765723137>'
    },
    // Presence
    {
        name: 'presence_online',
        mention: '<:presence_online:884909715962875914>'
    },
    {
        name: 'presence_dnd',
        mention: '<:presence_dnd:884909716189368360>'
    },
    {
        name: 'presence_idle',
        mention: '<:presence_idle:884909715782504450>'
    },
    {
        name: 'presence_invisible',
        mention: '<:presence_invisible:884909716046757968>'
    },
    // Ghost Icons
    {
        name: 'thread',
        mention: '<:channelthread:884909716231323668>'
    },
    {
        name: 'nsfw',
        mention: '<:channelnsfw:884909715962880011>'
    },
    {
        name: 'emoji',
        mention: '<:emoji:884909716277428235>'
    },
    {
        name: 'role',
        mention: '<:role:884909715912527933>'
    },
    {
        name: 'rules',
        mention: '<:rules:884909716311011328>'
    },
    {
        name: 'members',
        mention: '<:members:884909716210343996>'
    },
    {
        name: 'invite',
        mention: '<:invite:884909715824476161>'
    },
    {
        name: 'verified',
        mention: '<:verified:884909716160016474>'
    },
    {
        name: 'mention',
        mention: '<:mention:884909716139040859>'
    },
    {
        name: 'slowmode',
        mention: '<:slowmode:884909716201947136>'
    },
    {
        name: 'owner',
        mention: '<:owner:884909716281651250>'
    },
    {
        name: 'reaction_add',
        mention: '<:addreaction:884909716285845564>'
    },
    {
        name: 'settings',
        mention: '<:settings:884909716151627777>'
    },
    {
        name: 'stream',
        mention: '<:stream:884909716239700008>'
    },
    {
        name: 'reply',
        mention: '<:reply:884909716269060116>'
    },
    {
        name: 'slash',
        mention: '<:slashcommand:884909716101267547>'
    },
    {
        name: 'rich_presence',
        mention: '<:richpresence:884909716155822110>'
    },
    // HypeSquad badges
    {
        name: 'hs_events',
        mention: '<:hypesquadevents:884909715757363201>'
    },
    {
        name: 'hs_brilliance',
        mention: '<:brilliance:884909716147429476>'
    },
    {
        name: 'hs_bravery',
        mention: '<:bravery:884909716180959303>'
    },
    {
        name: 'hs_balance',
        mention: '<:balance:884909716134830120>'
    },
    // Profile badges
    {
        name: 'certified_moderator',
        mention: '<:certifiedmoderator:884909716315176991>'
    },
    {
        name: 'nitro',
        mention: '<:nitro:884909716130648104>'
    },
    {
        name: 'partner',
        mention: '<:partner:884909716084510731>'
    },
    {
        name: 'bug_hunter_green',
        mention: '<:bughunter:884909715715420211>'
    },
    {
        name: 'bug_hunter_gold',
        mention: '<:bughuntergold:884909715929309285>'
    },
    {
        name: 'staff_tools',
        mention: '<:stafftools:884909715975467098>'
    },
    {
        name: 'bot_developer',
        mention: '<:verifiedbotdev:884909716285816852>'
    },
    {
        name: 'early_supporter',
        mention: '<:earlysupporter:884909716130660382>'
    },
    // Misc
    {
        name: 'arrow_join',
        mention: '<:joinarrow:884909715937693708>'
    },
    {
        name: 'update',
        mention: '<:update:884939768666947616>'
    },
    {
        name: 'updating',
        mention: '<a:updating:884909716231319572>'
    },
    {
        name: 'loading',
        mention: '<a:loading:884909716025790504>'
    },
    {
        name: 'authorized',
        aliases: ['auth'],
        mention: '<:authorized:884909716269056060>'
    },
    {
        name: 'x',
        mention: '<:x_:884940684832944168>'
    },
    {
        name: 'check',
        mention: '<:check:884940684455477249>'
    },
    // POSSUM EMOJIS!!!
    {
        name: 'possum',
        mention: '<:possum:909954590433243166>'
    },
    {
        name: 'possum_banana',
        mention: '<:bananapossum:909954603162951710>'
    }


]
let emoji = {
    number: [
    '0️⃣',
    '1️⃣',
    '2️⃣',
    '3️⃣',
    '4️⃣',
    '5️⃣',
    '6️⃣',
    '7️⃣',
    '8️⃣',
    '9️⃣'
    ]
};
emojis.forEach(e => {
    emoji[e.name] = e.mention;
    if (!e.mention) {output('yellow', 'Emoji', `Emoji ${e.name} has no mention.`); return};
    if (e.aliases) {
        e.aliases.forEach(a => {
            emoji[a] = e.mention;
        })
    }
})
module.exports = {
    global: {
        emoji: emoji
    }
}