// Usamos .js para poder exportar os dados diretamente
export const initialData = [
    {
        groupName: "LE SSERAFIM",
        logoUrl: "https://i.imgur.com/v8CPp6D.png", // Exemplo de logo
        collections: [
            {
                collectionName: "ANTIFRAGILE",
                cards: [
                    { id: "af_skr_01", member: "Sakura", imageUrl: "https://i.imgur.com/XF9hSj9.jpg", owned: true },
                    { id: "af_chy_01", member: "Chaewon", imageUrl: "https://i.imgur.com/39HjB8k.jpg", owned: false },
                    { id: "af_yjn_01", member: "Yunjin", imageUrl: "https://i.imgur.com/b9eXG4z.jpg", owned: true },
                    { id: "af_kzh_01", member: "Kazuha", imageUrl: "https://i.imgur.com/jAmAFy0.jpg", owned: false },
                    { id: "af_ech_01", member: "Eunchae", imageUrl: "https://i.imgur.com/8Q7S2rV.jpg", owned: false },
                ]
            },
            {
                collectionName: "EASY",
                cards: [
                    { id: "ea_skr_01", member: "Sakura", imageUrl: "https://i.imgur.com/J32Cg5R.jpg", owned: false },
                    { id: "ea_chy_01", member: "Chaewon", imageUrl: "https://i.imgur.com/33LhD54.jpg", owned: true },
                ]
            }
        ]
    },
    {
        groupName: "NewJeans",
        logoUrl: "https://i.imgur.com/aTq4tV2.png",
        collections: [
            {
                collectionName: "Get Up",
                cards: [
                    { id: "gu_hni_01", member: "Hanni", imageUrl: "https://i.imgur.com/8GvwV7Y.jpg", owned: true },
                    { id: "gu_min_01", member: "Minji", imageUrl: "https://i.imgur.com/Q3jH4wQ.jpg", owned: false },
                    { id: "gu_hae_01", member: "Haerin", imageUrl: "https://i.imgur.com/nU10r6f.jpg", owned: false },
                ]
            }
        ]
    }
];

// Opções de wallpapers
export const wallpapers = ['wallpaper1', 'wallpaper2', 'wallpaper3'];